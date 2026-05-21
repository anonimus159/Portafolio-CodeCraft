"use client";

import { motion } from "framer-motion";
import { Terminal, Zap, Shield, Code2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
          <span className="text-xs font-medium text-gray-300">DevStream API v2 is now live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
        >
          Build the future with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
            realtime infrastructure
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
        >
          Powerful APIs, instant websockets, and global edge caching. Stop managing infrastructure and start building features your users will love.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2 group">
            Start Building Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-medium">
            Read Documentation
          </button>
        </motion.div>
      </section>

      {/* Floating Code Mockup */}
      <section className="relative px-4 pb-32 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring", bounce: 0.4 }}
          className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative z-10"
          style={{ perspective: "1000px" }}
        >
          {/* Editor Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-xs text-muted-foreground ml-2 font-mono">index.ts</span>
          </div>
          {/* Editor Body */}
          <div className="p-6 overflow-x-auto bg-[#0d0d0d]">
            <pre className="font-mono text-sm md:text-base leading-relaxed text-gray-300">
              <code>
                <span className="text-pink-500">import</span> {"{ "}
                <span className="text-neon-blue">DevStream</span>
                {" }"} <span className="text-pink-500">from</span> <span className="text-emerald-400">'@devstream/sdk'</span>;
                {"\n\n"}
                <span className="text-pink-500">const</span> client = <span className="text-pink-500">new</span> <span className="text-neon-blue">DevStream</span>{"({"}{"\n"}
                {"  apiKey: "}process.env.<span className="text-yellow-200">DEVSTREAM_KEY</span>,{"\n"}
                {"  environment: "}<span className="text-emerald-400">'production'</span>{"\n"}
                {"});\n\n"}
                <span className="text-muted-foreground">// Initialize realtime connection</span>{"\n"}
                <span className="text-neon-purple">await</span> client.<span className="text-blue-300">connect</span>();{"\n\n"}
                <span className="text-muted-foreground">// Stream events directly to your UI</span>{"\n"}
                client.<span className="text-blue-300">subscribe</span>(<span className="text-emerald-400">'user_activity'</span>, (event) <span className="text-neon-purple">{"=>"}</span> {"{\n"}
                {"  "}console.<span className="text-blue-300">log</span>(<span className="text-emerald-400">'New event:'</span>, event.data);{"\n"}
                {"});"}
              </code>
            </pre>
          </div>
        </motion.div>
      </section>

      {/* Logo Ticker */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Trusted by innovative teams worldwide</p>
        </div>
        <div className="flex gap-12 items-center justify-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500 flex-wrap">
          <div className="text-xl font-bold flex items-center gap-2"><Zap className="w-6 h-6"/> Vercel</div>
          <div className="text-xl font-bold flex items-center gap-2"><div className="w-6 h-6 rounded bg-white" /> Square</div>
          <div className="text-xl font-bold flex items-center gap-2"><Terminal className="w-6 h-6"/> Linear</div>
          <div className="text-xl font-bold flex items-center gap-2"><Shield className="w-6 h-6"/> Raycast</div>
          <div className="text-xl font-bold flex items-center gap-2"><Code2 className="w-6 h-6"/> Supabase</div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to scale</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've built the primitive components so you can focus on your product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Zap className="w-10 h-10 text-neon-purple mb-6" />
            <h3 className="text-2xl font-bold mb-2">Lightning Fast Edge Edge</h3>
            <p className="text-muted-foreground max-w-md">
              Deploy your APIs to 35+ regions worldwide. Get sub-50ms latency for all your users, regardless of where they are.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Shield className="w-10 h-10 text-neon-blue mb-6" />
            <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
            <p className="text-muted-foreground">
              SOC2 Type II certified. DDoS protection and end-to-end encryption out of the box.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Code2 className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-xl font-bold mb-2">Typed SDKs</h3>
            <p className="text-muted-foreground">
              Fully typed APIs for TypeScript, Rust, Go, and Python. Catch errors at compile time.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group flex flex-col md:flex-row items-center gap-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Realtime Sync</h3>
              <p className="text-muted-foreground mb-4">
                State management that spans the globe. Update a value in Tokyo and see it in New York instantly.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-neon-purple"/> WebSockets</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-neon-purple"/> Server-Sent Events</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-neon-purple"/> Conflict Resolution</li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 h-40 bg-black/50 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden relative">
              <div className="absolute w-[200%] h-[200%] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] animate-[pulse_4s_ease-in-out_infinite]" />
              <div className="relative z-10 text-neon-purple font-mono text-sm">{"{ status: 'synced' }"}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-muted-foreground text-sm">
        <p>© 2026 DevStream Inc. Crafted for developers.</p>
      </footer>
    </main>
  );
}
