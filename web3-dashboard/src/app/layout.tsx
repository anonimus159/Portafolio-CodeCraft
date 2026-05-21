import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/ui/Sidebar";
import { TopNav } from "@/components/ui/TopNav";

export const metadata: Metadata = {
  title: "NexusDash | Analítica Financiera Web3",
  description: "Dashboard Financiero Web3 Premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background/50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
