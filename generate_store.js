const fs = require('fs');
const categories = [
  { name: 'Abarrotes', emoji: '🛒' },
  { name: 'Bebidas', emoji: '🥤' },
  { name: 'Desechables', emoji: '🥡' },
  { name: 'Lacteos', emoji: '🧀' },
  { name: 'Limpieza', emoji: '🧹' },
  { name: 'Botanas', emoji: '🍿' },
  { name: 'Higiene', emoji: '🧴' },
  { name: 'Carnicos', emoji: '🥩' },
  { name: 'Panaderia', emoji: '🍞' },
  { name: 'Conservas', emoji: '🥫' },
  { name: 'Condimentos', emoji: '🧂' },
  { name: 'Golosinas', emoji: '🍬' },
  { name: 'Cereales', emoji: '🥣' },
  { name: 'Hogar', emoji: '🏠' },
  { name: 'Mascotas', emoji: '🐾' }
];

const brands = ['Nestle', 'Bimbo', 'Coca-Cola', 'Sabritas', 'Gamesa', 'Herdez', 'La Costena', 'Lala', 'Alpura', 'Ariel', 'Suavitel', 'Colgate', 'Palmolive', 'P&G', 'Unilever'];
const productTypes = ['Premium', 'Regular', 'Familiar', 'Mini', 'Pack x4', 'Pack x6', 'Industrial', 'Especial', 'Organico', 'Light'];

let products = [];
for (let i = 1; i <= 500; i++) {
  const cat = categories[i % categories.length];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const type = productTypes[Math.floor(Math.random() * productTypes.length)];
  const name = `${brand} ${cat.name} ${type} ${i}`;
  
  const retail = Math.floor(Math.random() * 100) + 10;
  const halfWholesale = retail * 0.9;
  const halfMin = Math.floor(Math.random() * 5) + 3;
  const wholesale = retail * 0.8;
  const boxQty = [6, 12, 24, 48][Math.floor(Math.random() * 4)];
  const stock = Math.floor(Math.random() * 500) + 50;
  
  const isOffer = Math.random() > 0.85;
  const isNew = Math.random() > 0.85;
  
  products.push(`  p(${i},'${name}','${cat.name}','${brand.slice(0,4)}',${retail.toFixed(2)},${halfWholesale.toFixed(2)},${halfMin},${wholesale.toFixed(2)},${boxQty},${stock},'pieza',${isOffer},${isNew})`);
}

const content = `import { create } from 'zustand';

const p = (id, name, category, text, retail, halfPrice, halfMin, wholesale, boxQty, stock, unit = 'pieza', isOffer = false, isNew = false) => ({
  id: String(id), name, category,
  imageUrl: \`https://placehold.co/400x400/2563eb/ffffff?text=\${encodeURIComponent(text)}\`,
  retailPrice: retail,
  halfWholesalePrice: halfPrice, halfWholesaleMinQuantity: halfMin,
  wholesalePrice: wholesale, boxQuantity: boxQty,
  stock, unit, isOffer, isNew
});

const initialProducts = [
${products.join(',\n')}
];

export const useProductStore = create((set) => ({
  products: initialProducts,
  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: Date.now().toString() }]
  })),
  updateProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  }))
}));
`;

fs.writeFileSync('src/store/useProductStore.js', content);
console.log('500 products generated successfully!');
