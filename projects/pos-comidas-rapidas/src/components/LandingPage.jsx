import React, { useState } from 'react';
import { ChefHat, TrendingUp, Shield, Zap, ArrowRight, Star, CheckCircle2, Clock, Smartphone, Globe, CreditCard, Laptop, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = ({ onEnter }) => {
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  return (
    <div className="min-h-screen bg-bg-base text-white overflow-x-hidden selection:bg-accent-primary selection:text-white scroll-smooth">
      {/* Premium Dynamic Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/20 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-secondary/20 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-base/80 to-bg-base"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-bg-base/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="flex-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex-center text-white shadow-glow">
              <ChefHat size={20} />
            </div>
            <span className="text-xl font-bold tracking-tighter">FAST<span className="text-accent-primary">POS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#features" className="hover:text-white transition-colors">Características</a>
            <a href="#solutions" className="hover:text-white transition-colors">Soluciones</a>
            <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-text-secondary hover:text-white transition-colors hidden sm:block">Iniciar Sesión</button>
            <button onClick={onEnter} className="btn btn-primary px-6 shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all">
              Abrir POS
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-28 md:pt-40 pb-20 md:pb-32 flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md cursor-pointer hover:bg-white/10 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse"></span>
          <span className="text-xs font-bold tracking-widest uppercase text-text-secondary">El Sistema Operativo de la Gastronomía 2.0</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-8xl lg:text-[100px] font-serif font-black tracking-tight leading-[1.05] mb-6 md:mb-8"
        >
          Le Restaurant <br className="hidden sm:block" />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">OS.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mb-12 font-medium leading-relaxed"
        >
          Sincronización perfecta entre recepción, cocina e inventario. Construido para operaciones gastronómicas de alto volumen que demandan perfección, velocidad y control total.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button onClick={() => setCheckoutPlan({ name: 'Professional', price: '159.900' })} className="btn btn-lg btn-accent px-8 text-lg w-full sm:w-auto shadow-glow flex items-center justify-center gap-2 group h-14 rounded-2xl">
            Iniciar Servicio
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => document.getElementById('pricing').scrollIntoView()} className="btn btn-lg btn-secondary px-8 text-lg w-full sm:w-auto h-14 rounded-2xl flex items-center justify-center">
            Ver Planes
          </button>
        </motion.div>

        {/* UI Mockup Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="w-full mt-16 md:mt-32 relative hidden sm:block"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent z-20 pointer-events-none h-[120%]"></div>
          
          <div className="relative z-0 max-w-5xl mx-auto transform perspective-[2000px]">
            <div className="w-full aspect-[16/10] rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-[0_0_100px_rgba(234,88,12,0.2)] overflow-hidden flex flex-col relative transform rotate-x-[8deg] scale-100 hover:rotate-x-0 transition-transform duration-1000 ease-out group">
              
              {/* Mockup Top Bar */}
              <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-black">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-danger/80"></div>
                  <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                  <div className="w-3 h-3 rounded-full bg-success/80"></div>
                </div>
                <div className="mx-auto bg-white/5 rounded-md px-4 md:px-32 py-1 text-[10px] text-white/30 font-mono overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px] md:max-w-none">fastpos.app/dashboard</div>
              </div>

              {/* Mockup Content */}
              <div className="flex-1 flex bg-[#111]">
                {/* Mock Sidebar */}
                <div className="w-12 md:w-16 border-r border-white/5 flex flex-col items-center py-4 gap-4 bg-black/50 hidden md:flex">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/20 mb-4"></div>
                  {[...Array(5)].map((_, i) => <div key={i} className="w-6 h-6 rounded bg-white/5"></div>)}
                </div>
                {/* Mock Main */}
                <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 md:gap-6">
                  {/* Top Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 md:h-24 rounded-xl bg-white/5 border border-white/5 p-3 md:p-4 flex flex-col gap-2 relative overflow-hidden">
                        <div className="w-6 md:w-8 h-6 md:h-8 rounded bg-white/10 mb-auto"></div>
                        <div className="w-1/2 h-3 md:h-4 bg-white/20 rounded"></div>
                        <div className="w-3/4 h-2 md:h-3 bg-white/10 rounded"></div>
                        <div className="absolute right-0 bottom-0 w-12 md:w-16 h-12 md:h-16 bg-accent-primary/5 rounded-tl-full"></div>
                      </div>
                    ))}
                  </div>
                  {/* Main Graphs */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="col-span-1 lg:col-span-2 rounded-xl bg-white/5 border border-white/5 p-4 hidden sm:block">
                       <div className="w-1/4 h-5 bg-white/20 rounded mb-6"></div>
                       {/* Mock Graph Lines */}
                       <div className="w-full h-full border-b border-l border-white/10 relative">
                         <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                           <path d="M0,100 Q50,50 100,80 T200,40 T300,90 T400,20 T500,60" fill="none" stroke="rgba(234,88,12,0.5)" strokeWidth="4" className="vector-path" />
                         </svg>
                       </div>
                    </div>
                    <div className="col-span-1 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col gap-3">
                      <div className="w-1/2 h-5 bg-white/20 rounded mb-2"></div>
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-10 md:h-12 w-full bg-white/5 rounded-lg flex items-center px-3 gap-3">
                          <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-white/10"></div>
                          <div className="w-1/2 h-2 md:h-3 bg-white/10 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating KDS Screen Overlay */}
              <div className="hidden lg:block absolute top-1/3 -right-12 w-64 h-48 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 transform rotate-12 group-hover:rotate-6 transition-transform duration-700">
                <div className="flex justify-between items-center mb-3">
                  <div className="w-20 h-4 bg-white/20 rounded"></div>
                  <div className="w-6 h-6 rounded-full bg-danger/20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-12 bg-white/5 rounded border-l-2 border-danger flex items-center px-2"><div className="w-3/4 h-2 bg-white/20 rounded"></div></div>
                  <div className="h-12 bg-white/5 rounded border-l-2 border-warning flex items-center px-2"><div className="w-1/2 h-2 bg-white/20 rounded"></div></div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
        
        {/* Simple Mobile Graphic (Replaces 3D Mockup on very small screens) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full mt-16 sm:hidden relative"
        >
           <div className="w-full aspect-[4/5] rounded-3xl bg-gradient-to-br from-bg-surface to-black border border-white/10 shadow-2xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex-center text-accent-primary"><ChefHat size={20}/></div>
                 <div className="w-8 h-8 rounded-full bg-white/5"></div>
              </div>
              <div className="w-3/4 h-6 bg-white/20 rounded-md mb-8"></div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-3"><div className="w-6 h-6 rounded-full bg-white/10 mb-2"></div><div className="w-full h-2 bg-white/20 rounded"></div></div>
                 <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-3"><div className="w-6 h-6 rounded-full bg-white/10 mb-2"></div><div className="w-full h-2 bg-white/20 rounded"></div></div>
              </div>
              <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-3 p-4">
                 {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 rounded-lg w-full"></div>)}
              </div>
           </div>
        </motion.div>
      </main>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ingeniería de Precisión</h2>
          <p className="text-text-tertiary text-lg max-w-2xl mx-auto">No es solo una caja registradora. Es un sistema neural que conecta cada aspecto de tu operación gastronómica.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap size={24} />, title: "Sincronización a la Velocidad de la Luz", desc: "Arquitectura basada en WebSockets. Desde que el mesero presiona 'Enviar' hasta que la comanda suena en cocina pasan exactamente 12 milisegundos." },
            { icon: <Shield size={24} />, title: "Seguridad Anti-Fraude", desc: "Permisos granulares, PIN de seguridad para reembolsos, y registro inmutable de cada transacción, cancelación y apertura de caja." },
            { icon: <TrendingUp size={24} />, title: "Business Intelligence", desc: "Mapas de calor en vivo, análisis predictivo de inventario y reportes financieros automáticos para escalar tu rentabilidad." },
            { icon: <Globe size={24} />, title: "Modo Offline Intocable", desc: "Si el internet se cae, el restaurante no se detiene. El sistema sigue facturando e imprimiendo y sincroniza la nube cuando la conexión regresa." },
            { icon: <Smartphone size={24} />, title: "Ecosistema Multi-Dispositivo", desc: "Usa iPads para los meseros, monitores industriales para la cocina, y una laptop en gerencia. Todo conectado mediante un simple código PIN." },
            { icon: <CreditCard size={24} />, title: "Hardware Universal", desc: "Integración Plug & Play con impresoras térmicas EPSON/Zebra, cajones monederos y datáfonos de cualquier banco sin configuraciones complejas." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-bg-surface border border-white/5 hover:border-accent-primary/30 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(234,88,12,0.1)] group">
              <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex-center text-accent-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions / Audience Section */}
      <section id="solutions" className="relative z-10 bg-black/50 border-y border-white/5 py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Diseñado para Operaciones Serias.</h2>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                FastPOS Enterprise no es una app básica de tablet. Es la infraestructura detrás de los conceptos gastronómicos más ambiciosos.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-success/20 text-success flex-center shrink-0 mt-1"><CheckCircle2 size={16} /></div>
                  <div>
                    <h4 className="font-bold text-lg">Fine Dining & Restaurantes</h4>
                    <p className="text-sm text-text-tertiary mt-1">Gestión avanzada de planos de mesas, tiempos de cocción (Marcha/Sale) y división de cuentas compleja.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-success/20 text-success flex-center shrink-0 mt-1"><CheckCircle2 size={16} /></div>
                  <div>
                    <h4 className="font-bold text-lg">Cadenas de Comida Rápida</h4>
                    <p className="text-sm text-text-tertiary mt-1">Flujo de caja ultrarrápido (Quick Service), pantallas KDS masivas y control de inventario de alto volumen.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-success/20 text-success flex-center shrink-0 mt-1"><CheckCircle2 size={16} /></div>
                  <div>
                    <h4 className="font-bold text-lg">Ghost Kitchens & Delivery</h4>
                    <p className="text-sm text-text-tertiary mt-1">Unificación de múltiples marcas en una sola pantalla. Consolidación de inventario y logística impecable.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden relative border border-white/10 group">
              <div className="absolute inset-0 bg-accent-primary/20 mix-blend-overlay group-hover:bg-transparent transition-colors z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1974" 
                alt="Chef using POS" 
                className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 grayscale group-hover:grayscale-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-8 py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Inversión Inteligente</h2>
          <p className="text-text-tertiary text-lg max-w-2xl mx-auto">Precios transparentes que escalan con el éxito de tu restaurante. Sin comisiones ocultas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Starter Plan */}
          <div className="p-8 rounded-3xl bg-bg-surface border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors">
            <h3 className="text-xl font-bold text-text-secondary mb-2">Básico</h3>
            <div className="mb-6"><span className="text-4xl font-black">$100.000</span><span className="text-text-tertiary"> COP/mes</span></div>
            <p className="text-sm text-text-tertiary mb-8 min-h-[40px]">Perfecto para food trucks y pequeños cafés empezando su operación.</p>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Hasta 3 Terminales o Celulares', 
                'Gestión de Mesas en Vivo', 
                'Impresión de Recibos y Comandas', 
                'Reportes Financieros Diarios', 
                'Menú Digital QR Incluido',
                'Soporte Vía Chat en Vivo'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-text-tertiary flex-shrink-0 mt-0.5" /> 
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => setCheckoutPlan({ name: 'Básico', price: '100.000' })} className="w-full btn btn-secondary h-12 rounded-xl mt-auto hover:bg-white/10 transition-colors">Comenzar Gratis</button>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-accent-primary/10 to-bg-surface border-2 border-accent-primary shadow-[0_0_40px_rgba(234,88,12,0.15)] flex flex-col h-full relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-glow">Más Popular</div>
            <h3 className="text-xl font-bold text-accent-primary mb-2">Professional</h3>
            <div className="mb-6"><span className="text-5xl font-black text-white">$159.900</span><span className="text-text-tertiary"> COP/mes</span></div>
            <p className="text-sm text-text-tertiary mb-8 min-h-[40px]">El estándar de la industria para restaurantes consolidados y de alto flujo.</p>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Dispositivos y Usuarios Ilimitados', 
                'Pantalla de Cocina Inteligente (KDS)', 
                'Inventario Avanzado (Recetas y Mermas)', 
                'Roles y Permisos de Seguridad', 
                'Facturación Electrónica Local',
                'Integración Delivery (Rappi, UberEats)',
                'Soporte Prioritario 24/7'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-accent-primary flex-shrink-0 mt-0.5" /> 
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => setCheckoutPlan({ name: 'Professional', price: '159.900' })} className="w-full btn btn-accent h-12 rounded-xl shadow-glow text-lg mt-auto hover:scale-[1.02] transition-transform">Inicia tu Prueba</button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-3xl bg-bg-surface border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors">
            <h3 className="text-xl font-bold text-text-secondary mb-2">Enterprise</h3>
            <div className="mb-6"><span className="text-4xl font-black">A Medida</span></div>
            <p className="text-sm text-text-tertiary mb-8 min-h-[40px]">Para franquicias y grupos gastronómicos con múltiples locaciones.</p>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Gestión Multi-sucursal Centralizada', 
                'API Abierta para Integraciones Custom', 
                'Marca Blanca (App con tu Logo)', 
                'Base de Datos / Servidor Dedicado', 
                'Migración de Datos Incluida',
                'Gerente de Cuenta Asignado'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-text-tertiary flex-shrink-0 mt-0.5" /> 
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => setCheckoutPlan({ name: 'Enterprise', price: 'Custom' })} className="w-full btn btn-secondary h-12 rounded-xl mt-auto hover:bg-white/10 transition-colors">Contactar Ventas</button>
          </div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="border-t border-white/5 py-12 mt-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-text-tertiary">
          <div className="flex items-center gap-3">
            <ChefHat size={20} className="text-white/20" />
            <span className="font-bold text-white/50 tracking-widest">FASTPOS ENTERPRISE</span>
          </div>
          <p>© 2026 FastPOS Inc. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
             <span className="uppercase tracking-widest text-[10px]">Concebido para Alta Gastronomía</span>
             <Star size={12} className="text-accent-secondary" />
          </div>
        </div>
      </footer>

      {/* Checkout Authorization Modal */}
      <AnimatePresence>
        {checkoutPlan && (
          <div className="fixed inset-0 z-[100] flex-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutPlan(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-bg-surface border border-border-light rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex-between bg-black/20">
                <div>
                  <h3 className="text-xl font-bold">Autorización Demo</h3>
                  <p className="text-sm text-text-tertiary">Plan {checkoutPlan.name} • 14 días de prueba</p>
                </div>
                <button onClick={() => setCheckoutPlan(null)} className="w-8 h-8 rounded-full bg-white/5 flex-center hover:bg-white/10 text-text-secondary"><X size={16}/></button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-accent-primary/10 border border-accent-primary/20 rounded-xl p-4 text-sm text-accent-primary flex gap-3">
                  <Shield className="flex-shrink-0 mt-0.5" size={18} />
                  <p>Se realizará una <strong>autorización de $0</strong> para validar la tarjeta. No se hará ningún cobro hasta el día 15. Cancela en cualquier momento.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Nombre del Restaurante</label>
                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg h-12 px-4 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all" placeholder="Ej. Burger Station" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Información de Pago (Seguro)</label>
                    <div className="w-full bg-black/50 border border-white/10 rounded-lg overflow-hidden focus-within:border-accent-primary focus-within:ring-1 focus-within:ring-accent-primary transition-all">
                      <div className="flex items-center h-12 px-4 border-b border-white/5">
                        <CreditCard size={18} className="text-text-tertiary mr-3" />
                        <input type="text" className="w-full bg-transparent outline-none placeholder:text-white/20 text-sm mono-font" placeholder="Número de Tarjeta" />
                      </div>
                      <div className="flex">
                        <input type="text" className="w-1/2 h-12 px-4 bg-transparent outline-none border-r border-white/5 placeholder:text-white/20 text-sm mono-font" placeholder="MM/AA" />
                        <input type="text" className="w-1/2 h-12 px-4 bg-transparent outline-none placeholder:text-white/20 text-sm mono-font" placeholder="CVC" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button onClick={onEnter} className="w-full btn btn-accent h-14 rounded-xl shadow-glow text-lg flex-center gap-2 group">
                    <Lock size={18} className="opacity-80 group-hover:scale-110 transition-transform" />
                    Autorizar y Comenzar
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-tertiary">
                    <Lock size={10} />
                    <span>Transacción encriptada con 256-bit SSL</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
