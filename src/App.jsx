import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import Lanyard from './components/Lanyard';
import { 
  ExternalLink, 
  Code2, 
  Cpu, 
  Globe, 
  Layers, 
  MessageSquare, 
  Smartphone, 
  Zap,
  Menu,
  X,
  ChevronRight,
  Shield,
  Activity,
  Terminal
} from 'lucide-react';
import { FaGithub, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

// --- Futuristic Components ---

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const particleCount = 100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.init();
      }
      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = `rgba(147, 51, 234, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1]" />;
};

const MouseGlow = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      animate={{ x: mousePos.x - 200, y: mousePos.y - 200 }}
      transition={{ type: "spring", damping: 30, stiffness: 100, mass: 0.5 }}
      className="fixed inset-0 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-[2]"
    />
  );
};

const CyberText = ({ text, delay = 0 }) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return characters[Math.floor(Math.random() * characters.length)];
        }).join("")
      );
      
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1/3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>{displayText}</motion.span>;
};

const GlowButton = ({ children, className = "", primary = false }) => (
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(147, 51, 234, 0.5)" }}
    whileTap={{ scale: 0.95 }}
    className={`relative px-8 py-4 rounded-xl font-bold overflow-hidden group ${className} ${
      primary ? 'bg-white text-black' : 'glass border-white/10 text-white'
    }`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
    <span className="relative z-10 flex items-center justify-center gap-2 w-full">{children}</span>
  </motion.button>
);

const SectionTitle = ({ title, subtitle }) => (
  <div className="relative mb-20">
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: "100px" }}
      className="h-1 bg-purple-500 mb-6"
    />
    <motion.p
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="text-purple-500 font-black tracking-[0.3em] uppercase text-xs mb-2"
    >
      {subtitle}
    </motion.p>
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-5xl md:text-7xl font-black tracking-tighter"
    >
      {title}
    </motion.h3>
  </div>
);

// --- Data ---

const projects = [
  {
    title: 'POS Panadería',
    description: 'Punto de venta especializado para panaderías con gestión de recetas, inventario y facturación.',
    tech: ['React', 'Node.js', 'Prisma', 'Tailwind'],
    color: 'from-purple-500/40 to-blue-500/40',
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    image: '/assets/pos_panaderia.png',
    demoUrl: '/demos/pos-panaderia/'
  },
  {
    title: 'POS Fast Food',
    description: 'Sistema de caja registradora ultrarrápido para restaurantes de comida rápida con diseño glassmorphism.',
    tech: ['Vite', 'React', 'Tailwind', 'CSS'],
    color: 'from-orange-500/40 to-yellow-500/40',
    icon: <Zap className="w-6 h-6 text-orange-400" />,
    image: '/assets/pos_fastfood.png',
    demoUrl: '/demos/pos-comidas-rapidas/'
  },
  {
    title: 'Dashboard de Ventas',
    description: 'Panel de administración avanzado con estadísticas y gráficos analíticos para la toma de decisiones.',
    tech: ['Next.js', 'Framer Motion', 'Recharts'],
    color: 'from-blue-500/40 to-cyan-500/40',
    icon: <Activity className="w-6 h-6 text-blue-400" />,
    image: '/assets/sistema_ventas.png',
    demoUrl: '/demos/sistema-de-ventas/'
  },
  {
    title: 'Admin Panadería',
    description: 'Plataforma empresarial de control y administración para cadenas de panaderías. Modo oscuro nativo.',
    tech: ['React', 'PostgreSQL', 'Express'],
    color: 'from-pink-500/40 to-purple-500/40',
    icon: <Layers className="w-6 h-6 text-pink-400" />,
    image: '/assets/sistema_panaderia.png',
    demoUrl: '/demos/sistema-panaderia/'
  },
];

const skills = [
  { name: 'React', icon: <Cpu />, level: 95 },
  { name: 'Next.js', icon: <Layers />, level: 90 },
  { name: 'Tailwind', icon: <Zap />, level: 100 },
  { name: 'TypeScript', icon: <Code2 />, level: 85 },
  { name: 'Node.js', icon: <Smartphone />, level: 80 },
  { name: 'Firebase', icon: <Shield />, level: 85 },
  { name: 'Git', icon: <FaGithub />, level: 95 },
  { name: 'UI/UX', icon: <Activity />, level: 90 },
];

export default function Portfolio() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050816] text-white selection:bg-purple-500/30 overflow-x-hidden">
      {/* --- Global UI Elements --- */}
      <ParticleBackground />
      <MouseGlow />
      <motion.div 
        style={{ scaleX }} 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 z-[200] origin-left" 
      />
      
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-20" />
      <div className="fixed inset-0 cyber-grid-small pointer-events-none opacity-10" />
      <div className="scanner-line opacity-10" />

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" 
        />
      </div>

      {/* --- Header --- */}
      <header 
        className={`fixed top-0 left-0 w-full z-[150] transition-all duration-700 ${
          isScrolled ? 'py-4 glass border-b border-white/5' : 'py-8 bg-transparent'
        } ${mobileMenuOpen ? 'glass border-b border-white/5 bg-[#050816]/90 backdrop-blur-xl' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{background:'#0d1b2a'}}>
                <img
                  src="/logo.png"
                  alt="CodeCraft Logo"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '50% 20%', transform: 'scale(2.2)', transformOrigin: 'center 25%' }}
                />
              </div>
              <span className="text-xl font-black tracking-tighter">
                CODE<span className="text-cyan-400">CRAFT</span>
              </span>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-12 text-xs font-black uppercase tracking-[0.2em]">
            {['Sobre mí', 'Skills', 'Proyectos', 'Contacto'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="hover:text-purple-500 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#9333ea]" />
              </motion.a>
            ))}
          </nav>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 glass rounded-lg">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-white/5 overflow-hidden absolute top-full left-0 w-full bg-[#050816]/95 backdrop-blur-3xl"
            >
              <div className="flex flex-col items-center py-8 gap-8">
                {['Sobre mí', 'Skills', 'Proyectos', 'Contacto'].map((item, i) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-sm font-black uppercase tracking-[0.2em] hover:text-purple-500 transition-colors"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-6xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 rounded-xl glass border-purple-500/20 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 mb-12 shadow-[0_0_20px_rgba(147,51,234,0.1)]"
          >
            <Activity className="w-3 h-3 animate-pulse" />
            System Status: Optimal
          </motion.div>

          <h2 className="text-5xl sm:text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-12 uppercase mt-8 md:mt-0">
            <motion.span 
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, type: "spring" }}
              className="block"
            >
              Crafting
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, type: "spring" }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
            >
              Solutions
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-light uppercase tracking-widest"
          >
            Crafting <span className="text-white font-bold">Code</span>. Building <span className="text-cyan-400 font-bold">Solutions</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 w-full sm:w-auto"
          >
            <GlowButton primary className="w-full sm:w-auto">
              Explorar Proyectos <ChevronRight className="w-4 h-4" />
            </GlowButton>
            <GlowButton className="w-full sm:w-auto">
              <MessageSquare className="w-4 h-4" /> Iniciar Sesión
            </GlowButton>
          </motion.div>
        </div>

        {/* Floating geometric elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
              className="absolute border border-white/5 rounded-full"
              style={{
                width: `${100 + i * 150}px`,
                height: `${100 + i * 150}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="sobre-mí" className="py-24 md:py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <SectionTitle title="Misión Digital" subtitle="Sobre el Autor" />
          
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center w-full min-w-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="glass-card p-6 md:p-12 rounded-[2rem] border-white/10 relative overflow-hidden group w-full min-w-0">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Code2 className="w-32 h-32" />
                </div>
                <p className="text-2xl md:text-3xl font-bold leading-snug mb-10 break-words">
                  Me especializo en crear <span className="text-purple-500">interfaces hiper-modernas</span> que no solo lucen bien, sino que están optimizadas para el rendimiento máximo.
                </p>
                <div className="space-y-6">
                  {[
                    { label: 'Visión', text: 'Transformar datos complejos en visualizaciones intuitivas.' },
                    { label: 'Ejecución', text: 'Código limpio, escalable y preparado para el futuro.' },
                    { label: 'Impacto', text: 'Diseños que cautivan desde el primer milisegundo.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_#9333ea]" />
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 break-words">{item.label}</h4>
                        <p className="text-gray-300 font-medium break-words">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center mt-12 md:mt-0">
              <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
              
              {/* Stats overlay or secondary grid if needed */}
              <div className="absolute inset-0 pointer-events-none flex items-end justify-center">
                <div className="grid grid-cols-2 gap-4 p-8 w-full">
                  {[
                    { label: 'Proyectos', value: '20+', icon: <Layers className="text-purple-500" /> },
                    { label: 'Uptime', value: '100%', icon: <Zap className="text-blue-500" /> },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-4 rounded-2xl text-center border-white/5 backdrop-blur-md pointer-events-auto"
                    >
                      <h4 className="text-xl font-black">{stat.value}</h4>
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Skills Section --- */}
      <section id="skills" className="py-24 md:py-40 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <SectionTitle title="Core Engine" subtitle="Tecnologías" />
            <p className="text-gray-500 max-w-sm mb-12 text-sm uppercase tracking-widest font-bold">
              Stack de desarrollo optimizado para la Web 3.0 y más allá.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-8 rounded-3xl border-white/5 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5 group-hover:bg-purple-500 transition-colors" />
                <div className="flex items-center gap-6 mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-all duration-500 scale-125">
                    {skill.icon}
                  </div>
                  <h4 className="text-xl font-bold">{skill.name}</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Power Level</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section id="proyectos" className="py-24 md:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle title="Nexus Proyectual" subtitle="Portafolio" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative"
              >
                <div className="glass-card rounded-[3rem] overflow-hidden h-full flex flex-col border-white/5 hover:border-purple-500/20">
                  {/* Image Container with 3D effect */}
                  <div className="h-80 relative overflow-hidden">
                    <motion.img 
                      whileHover={{ scale: 1.15, rotate: 2 }}
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-1000"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent`} />
                    <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Floating Info */}
                    <div className="absolute top-8 left-8 flex gap-3">
                      <div className="glass p-3 rounded-2xl glow-purple backdrop-blur-3xl">
                        {project.icon}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-12 flex-grow w-full min-w-0">
                    <h4 className="text-2xl md:text-3xl font-black mb-6 group-hover:text-purple-400 transition-colors break-words">
                      {project.title}
                    </h4>
                    <p className="text-gray-400 font-medium leading-relaxed mb-10">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-10">
                      {project.tech.map((t) => (
                        <span key={t} className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 group-hover:border-purple-500/20 transition-colors">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <a 
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 h-14 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                      >
                        Lanzar Demo <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section id="contacto" className="py-24 md:py-40 px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-6xl mx-auto glass rounded-[2rem] md:rounded-[4rem] p-8 sm:p-16 md:p-32 relative overflow-hidden border-white/10 text-center"
        >
          <div className="absolute inset-0 cyber-grid opacity-10" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="w-24 h-24 rounded-3xl bg-purple-600/20 flex items-center justify-center mx-auto mb-12 glow-purple"
            >
              <MessageSquare className="w-10 h-10 text-purple-400" />
            </motion.div>
            
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-black mb-10 tracking-tighter uppercase break-words">
              ¿Iniciamos la <br className="hidden sm:block" /> <span className="text-gradient">Conexión?</span>
            </h3>
            
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-20 font-medium">
              Actualmente aceptando nuevas transmisiones para proyectos de alto impacto. 
              El futuro no se espera, se construye.
            </p>

            <div className="flex flex-wrap justify-center gap-10">
              {[
                { icon: <FaInstagram />, label: 'Instagram', color: 'hover:text-pink-500' },
                { icon: <FaTwitter />, label: 'Twitter', color: 'hover:text-blue-400' },
                { icon: <FaLinkedin />, label: 'LinkedIn', color: 'hover:text-blue-600' },
                { icon: <FaGithub />, label: 'GitHub', color: 'hover:text-white' }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, y: -5 }}
                  className={`text-4xl text-gray-500 transition-colors ${social.color}`}
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="mt-16 md:mt-20 px-8 sm:px-16 py-4 sm:py-6 w-full sm:w-auto rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 font-black uppercase tracking-[0.3em] text-xs shadow-[0_0_50px_rgba(147,51,234,0.3)] active:scale-95"
            >
              Enviar Mensaje
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-20 px-6 border-t border-white/5 relative bg-black/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img
                src="/logo.png"
                alt="CodeCraft Logo"
                className="h-24 w-auto object-contain"
                style={{filter: 'drop-shadow(0 0 12px rgba(0,188,212,0.4))'}}
              />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em]">
              Crafting Code. Building Solutions.
            </p>
          </div>
          
          <div className="flex gap-12">
            {['Privacy', 'Terms', 'Logs', 'System'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <p className="text-gray-700 text-[10px] font-black uppercase tracking-widest">
            Handcrafted with <span className="text-purple-500">Terminal</span> in the Matrix.
          </p>
        </div>
      </footer>
    </div>
  );
}
