'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '../../contexts/StoreContext';
import { useCart } from '../../contexts/CartContext';
import PublicHeader from '../../components/PublicHeader';
import PublicFooter from '../../components/PublicFooter';
import ProductReviews from '../../components/ProductReviews';
import { ProductService } from '../../config/api';
import { Product } from '../../../types';
import Link from 'next/link';
import {
  ShoppingBagIcon,
  SparklesIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  HeartIcon,
  ShareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';

type TabType = 'description' | 'specifications' | 'reviews';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getActiveProducts, getActiveCategories } = useStore();
  const { addItem } = useCart();
  
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const loadedProductIdRef = useRef<string | null>(null);

  // Stabiliser les produits et catégories avec useMemo pour éviter les re-renders
  const products = useMemo(() => getActiveProducts(), []);
  const categories = useMemo(() => getActiveCategories(), []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError('ID produit manquant');
        setLoading(false);
        return;
      }

      // Éviter de recharger si le même produit est déjà chargé
      if (loadedProductIdRef.current === productId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Essayer de charger depuis l'API
        const apiProduct = await ProductService.getById(productId);
        
        if (apiProduct) {
          setProduct(apiProduct);
          // Définir l'image principale ou la première image de la galerie
          const firstImage = apiProduct.image || (apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images[0] : null);
          setSelectedImage(firstImage);
          loadedProductIdRef.current = productId;
          setLoading(false);
          return;
        }

        // Fallback: chercher dans les produits locaux
        const currentProducts = getActiveProducts();
        const localProduct = currentProducts.find(p => p.id.toString() === productId);
        
        if (localProduct) {
          setProduct(localProduct);
          const firstImage = localProduct.image || (localProduct.images && localProduct.images.length > 0 ? localProduct.images[0] : null);
          setSelectedImage(firstImage);
          loadedProductIdRef.current = productId;
        } else {
          setError('Produit non trouvé');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
        
        // Fallback: chercher dans les produits locaux
        const currentProducts = getActiveProducts();
        const localProduct = currentProducts.find(p => p.id.toString() === productId);
        
        if (localProduct) {
          setProduct(localProduct);
          const firstImage = localProduct.image || (localProduct.images && localProduct.images.length > 0 ? localProduct.images[0] : null);
          setSelectedImage(firstImage);
          loadedProductIdRef.current = productId;
        } else {
          setError('Produit non trouvé');
        }
      } finally {
        setLoading(false);
      }
    };

    // Ne charger que si le productId change
    if (productId !== loadedProductIdRef.current) {
      loadProduct();
    }
  }, [productId]); // Seulement productId comme dépendance

  // Produits similaires (même catégorie, exclure le produit actuel)
  const similarProducts = products
    .filter(p => p.id !== product?.id && p.categoryId === product?.categoryId)
    .slice(0, 4);

  const category = categories.find(c => c.id === product?.categoryId);
  const isNew = product ? (new Date().getTime() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000) : false;
  
  const priceInFCFA = product ? Math.round(product.price / 100) : 0;
  const availableColors = product?.colors || [];
  const maxQuantity = product?.stock || 0;

  const handleAddToCart = () => {
    if (!product || maxQuantity === 0) return;
    
    try {
      addItem(product, quantity, selectedColor || undefined);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch {
      // Erreur silencieuse
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erreur lors du partage:', err);
      }
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement...</h2>
            <p className="text-gray-600">Récupération des détails du produit</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
            <p className="text-gray-600 mb-6">{error || 'Le produit demandé n\'existe pas'}</p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Retour à la boutique
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <PublicHeader />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/boutique" className="hover:text-orange-600 transition-colors">
              Boutique
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Section Image */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 group">
              <img
                src={selectedImage || product.image || `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop`}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setImageZoom(true)}
                loading="eager"
                key={selectedImage || product.image || 'default'}
                onError={(e) => { 
                  if (e.currentTarget.src !== `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop`) {
                    e.currentTarget.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop`;
                  }
                }}
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {isNew && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                    <SparklesIcon className="w-3 h-3" />
                    Nouveau
                  </span>
                )}
                {maxQuantity > 0 && maxQuantity <= 5 && (
                  <span className="inline-block px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                    Dernières pièces
                  </span>
                )}
              </div>

              {/* Badge stock */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                  maxQuantity > 10 ? 'bg-green-500 text-white' :
                  maxQuantity > 5 ? 'bg-yellow-500 text-white' :
                  maxQuantity > 0 ? 'bg-red-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {maxQuantity > 0 ? `${maxQuantity} en stock` : 'Rupture de stock'}
                </span>
              </div>

              {/* Actions rapides */}
              <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all shadow-lg ${
                    isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/90 text-gray-900 hover:bg-white'
                  }`}
                  title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  {isFavorite ? (
                    <HeartIconSolid className="w-5 h-5" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white/90 text-gray-900 rounded-full backdrop-blur-sm hover:bg-white transition-all shadow-lg"
                  title="Partager"
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Galerie d'images multiples */}
            {(() => {
              const allImages: string[] = [];
              if (product.image) allImages.push(product.image);
              if (product.images && product.images.length > 0) {
                product.images.forEach(img => {
                  if (img && !allImages.includes(img)) allImages.push(img);
                });
              }
              
              if (allImages.length > 1) {
                return (
                  <div className="grid grid-cols-4 gap-2">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === img 
                            ? 'border-orange-500 shadow-lg scale-105' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} - Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* Section Détails */}
          <div className="space-y-6">
            {/* En-tête */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-sm font-bold text-orange-600 uppercase tracking-wide">
                  {category?.name || 'Non catégorisé'}
                </span>
                {product.sku && (
                  <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                )}
                {(product as any).seller?.slug && (
                  <Link
                    href={`/vendeur/${(product as any).seller.slug}`}
                    className="text-sm text-gray-500 hover:text-orange-600"
                  >
                    Vendu par {(product as any).seller.storeName}
                  </Link>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {priceInFCFA.toLocaleString()} FCFA
                </span>
                <span className="text-sm text-gray-500">Prix TTC</span>
              </div>
            </div>

            {/* Message de succès */}
            {showSuccessMessage && (
              <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-in">
                <CheckIcon className="w-5 h-5" />
                <span className="font-bold">Produit ajouté au panier !</span>
              </div>
            )}

            {/* Sélection Couleur */}
            {availableColors.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Couleur {selectedColor && `: ${selectedColor}`}
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        selectedColor === color
                          ? 'bg-orange-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sélection Quantité */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Quantité
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <MinusIcon className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-3 text-lg font-bold text-gray-900 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= maxQuantity}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {maxQuantity > 0 ? `${maxQuantity} disponibles` : 'Rupture de stock'}
                </span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={maxQuantity === 0}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  maxQuantity === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                <ShoppingBagIcon className="w-6 h-6" />
                {maxQuantity === 0 ? 'Indisponible' : 'Ajouter au panier'}
              </button>
              
              <button
                onClick={() => { addItem(product, quantity, selectedColor || undefined); window.location.href = '/panier'; }}
                disabled={maxQuantity === 0}
                className="w-full py-4 px-6 rounded-xl font-bold text-lg border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Acheter maintenant
              </button>
            </div>

            {/* Garanties */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TruckIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Livraison rapide</h3>
                  <p className="text-sm text-gray-600">48h à Abidjan</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <ShieldCheckIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Qualité garantie</h3>
                  <p className="text-sm text-gray-600">Produits authentiques</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CreditCardIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Paiement sécurisé</h3>
                  <p className="text-sm text-gray-600">Transactions 100% sécurisées</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets Description / Spécifications / Avis */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Navigation des onglets */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 py-4 px-6 text-center font-bold transition-colors ${
                  activeTab === 'description'
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`flex-1 py-4 px-6 text-center font-bold transition-colors ${
                  activeTab === 'specifications'
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                Spécifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-4 px-6 text-center font-bold transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                Avis ({product && typeof product.id === 'number' ? '...' : '0'})
              </button>
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.material && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Matériau</span>
                <p className="text-lg font-bold text-gray-900">{product.material}</p>
              </div>
            )}
            
            {product.dimensions && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Dimensions</span>
                <p className="text-lg font-bold text-gray-900">{product.dimensions}</p>
              </div>
            )}
            
            {product.weight && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Poids</span>
                <p className="text-lg font-bold text-gray-900">{product.weight} kg</p>
              </div>
            )}
            
            {product.shape && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Forme</span>
                <p className="text-lg font-bold text-gray-900">{product.shape}</p>
              </div>
            )}
            
            {product.closure && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Fermeture</span>
                <p className="text-lg font-bold text-gray-900">{product.closure}</p>
              </div>
            )}
            
            {product.handles && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Poignées</span>
                <p className="text-lg font-bold text-gray-900">{product.handles}</p>
              </div>
            )}
            
            {product.lining && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Doublure</span>
                <p className="text-lg font-bold text-gray-900">{product.lining}</p>
              </div>
            )}
            
            {product.coating && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Revêtement</span>
                <p className="text-lg font-bold text-gray-900">{product.coating}</p>
              </div>
            )}
            
            {product.pattern && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Motif</span>
                <p className="text-lg font-bold text-gray-900">{product.pattern}</p>
              </div>
            )}
            
            {product.decoration && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Décoration</span>
                <p className="text-lg font-bold text-gray-900">{product.decoration}</p>
              </div>
            )}
            
            {product.season && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Saison</span>
                <p className="text-lg font-bold text-gray-900">{product.season}</p>
              </div>
            )}
            
            {product.occasion && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Occasion</span>
                <p className="text-lg font-bold text-gray-900">{product.occasion}</p>
              </div>
            )}
            
            {product.gender && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Genre</span>
                <p className="text-lg font-bold text-gray-900">{product.gender}</p>
              </div>
            )}
            
            {product.ageGroup && (
              <div>
                <span className="text-sm font-semibold text-gray-500">Tranche d'âge</span>
                <p className="text-lg font-bold text-gray-900">{product.ageGroup}</p>
              </div>
            )}
            
            {product.styles && product.styles.length > 0 && (
              <div className="md:col-span-2 lg:col-span-3">
                <span className="text-sm font-semibold text-gray-500">Styles</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.styles.map((style, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {product.features && product.features.length > 0 && (
              <div className="md:col-span-2 lg:col-span-3">
                <span className="text-sm font-semibold text-gray-500">Caractéristiques</span>
                <ul className="mt-2 space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
              </div>
            )}

            {activeTab === 'reviews' && product && typeof product.id === 'number' && (
              <ProductReviews productId={product.id} />
            )}
          </div>
        </div>

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => {
                const similarCategory = categories.find(c => c.id === similarProduct.categoryId);
                return (
                  <Link
                    key={similarProduct.id}
                    href={`/boutique/${similarProduct.id}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={similarProduct.image || `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop`}
                        alt={similarProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { 
                          e.currentTarget.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop`;
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                          (similarProduct.stock || 0) > 10 ? 'bg-green-500 text-white' :
                          (similarProduct.stock || 0) > 5 ? 'bg-yellow-500 text-white' :
                          (similarProduct.stock || 0) > 0 ? 'bg-red-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {(similarProduct.stock || 0) > 0 ? `${similarProduct.stock}` : 'Rupture'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                        {similarCategory?.name}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {similarProduct.name}
                      </h3>
                      <div className="text-xl font-bold text-gray-900">
                        {Math.round(similarProduct.price / 100).toLocaleString()} FCFA
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <PublicFooter />

      {/* Modal Zoom Image */}
      {imageZoom && selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setImageZoom(false)}
        >
          <button
            onClick={() => setImageZoom(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

