import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, QrCode } from 'lucide-react';
import clsx from 'clsx';

const availableProducts = [
  { id: '1', name: 'Paracetamol 500mg', price: 1.50, stock: 1200 },
  { id: '2', name: 'Amoxicilina 500mg', price: 5.20, stock: 150 },
  { id: '3', name: 'Ibuprofeno 400mg', price: 2.10, stock: 850 },
  { id: '4', name: 'Vitamina C + Zinc', price: 8.50, stock: 45 },
  { id: '5', name: 'Loratadina 10mg', price: 3.40, stock: 5 },
  { id: '6', name: 'Omeprazol 20mg', price: 4.80, stock: 540 },
];

export const POS = () => {
  const [cart, setCart] = useState<{product: any, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const filteredProducts = availableProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.19; // 19% IVA (example)
  const total = subtotal + tax;

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Left side - Product Search & Grid */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Punto de Venta</h1>
          <p className="text-muted-foreground text-sm mt-1">Venta rápida y facturación.</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar medicamento o escanear código de barras..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 hover:shadow-md transition-all active:scale-95 flex flex-col justify-between h-32"
              >
                <div>
                  <h3 className="font-bold text-sm text-foreground line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Stock: {product.stock}</p>
                </div>
                <div className="font-bold text-primary text-lg">
                  ${product.price.toFixed(2)}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Cart / Checkout */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col bg-card border border-border rounded-2xl shadow-sm overflow-hidden h-full">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">Carrito de Compras</h2>
          <span className="ml-auto bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={item.product.id} 
                className="flex items-center justify-between border border-border/50 rounded-xl p-3 bg-background"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="font-bold text-sm truncate">{item.product.name}</h4>
                  <p className="text-primary font-medium text-sm">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="w-7 h-7 flex items-center justify-center rounded bg-background shadow-sm text-foreground font-bold hover:bg-border transition-colors">-</button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="w-7 h-7 flex items-center justify-center rounded bg-background shadow-sm text-foreground font-bold hover:bg-border transition-colors">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Checkout Panel */}
        <div className="border-t border-border p-4 bg-muted/10">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>IVA (19%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-foreground pt-2 border-t border-border/50">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Método de Pago</p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setPaymentMethod('cash')}
                className={clsx("flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-xs font-medium gap-1", paymentMethod === 'cash' ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted text-muted-foreground")}
              >
                <Banknote className="w-5 h-5" /> Efectivo
              </button>
              <button 
                onClick={() => setPaymentMethod('card')}
                className={clsx("flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-xs font-medium gap-1", paymentMethod === 'card' ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted text-muted-foreground")}
              >
                <CreditCard className="w-5 h-5" /> Tarjeta
              </button>
              <button 
                onClick={() => setPaymentMethod('qr')}
                className={clsx("flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-xs font-medium gap-1", paymentMethod === 'qr' ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted text-muted-foreground")}
              >
                <QrCode className="w-5 h-5" /> QR/Nequi
              </button>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
          >
            Cobrar ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};
