'use client';

import { useState } from 'react';
import Link from 'next/link';

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">LogoDouman</Link>
            <span className="ml-2 text-sm text-gray-500">Côte d'Ivoire</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">Accueil</Link>
            <Link href="/boutique" className="text-gray-700 hover:text-gray-900 transition-colors">Boutique</Link>
            <Link href="/blog" className="text-gray-900 font-medium">Blog</Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">Nous contacter</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              ⚙️ Admin
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="py-2 text-gray-700 hover:text-gray-900">Accueil</Link>
              <Link href="/boutique" className="py-2 text-gray-700 hover:text-gray-900">Boutique</Link>
              <Link href="/blog" className="py-2 text-gray-900 font-medium">Blog</Link>
              <Link href="/contact" className="py-2 text-gray-700 hover:text-gray-900">Nous contacter</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Articles de blog fictifs
const blogPosts = [
  {
    id: 1,
    title: "Comment choisir le sac à main parfait selon votre morphologie",
    excerpt: "Découvrez nos conseils d'experts pour sélectionner le sac à main qui mettra en valeur votre silhouette et complètera parfaitement votre style.",
    date: "15 Décembre 2024",
    category: "Conseils Style",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop",
    readTime: "5 min de lecture"
  },
  {
    id: 2,
    title: "Tendances sacs à main 2025 : Ce qui vous attend cette année",
    excerpt: "Explorez les dernières tendances en matière de sacs à main pour 2025. Des couleurs audacieuses aux formes innovantes, voici ce qui va marquer l'année.",
    date: "10 Décembre 2024",
    category: "Tendances",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
    readTime: "7 min de lecture"
  },
  {
    id: 3,
    title: "L'art de l'entretien : Garder vos sacs en parfait état",
    excerpt: "Nos astuces professionnelles pour nettoyer, protéger et conserver vos sacs à main en cuir et autres matériaux précieux.",
    date: "5 Décembre 2024",
    category: "Entretien",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=400&fit=crop",
    readTime: "4 min de lecture"
  },
  {
    id: 4,
    title: "Sacs vintage vs modernes : Trouver l'équilibre parfait",
    excerpt: "Comment mixer avec style les pièces vintage et les créations contemporaines pour un look unique et personnalisé.",
    date: "1 Décembre 2024",
    category: "Style",
    image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&h=400&fit=crop",
    readTime: "6 min de lecture"
  },
  {
    id: 5,
    title: "Les matériaux nobles : Cuir, daim et alternatives éco-responsables",
    excerpt: "Découvrez les différents matériaux utilisés dans la maroquinerie haut de gamme et leurs avantages respectifs.",
    date: "25 Novembre 2024",
    category: "Matériaux",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop",
    readTime: "8 min de lecture"
  },
  {
    id: 6,
    title: "Guide d'achat : Investir dans un sac à main de qualité",
    excerpt: "Les critères essentiels à considérer avant d'investir dans un sac à main haut de gamme qui vous accompagnera pendant des années.",
    date: "20 Novembre 2024",
    category: "Guide d'achat",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
    readTime: "10 min de lecture"
  }
];

const categories = ["Tous", "Conseils Style", "Tendances", "Entretien", "Style", "Matériaux", "Guide d'achat"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredPosts = selectedCategory === "Tous" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Blog LogoDouman
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Conseils d'experts, tendances mode et guides pratiques pour tout savoir 
              sur l'univers des sacs à main et de la maroquinerie.
            </p>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-colors font-medium ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <article key={post.id} className="group cursor-pointer">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <button className="text-gray-900 font-medium hover:text-gray-600 transition-colors">
                      Lire la suite →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-600">Aucun article ne correspond à cette catégorie.</p>
              <button
                onClick={() => setSelectedCategory("Tous")}
                className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Voir tous les articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Restez informé de nos derniers articles
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Recevez nos conseils mode et nos guides pratiques directement dans votre boîte mail.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              S'abonner
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LogoDouman</h3>
              <p className="text-gray-400">
                Votre destination pour les sacs à main de qualité premium en Côte d'Ivoire.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link href="/boutique" className="hover:text-white transition-colors">Boutique</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Articles populaires</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Conseils Style</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tendances 2025</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guide d'entretien</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Matériaux nobles</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📍 Abidjan, Côte d'Ivoire</li>
                <li>📧 contact@logodouman.com</li>
                <li>📱 +225 XX XX XX XX XX</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LogoDouman. Tous droits réservés. | Côte d'Ivoire</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
