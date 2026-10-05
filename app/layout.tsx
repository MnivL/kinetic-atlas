import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kinetic Atlas · 动作与解剖实验室",
  description: "通过交互式 3D 解剖模型理解训练动作、肌肉参与和常见动作代偿。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
