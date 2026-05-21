/**
 * Stock Management Utility
 * Handles inventory deduction and restoration based on recipes
 */

// Basic recipe mapping (This should ideally come from a database or config)
export const RECIPES = {
  1: { 'INV-001': 1, 'INV-002': 1, 'INV-003': 1 }, // Hamb. Clásica
  2: { 'INV-001': 1, 'INV-002': 1, 'INV-003': 2 }, // Hamb. Especial
  5: { 'INV-006': 1 }, // Coca Cola
};

export const deductOrderStock = (inventory, order) => {
  let nextInventory = [...inventory];
  
  order.items.forEach(item => {
    if (item.recipe && Array.isArray(item.recipe) && item.recipe.length > 0) {
      item.recipe.forEach(ing => {
        nextInventory = nextInventory.map(invItem => {
          if (invItem.id === ing.ingredientId) {
            const newStock = Math.max(0, invItem.stock - (ing.amount * item.quantity));
            const status = newStock <= 5 ? 'critical' : newStock <= 20 ? 'low' : 'optimal';
            return { ...invItem, stock: newStock, status };
          }
          return invItem;
        });
      });
    } else {
      const recipe = RECIPES[item.id];
      if (recipe) {
        Object.entries(recipe).forEach(([invId, qty]) => {
          nextInventory = nextInventory.map(invItem => {
            if (invItem.id === invId) {
              const newStock = Math.max(0, invItem.stock - (qty * item.quantity));
              const status = newStock <= 5 ? 'critical' : newStock <= 20 ? 'low' : 'optimal';
              return { ...invItem, stock: newStock, status };
            }
            return invItem;
          });
        });
      }
    }
  });
  
  return nextInventory;
};

/**
 * Restores stock to inventory when an item or order is cancelled
 */
export const restoreItemStock = (inventory, item) => {
  let nextInventory = [...inventory];
  
  if (item.recipe && Array.isArray(item.recipe) && item.recipe.length > 0) {
    item.recipe.forEach(ing => {
      nextInventory = nextInventory.map(invItem => {
        if (invItem.id === ing.ingredientId) {
          const newStock = invItem.stock + (ing.amount * item.quantity);
          const status = newStock <= 5 ? 'critical' : newStock <= 20 ? 'low' : 'optimal';
          return { ...invItem, stock: newStock, status };
        }
        return invItem;
      });
    });
  } else {
    const recipe = RECIPES[item.id];
    if (recipe) {
      Object.entries(recipe).forEach(([invId, qty]) => {
        nextInventory = nextInventory.map(invItem => {
          if (invItem.id === invId) {
            const newStock = invItem.stock + (qty * item.quantity);
            const status = newStock <= 5 ? 'critical' : newStock <= 20 ? 'low' : 'optimal';
            return { ...invItem, stock: newStock, status };
          }
          return invItem;
        });
      });
    }
  }
  
  return nextInventory;
};
