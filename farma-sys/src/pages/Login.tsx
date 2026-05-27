import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pill, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

export const Login = () => {
  const [email, setEmail] = useState('admin@farmasys.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Column - Branding / Cinematic */}
      <div className="hidden lg:flex flex-1 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-secondary/80 mix-blend-multiply opacity-90"></div>
        
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-secondary/30 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-primary-foreground/20 blur-[100px]"
        />

        <div className="relative z-10 p-12 text-white max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 rounded-2xl glass">
                <Pill className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">FarmaSys</h1>
            </div>
            
            <h2 className="text-5xl font-extrabold mb-6 leading-tight">
              Control inteligente para tu droguería.
            </h2>
            <p className="text-lg text-white/80 font-medium max-w-md">
              Gestiona inventario, ventas y pacientes en una plataforma moderna y unificada.
            </p>

            <div className="mt-12 flex items-center gap-4 text-sm font-medium bg-black/20 w-max px-4 py-2 rounded-full glass">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Sistema Seguro Encriptado</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">Bienvenido de nuevo</h2>
            <p className="text-muted-foreground mt-2">Ingresa tus credenciales para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-8">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/20" />
                <span className="text-muted-foreground">Recordarme</span>
              </label>
              <a href="#" className="text-primary font-medium hover:underline">¿Olvidaste tu contraseña?</a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={clsx(
                "w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-4 rounded-xl font-medium transition-all",
                isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
              )}
            >
              {isLoading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            ¿No tienes cuenta? <a href="#" className="text-primary font-medium hover:underline">Solicita un demo</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
