import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Usb, 
  Search, 
  ShoppingCart, 
  Trash2, 
  Printer, 
  CreditCard,
  QrCode,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import clsx from 'clsx';

// Simulated Meat Products
const products = [
  { id: 1, name: 'Lomo Fino de Res', pricePerKg: 32000, category: 'Res', code: 'RES-01' },
  { id: 2, name: 'Costilla de Res', pricePerKg: 18500, category: 'Res', code: 'RES-02' },
  { id: 3, name: 'Pecho de Res', pricePerKg: 15000, category: 'Res', code: 'RES-03' },
  { id: 4, name: 'Pechuga de Pollo', pricePerKg: 16000, category: 'Aves', code: 'AVE-01' },
  { id: 5, name: 'Pernil de Cerdo', pricePerKg: 14500, category: 'Cerdo', code: 'CER-01' },
  { id: 6, name: 'Tocino Barriguero', pricePerKg: 22000, category: 'Cerdo', code: 'CER-02' },
];

export const POS = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [scaleWeight, setScaleWeight] = useState<number>(0);
  const [isScaleConnected] = useState(true);
  const [isReadingScale, setIsReadingScale] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // USB Scale Simulator
  const readScale = () => {
    if (!selectedProduct) return;
    setIsReadingScale(true);
    
    // Simulate serial port reading delay
    setTimeout(() => {
      // Generate random weight between 0.5kg and 3.5kg
      const weight = +(Math.random() * 3 + 0.5).toFixed(3);
      setScaleWeight(weight);
      setIsReadingScale(false);
    }, 800);
  };

  const addToCart = () => {
    if (!selectedProduct || scaleWeight === 0) return;
    
    const itemTotal = selectedProduct.pricePerKg * scaleWeight;
    
    setCart([...cart, {
      id: Date.now(),
      product: selectedProduct,
      weight: scaleWeight,
      total: itemTotal
    }]);
    
    // Reset scale
    setSelectedProduct(null);
    setScaleWeight(0);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const handleCheckout = () => {
    setShowCheckout(true);
    setTimeout(() => {
      setCart([]);
      setShowCheckout(false);
    }, 2500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Panel: Products & Scale */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Hardware Status / Scale Reader */}
        <div className="glass rounded-2xl border border-border p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Lector de Balanza</h2>
            <div className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
              isScaleConnected ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
            )}>
              <Usb className="w-4 h-4" />
              {isScaleConnected ? 'COM3: Balanza Conectada' : 'Balanza Desconectada'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Producto Activo en Balanza</p>
              {selectedProduct ? (
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedProduct.name}</h3>
                    <p className="text-primary font-medium">${selectedProduct.pricePerKg.toLocaleString()} / KG</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedProduct(null); setScaleWeight(0); }}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <div className="h-[52px] flex items-center text-muted-foreground text-sm italic">
                  Seleccione un producto del catálogo...
                </div>
              )}
            </div>

            <div className="bg-black/40 rounded-xl p-4 border border-border/50 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5" />
              <div className="relative z-10">
                <p className="text-sm text-muted-foreground font-medium mb-1">Lectura Peso</p>
                <div className="text-4xl font-mono text-white font-bold tracking-wider">
                  {scaleWeight.toFixed(3)} <span className="text-xl text-muted-foreground">KG</span>
                </div>
              </div>
              <button
                onClick={readScale}
                disabled={!selectedProduct || isReadingScale}
                className="relative z-10 bg-primary hover:bg-primary/90 text-white rounded-lg p-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <RefreshCw className={clsx("w-6 h-6", isReadingScale && "animate-spin")} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={addToCart}
              disabled={!selectedProduct || scaleWeight === 0}
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Agregar a Factura
            </button>
          </div>
        </div>

        {/* Product Catalog */}
        <div className="flex-1 glass rounded-2xl border border-border p-6 flex flex-col overflow-hidden">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar corte o código (Ej: Costilla, RES-02)..." 
              className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4 custom-scrollbar">
            {products.map(product => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={clsx(
                  "p-4 rounded-xl border text-left transition-all hover:border-primary/50 group relative overflow-hidden",
                  selectedProduct?.id === product.id ? "bg-primary/10 border-primary" : "bg-card border-border hover:bg-muted/50"
                )}
              >
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="text-xs font-medium text-muted-foreground">{product.code}</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-foreground">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-1 relative z-10">{product.name}</h3>
                <p className="text-primary font-medium text-sm relative z-10">${product.pricePerKg.toLocaleString()} / kg</p>
                
                {selectedProduct?.id === product.id && (
                  <motion.div layoutId="activeProduct" className="absolute inset-0 border-2 border-primary rounded-xl" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Cart/Ticket */}
      <div className="w-96 glass rounded-2xl border border-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/20">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Ticket de Venta
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50"
              >
                <ShoppingCart className="w-12 h-12 mb-4" />
                <p>El carrito está vacío</p>
              </motion.div>
            ) : (
              cart.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-background rounded-lg p-3 border border-border flex flex-col gap-2 relative group"
                >
                  <div className="flex justify-between items-start pr-6">
                    <span className="font-bold text-sm text-foreground">{item.product.name}</span>
                    <span className="font-bold text-primary">${item.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{item.weight.toFixed(3)} KG x ${item.product.pricePerKg.toLocaleString()}</span>
                    <span>{item.product.code}</span>
                  </div>
                  <button 
                    onClick={() => setCart(cart.filter(i => i.id !== item.id))}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-border bg-card/80 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <span className="text-muted-foreground font-medium">Total a Pagar</span>
            <span className="text-3xl font-bold text-foreground">
              ${cartTotal.toLocaleString()}
            </span>
          </div>

          {showCheckout ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-green-500"
            >
              <CheckCircle2 className="w-8 h-8" />
              <p className="font-bold">Pago Procesado</p>
              <p className="text-xs">Imprimiendo ticket...</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="col-span-2 py-3 bg-primary text-white font-bold rounded-xl transition-all hover:bg-primary/90 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                Cobrar e Imprimir
                <Printer className="w-4 h-4" />
              </button>
              <button disabled={cart.length===0} className="py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-lg border border-border flex justify-center items-center gap-2 disabled:opacity-50">
                <CreditCard className="w-4 h-4" /> Tarjeta
              </button>
              <button disabled={cart.length===0} className="py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-lg border border-border flex justify-center items-center gap-2 disabled:opacity-50">
                <QrCode className="w-4 h-4" /> Nequi / QR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
