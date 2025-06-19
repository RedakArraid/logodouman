'use client';

import { useState, useEffect } from 'react';
import { useStore } from './contexts/StoreContext';

// Types
interface CartItem {
  id: number;
  name: string;
  price: number;
  category: string;
  icon: string;
  description: string;
  quantity: number;
}

export default function LogoDouman() {
  const { getActiveProducts, getActiveCategories } = useStore();
  const products = getActiveProducts();
  const categoryList = getActiveCategories();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Filtrer les produits
  const getFilteredProducts = () => {
    let filtered = products;
    
    if (currentFilter !== 'all') {
      filtered = filtered.filter(product => product.category === currentFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Ajouter au panier
  const addToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Supprimer du panier
  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Calculer le total
  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Calculer le nombre d'articles
  const getCartItemsCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Finaliser la commande
  const checkout = () => {
    if (cart.length === 0) {
      alert('Votre panier est vide !');
      return;
    }
    
    const total = getCartTotal();
    alert(`Commande confirmée !\nTotal: ${total.toLocaleString()} FCFA\n\nMerci pour votre achat !`);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-orange-400/95 backdrop-blur-md border-b border-orange-600/50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 text-black text-xl font-bold">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg flex items-center justify-center text-xl">
                🛒
              </div>
              <span className="text-2xl">
                <span className="text-orange-700">Logo</span>
                <span className="text-black">Douman</span>
              </span>
            </div>

            {/* Search Bar */}
            <div className="flex bg-white rounded-full overflow-hidden flex-grow max-w-md shadow-lg border-2 border-orange-600/30">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 flex-grow outline-none bg-white text-black placeholder-gray-500"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 transition-all duration-300">
                🔍
              </button>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6 text-black">
              <a href="#home" className="hover:text-orange-700 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300 font-medium">Accueil</a>
              <a href="#categories" className="hover:text-orange-700 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300 font-medium">Catégories</a>
              <a href="#products" className="hover:text-orange-700 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300 font-medium">Produits</a>
              <a href="/admin" className="bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded-full transition-all duration-300 font-medium">⚙️ Admin</a>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white p-3 rounded-full transition-all transform hover:scale-110 shadow-lg"
            >
              🛒
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300/50 via-orange-400/40 to-orange-500/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            <span className="text-orange-700">Logo</span>
            <span className="text-black">Douman</span>
          </h1>
          <p className="text-2xl mb-4 font-light text-black">Plateforme e-commerce de nouvelle génération</p>
          <p className="text-lg mb-10 max-w-2xl mx-auto text-gray-800">Découvrez notre sélection exclusive de produits de qualité dans un environnement moderne et sécurisé</p>
          <a
            href="#products"
            className="inline-block bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-orange-500"
          >
            Découvrir nos produits
          </a>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-3xl p-10 shadow-2xl border-2 border-orange-500">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">
              Nos <span className="text-orange-700">Catégories</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categoryList.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setCurrentFilter(category.id)}
                  className="bg-gradient-to-br from-orange-400 to-orange-500 text-black p-8 rounded-2xl text-center cursor-pointer hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 border-2 border-orange-600/50 hover:border-orange-700 group"
                >
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-black">{category.name}</h3>
                  <p className="text-sm text-gray-800">{category.description}</p>
                </div>
              ))}
            </div>
            {currentFilter !== 'all' && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setCurrentFilter('all')}
                  className="bg-gradient-to-r from-gray-700 to-black text-white px-8 py-3 rounded-full hover:from-black hover:to-gray-700 transition-all duration-300 border border-orange-600/50 hover:border-orange-600"
                >
                  Voir tous les produits
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-3xl p-10 shadow-2xl border-2 border-orange-500">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">
              {currentFilter === 'all' ? 'Produits' : 'Produits Filtrés'} <span className="text-orange-700">Populaires</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {getFilteredProducts().map((product) => (
                <div
                  key={product.id}
                  className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-orange-400 hover:border-orange-600/70 group"
                >
                  <div className="h-52 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center text-7xl text-white group-hover:scale-110 transition-transform duration-300">
                    {product.icon}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 text-black group-hover:text-orange-700 transition-colors">{product.name}</h3>
                    <p className="text-3xl font-bold text-orange-700 mb-3">
                      {product.price.toLocaleString()} 
                      <span className="text-lg font-normal text-gray-700"> FCFA</span>
                    </p>
                    <p className="text-gray-700 mb-6 text-sm leading-relaxed">{product.description}</p>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-3 rounded-xl font-bold hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl border border-orange-500"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {getFilteredProducts().length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-black">Aucun produit trouvé</p>
                <p className="text-gray-700">Essayez un autre terme de recherche ou changez de catégorie</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-96 bg-orange-100 shadow-2xl z-50 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} border-l-4 border-orange-600`}>
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-6 flex justify-between items-center border-b-2 border-orange-600">
          <h3 className="text-xl font-bold text-black">Mon <span className="text-orange-800">Panier</span></h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-2xl hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:text-orange-800 text-black"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]">
          {cart.length === 0 ? (
            <div className="text-center mt-16">
              <div className="text-6xl mb-4 opacity-50">🛒</div>
              <p className="text-gray-600 text-lg">Votre panier est vide</p>
              <p className="text-gray-500 text-sm mt-2">Ajoutez des produits pour commencer</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-4 border-b border-orange-300 hover:bg-orange-200 px-2 rounded-lg transition-colors">
                <div className="flex-1">
                  <h4 className="font-bold text-black">{item.name}</h4>
                  <p className="text-sm text-gray-700">Quantité: <span className="font-semibold text-orange-700">{item.quantity}</span></p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-orange-700 text-lg">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 text-sm hover:bg-red-50 px-3 py-1 rounded-full transition-all duration-300 font-medium border border-red-300 hover:border-red-400"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t-2 border-orange-600 p-6 bg-orange-200">
            <div className="text-center mb-6 bg-white p-4 rounded-xl border-2 border-orange-400">
              <p className="text-2xl font-bold text-black">
                Total: <span className="text-orange-700">{getCartTotal().toLocaleString()} FCFA</span>
              </p>
            </div>
            <button
              onClick={checkout}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-bold hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-green-400"
            >
              🛍️ Passer commande
            </button>
          </div>
        )}
      </div>

      {/* Overlay pour fermer le panier */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {/* Notification */}
      <div className={`fixed top-24 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform transition-all duration-300 border-2 border-green-400 ${showNotification ? 'translate-x-0 scale-100' : 'translate-x-full scale-95'}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">✅</span>
          <span className="font-bold">Produit ajouté au panier !</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-orange-400 py-12 mt-16 border-t-4 border-orange-600">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg flex items-center justify-center text-2xl">
              🛒
            </div>
            <span className="text-3xl font-bold">
              <span className="text-orange-800">Logo</span>
              <span className="text-black">Douman</span>
            </span>
          </div>
          <p className="text-lg mb-2 text-black">&copy; 2024 LogoDouman. Créé avec <span className="text-orange-700">❤️</span> pour révolutionner l'e-commerce</p>
          <p className="text-orange-800 font-medium">Plateforme e-commerce de nouvelle génération</p>
          <div className="mt-6 flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-orange-800 transition-colors text-gray-800">Mentions légales</a>
            <a href="#" className="hover:text-orange-800 transition-colors text-gray-800">CGV</a>
            <a href="#" className="hover:text-orange-800 transition-colors text-gray-800">Contact</a>
            <a href="#" className="hover:text-orange-800 transition-colors text-gray-800">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}