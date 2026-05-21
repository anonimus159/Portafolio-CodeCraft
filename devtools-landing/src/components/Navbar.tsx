"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">DevStream</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#docs" className="hover:text-white transition-colors">Documentation</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#blog" className="hover:text-white transition-colors">Blog</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
