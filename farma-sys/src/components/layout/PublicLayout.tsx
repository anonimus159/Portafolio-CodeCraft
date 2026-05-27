import { Outlet, Link } from 'react-router-dom';
import { Pill, ShoppingBag, Menu } from 'lucide-react';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Pill className="w-8 h-8 text-primary" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FarmaSys
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 font-medium">
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors">Medicamentos</a>
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors">Categorías</a>
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors">Ofertas</a>
              <Link to="/login" className="text-foreground/80 hover:text-primary transition-colors">Ingresar al Sistema</Link>
            </nav>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-foreground/80 hover:bg-muted rounded-full transition-colors">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold">
                  2
                </span>
              </button>
              <button className="md:hidden p-2 text-foreground/80 hover:bg-muted rounded-full">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Pill className="w-6 h-6 text-muted-foreground" />
            <span className="text-xl font-bold text-muted-foreground">FarmaSys</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2026 FarmaSys Inc. Todos los derechos reservados. Demostración para portafolio.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="text-sm font-medium text-primary hover:underline">
              Portal Administrativo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
