import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevStream | The Ultimate Developer API",
  description: "Build faster with our cinematic developer tools and API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen selection:bg-neon-purple selection:text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
