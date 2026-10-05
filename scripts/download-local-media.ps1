param(
  [switch]$RetryOnly
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$assetRoot = Join-Path $PSScriptRoot "..\public\media"
$anatomyRoot = Join-Path $assetRoot "anatomy"
$exerciseRoot = Join-Path $assetRoot "exercises"
New-Item -ItemType Directory -Force -Path $anatomyRoot, $exerciseRoot | Out-Null

function Save-Asset([string]$uri, [string]$destination) {
  Invoke-WebRequest -UseBasicParsing -Uri $uri -OutFile $destination
}

function Save-SplitAsset([string]$uri, [string]$destination) {
  $temporary = "$destination.download"
  Invoke-WebRequest -UseBasicParsing -Uri $uri -OutFile $temporary
  $input = [System.IO.File]::OpenRead($temporary)
  $partNumber = 1
  $chunkSize = 20MB
  $buffer = New-Object byte[] $chunkSize
  try {
    while (($read = $input.Read($buffer, 0, $buffer.Length)) -gt 0) {
      $partPath = "$destination.part-$($partNumber.ToString('000'))"
      $output = [System.IO.File]::Create($partPath)
      try {
        $output.Write($buffer, 0, $read)
      }
      finally {
        $output.Dispose()
      }
      $partNumber += 1
    }
  }
  finally {
    $input.Dispose()
    Remove-Item -LiteralPath $temporary -Force
  }
}

if (-not $RetryOnly) {
  Save-SplitAsset "https://raw.githubusercontent.com/LluisV/Z-Anatomy/PC-Version/Resources/Models/FBX/MuscularSystem100.fbx" (Join-Path $anatomyRoot "MuscularSystem100.fbx")
  Save-Asset "https://raw.githubusercontent.com/LluisV/Z-Anatomy/PC-Version/Resources/Models/FBX/Regions%20of%20human%20body100.fbx" (Join-Path $anatomyRoot "RegionsOfHumanBody100.fbx")
  Invoke-WebRequest -UseBasicParsing -Uri "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/api/en/exercises.json" -OutFile (Join-Path $exerciseRoot "index.json")
}

$indexPath = Join-Path $exerciseRoot "index.json"
if (-not (Test-Path -LiteralPath $indexPath)) { throw "Missing local exercise index: $indexPath" }
$files = @((Get-Content -Raw $indexPath | ConvertFrom-Json).exercises.file)
$missing = @($files | Where-Object { -not (Test-Path -LiteralPath (Join-Path $exerciseRoot $_)) })

$result = $missing | ForEach-Object -Parallel {
  $relative = $_
  $destination = Join-Path $using:exerciseRoot $relative
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
  try {
    Invoke-WebRequest -UseBasicParsing -Uri ("https://raw.githubusercontent.com/JahelCuadrado/ExerciseGymGifsDB/v1.1.0/" + $relative) -OutFile $destination -TimeoutSec 90
    [PSCustomObject]@{ state = "downloaded"; file = $relative }
  } catch {
    [PSCustomObject]@{ state = "failed"; file = $relative; error = $_.Exception.Message }
  }
} -ThrottleLimit 4

$failed = @($result | Where-Object state -eq "failed")
[PSCustomObject]@{
  expected = $files.Count
  downloaded = @($result | Where-Object state -eq "downloaded").Count
  alreadyPresent = $files.Count - $missing.Count
  failed = $failed.Count
  failedFiles = @($failed.file)
} | ConvertTo-Json -Depth 3
