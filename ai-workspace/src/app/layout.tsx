import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CommandPalette } from "@/components/CommandPalette";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Workspace Colaborativo IA",
  description: "Estilo Notion / Linear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased flex h-screen overflow-hidden transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {children}
          </div>
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
