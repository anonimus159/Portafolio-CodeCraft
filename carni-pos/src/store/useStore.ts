import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  freshness: string;
  status: 'good' | 'warning' | 'critical';
}

export interface Transaction {
  id: string;
  time: string;
  type: 'sale' | 'expense' | 'production' | 'opening';
  method: 'cash' | 'card' | 'transfer' | 'none';
  amount: number;
  desc: string;
}

interface CashRegister {
  isOpen: boolean;
  baseAmount: number;
}

interface StoreState {
  inventory: Product[];
  transactions: Transaction[];
  cashRegister: CashRegister;
  
  // Actions
  openRegister: (amount: number) => void;
  closeRegister: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'time'>) => void;
  updateStock: (productId: string, quantityChange: number) => void;
  processSale: (cart: { id: string, quantity: number, price: number }[], method: Transaction['method'], total: number) => void;
  processProduction: (recipeName: string, inputName: string, inputWeight: number, outputUnit: string, outputQuantity: number) => void;
}

const initialInventory: Product[] = [
  { id: '1', name: 'Lomo de Res (Premium)', category: 'Cortes Res', stock: 45.5, price: 35000, freshness: '2 días', status: 'good' },
  { id: '2', name: 'Panceta de Cerdo', category: 'Cortes Cerdo', stock: 28.0, price: 22000, freshness: '1 día', status: 'good' },
  { id: '3', name: 'Pollo Entero Campesino', category: 'Aves', stock: 15.0, price: 12500, freshness: '4 días', status: 'warning' },
  { id: '4', name: 'Carne Molida Especial', category: 'Procesados', stock: 12.5, price: 18000, freshness: '1 día', status: 'good' },
  { id: '5', name: 'Chorizo Santarrosano', category: 'Embutidos', stock: 8.0, price: 25000, freshness: '5 días', status: 'critical' },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      inventory: initialInventory,
      transactions: [],
      cashRegister: {
        isOpen: false,
        baseAmount: 0,
      },

      openRegister: (amount) => set((state) => {
        const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
        return {
          cashRegister: { isOpen: true, baseAmount: amount },
          transactions: [
            ...state.transactions,
            { id: `TRX-${Date.now()}`, time, type: 'opening', method: 'cash', amount, desc: 'Apertura de Caja' }
          ]
        };
      }),

      closeRegister: () => set({
        cashRegister: { isOpen: false, baseAmount: 0 },
        // Could also clear transactions or move them to history
      }),

      addTransaction: (trx) => set((state) => {
        const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
        return {
          transactions: [...state.transactions, { ...trx, id: `TRX-${Date.now()}`, time }]
        };
      }),

      updateStock: (productId, quantityChange) => set((state) => ({
        inventory: state.inventory.map(p => 
          p.id === productId ? { ...p, stock: p.stock + quantityChange } : p
        )
      })),

      processSale: (cart, method, total) => set((state) => {
        const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
        const newTransaction: Transaction = {
          id: `TRX-${Date.now()}`,
          time,
          type: 'sale',
          method,
          amount: total,
          desc: 'Venta POS'
        };

        const newInventory = state.inventory.map(p => {
          const cartItem = cart.find(item => item.id === p.id);
          if (cartItem) {
            return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
          }
          return p;
        });

        return {
          transactions: [newTransaction, ...state.transactions], // Prepend to show newest first
          inventory: newInventory
        };
      }),

      processProduction: (recipeName, inputName, inputWeight, outputUnit, outputQuantity) => set((state) => {
        const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
        
        // Find input product to decrease
        let newInventory = [...state.inventory];
        const inputProduct = newInventory.find(p => p.name.includes(inputName));
        if (inputProduct) {
          inputProduct.stock = Math.max(0, inputProduct.stock - inputWeight);
        }

        // Add or update output product
        const outputProduct = newInventory.find(p => p.name === recipeName);
        if (outputProduct) {
          outputProduct.stock += outputQuantity;
        } else {
          // Create new product if it doesn't exist
          newInventory.push({
            id: `PRD-${Date.now()}`,
            name: recipeName,
            category: 'Procesados',
            stock: outputQuantity,
            price: 25000, // mock price
            freshness: 'Recién hecho',
            status: 'good'
          });
        }

        const newTransaction: Transaction = {
          id: `PRD-${Date.now()}`,
          time,
          type: 'production',
          method: 'none',
          amount: 0,
          desc: `Producción: ${outputQuantity} ${outputUnit} de ${recipeName}`
        };

        return {
          inventory: newInventory,
          transactions: [newTransaction, ...state.transactions]
        };
      })
    }),
    {
      name: 'carnipos-storage', // key in local storage
    }
  )
);
