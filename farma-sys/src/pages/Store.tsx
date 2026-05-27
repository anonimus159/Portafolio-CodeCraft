import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Star, Heart, ArrowRight } from 'lucide-react';

const storeProducts = [
  { id: '1', name: 'Kit Primeros Auxilios', category: 'Botiquín', price: 25.00, rating: 4.8, reviews: 124, tag: 'Más Vendido' },
  { id: '2', name: 'Vitamina C + Zinc Pro', category: 'Suplementos', price: 12.50, rating: 4.9, reviews: 89, tag: 'Nuevo' },
  { id: '3', name: 'Ibuprofeno 400mg x20', category: 'Analgésicos', price: 4.20, rating: 4.7, reviews: 342 },
  { id: '4', name: 'Termómetro Digital Infrarrojo', category: 'Equipos', price: 45.00, rating: 4.6, reviews: 56 },
  { id: '5', name: 'Protector Solar SPF 50+', category: 'Dermatología', price: 18.90, rating: 4.9, reviews: 210, tag: 'Oferta' },
  { id: '6', name: 'Suero Hidratación Oral', category: 'Hidratación', price: 2.50, rating: 4.5, reviews: 78 },
  { id: '7', name: 'Loratadina 10mg x10', category: 'Antialérgicos', price: 3.80, rating: 4.8, reviews: 156 },
  { id: '8', name: 'Mascarillas N95 Caja x50', category: 'Protección', price: 15.00, rating: 4.7, reviews: 432 },
];

export const Store = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = storeProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        {/* Animated background elements */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-secondary/10 blur-[100px]"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20 glass">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Envíos en menos de 30 minutos
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight mb-8 leading-tight">
              Tu salud, a un <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                clic de distancia.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Compra o aparta tus medicamentos de forma segura, rápida y con los mejores precios del mercado.
            </p>

            {/* Smart Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-card border border-border rounded-2xl shadow-xl glass overflow-hidden">
                <div className="pl-6 text-muted-foreground">
                  <Search className="w-6 h-6" />
                </div>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Busca el nombre de un medicamento..." 
                  className="w-full py-5 px-4 bg-transparent text-lg focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
                <button className="bg-primary text-primary-foreground px-8 py-5 font-bold hover:bg-primary/90 transition-colors hidden sm:block">
                  Buscar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Catálogo Destacado</h2>
              <p className="text-muted-foreground mt-2">Los productos más buscados por nuestros clientes.</p>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline">
              Ver todo el catálogo <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((product, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={product.id}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group relative"
              >
                {product.tag && (
                  <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {product.tag}
                  </div>
                )}
                <button className="absolute top-4 right-4 z-10 p-2 bg-background/50 backdrop-blur-md rounded-full text-muted-foreground hover:text-red-500 hover:bg-white transition-colors">
                  <Heart className="w-5 h-5" />
                </button>

                <div className="h-48 bg-muted/50 flex items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-0"></div>
                  {/* Placeholder for product image - using a stylized box with icon for now */}
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-border flex items-center justify-center z-10"
                  >
                    <span className="text-3xl font-black text-muted-foreground/30">{product.name.charAt(0)}</span>
                  </motion.div>
                </div>

                <div className="p-6">
                  <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{product.category}</div>
                  <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <span className="text-2xl font-black text-foreground">${product.price.toFixed(2)}</span>
                    <button className="bg-foreground text-background p-3 rounded-2xl hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-md">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-muted-foreground">No encontramos ese producto</h3>
              <p className="text-muted-foreground mt-2">Intenta buscar con otro nombre.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
