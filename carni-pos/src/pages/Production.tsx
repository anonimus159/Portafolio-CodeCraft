import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChefHat, 
  ArrowRight, 
  Plus, 
  Minus, 
  Save, 
  PackageSearch
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export const Production = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(5);

  const recipes = [
    { id: 'R1', name: 'Hamburguesa Premium', input: 'Carne Molida Especial', ratio: 1.2, outputUnit: 'Unidades (150g)', type: 'Procesado' },
    { id: 'R2', name: 'Chorizo de Cerdo', input: 'Recorte de Cerdo + Grasa', ratio: 0.85, outputUnit: 'KG', type: 'Embutido' },
    { id: 'R3', name: 'Carne Aliñada', input: 'Pulpa de Res', ratio: 1.05, outputUnit: 'KG', type: 'Preparado' },
  ];

  const handleProcess = () => {
    toast.success('Lote de producción registrado', {
      description: `Se han generado ${quantity} unidades/kg de ${recipes.find(r => r.id === selectedRecipe)?.name}. Inventario actualizado.`,
    });
    setSelectedRecipe(null);
    setQuantity(5);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)] min-h-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Producción y Derivados</h1>
          <p className="text-muted-foreground mt-1">Transformación de cortes en hamburguesas, chorizos y más.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left: Recipe Selection */}
        <div className="w-full lg:w-1/3 glass p-6 rounded-3xl border border-border flex flex-col">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" /> Recetas Disponibles
          </h2>
          
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {recipes.map((recipe) => (
              <div 
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe.id)}
                className={clsx(
                  "p-4 rounded-2xl border cursor-pointer transition-all",
                  selectedRecipe === recipe.id 
                    ? "bg-primary/10 border-primary" 
                    : "bg-background/50 border-border hover:border-primary/50"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-foreground">{recipe.name}</h3>
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium uppercase tracking-wider">
                    {recipe.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Materia prima: <span className="text-foreground">{recipe.input}</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Processing Zone */}
        <div className="w-full lg:w-2/3 flex flex-col min-h-0 relative">
          <AnimatePresence mode="wait">
            {!selectedRecipe ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 glass rounded-3xl border border-border flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                  <PackageSearch className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Seleccione una Receta</h3>
                <p className="text-muted-foreground max-w-sm">Elija un producto del panel izquierdo para iniciar el proceso de producción y descontar la materia prima.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 glass rounded-3xl border border-border p-6 flex flex-col"
              >
                {(() => {
                  const r = recipes.find(x => x.id === selectedRecipe)!;
                  return (
                    <>
                      <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
                        <div>
                          <h2 className="text-2xl font-black">{r.name}</h2>
                          <p className="text-muted-foreground text-sm mt-1">Lote automático: L-PRD-{Math.floor(Math.random() * 10000)}</p>
                        </div>
                        <div className="p-3 bg-primary/10 text-primary rounded-xl">
                          <ChefHat className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <div className="flex-1 bg-background border border-border rounded-2xl p-6 w-full text-center">
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Se Descontará</h4>
                          <p className="text-xl font-bold text-red-500">-{(quantity / r.ratio).toFixed(2)} KG</p>
                          <p className="text-sm text-foreground mt-1">{r.input}</p>
                        </div>
                        
                        <div className="text-primary hidden md:block">
                          <ArrowRight className="w-8 h-8" />
                        </div>

                        <div className="flex-1 bg-primary/5 border border-primary/20 rounded-2xl p-6 w-full text-center relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Se Generará</h4>
                          <p className="text-2xl font-black text-foreground">+{quantity} {r.outputUnit}</p>
                          <p className="text-sm text-foreground mt-1">{r.name}</p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <label className="text-sm font-medium text-muted-foreground block mb-4">Cantidad a producir</label>
                        <div className="flex items-center gap-4 max-w-xs">
                          <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <div className="flex-1 text-center font-black text-3xl">
                            {quantity}
                          </div>
                          <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-auto flex justify-end gap-4 pt-6 border-t border-border">
                        <button 
                          onClick={() => setSelectedRecipe(null)}
                          className="px-6 py-3 font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={handleProcess}
                          className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
                        >
                          <Save className="w-5 h-5" /> Procesar Lote
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
