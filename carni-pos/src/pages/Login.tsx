import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Beef, Lock, User, ArrowRight } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@meatcontrol.com');
  const [password, setPassword] = useState('frigorifico123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center z-10 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-border shadow-2xl shadow-primary/20 mb-6 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Beef className="w-10 h-10 text-primary relative z-10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">CarniPOS</h1>
            <p className="text-muted-foreground">Industrial Meat Control System</p>
          </div>

          <div className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground pl-1">Usuario / Email</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-sm font-medium text-muted-foreground">Contraseña</label>
                  <a href="#" className="text-xs text-primary hover:underline">¿Olvidaste tu clave?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 px-4 rounded-xl font-medium text-sm transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-70 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Acceder al Sistema
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-8 text-center text-xs text-muted-foreground/60 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Conectado a Base de Datos Local
          </div>
        </motion.div>
      </div>

      {/* Right side graphic for larger screens */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center border-l border-border/50 bg-black/40 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-lg p-12 glass rounded-3xl border border-border/50 shadow-2xl">
          <h2 className="text-3xl font-bold mb-4 text-white">Sistematiza tu Frigorífico</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Control exacto de inventario por peso, cálculo de merma en tiempo real y lectura automática desde balanzas USB. Diseñado para carnicerías comerciales de alto volumen.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-background/50 border border-border">
              <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
              <div className="text-xs text-muted-foreground">Precisión en peso</div>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border">
              <div className="text-2xl font-bold text-primary mb-1">-15%</div>
              <div className="text-xs text-muted-foreground">Reducción de Merma</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
