import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Just Save - Expense Analyzer",
  description: "Analyze your expenses and subscriptions from CSV and PDF files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}

