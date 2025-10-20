'use client';

import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <PublicHeader />
      
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-orange-400/30">
              <ShieldCheckIcon className="w-5 h-5 text-orange-400" />
              <span className="text-orange-200 font-semibold">Protection des données</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
              Politique de Confidentialité
            </h1>
            <p className="text-lg text-gray-300">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            
            <div className="prose prose-lg max-w-none">
              
              <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
                <p className="text-blue-900 font-semibold mb-2">🔒 Votre vie privée est importante pour nous</p>
                <p className="text-blue-800 text-sm">
                  Cette politique explique comment LogoDouman collecte, utilise et protège vos données personnelles lorsque vous utilisez notre site web.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Données collectées</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous collectons les types de données personnelles suivants :
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Données d'identification</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Adresse postale</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Données de commande</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Historique des achats</li>
                <li>Préférences de produits</li>
                <li>Adresses de livraison</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Données de navigation</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Adresse IP</li>
                <li>Type de navigateur</li>
                <li>Pages visitées</li>
                <li>Temps passé sur le site</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Utilisation des données</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Traiter et livrer vos commandes</li>
                <li>Gérer votre compte client</li>
                <li>Vous contacter concernant vos commandes</li>
                <li>Améliorer nos produits et services</li>
                <li>Vous envoyer des offres promotionnelles (avec votre consentement)</li>
                <li>Prévenir la fraude et assurer la sécurité</li>
                <li>Respecter nos obligations légales</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Base légale du traitement</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous traitons vos données sur les bases légales suivantes :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Exécution du contrat :</strong> pour traiter vos commandes</li>
                <li><strong>Intérêt légitime :</strong> pour améliorer nos services</li>
                <li><strong>Consentement :</strong> pour l'envoi de newsletters</li>
                <li><strong>Obligation légale :</strong> pour la comptabilité et les obligations fiscales</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Partage des données</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Nous ne vendons jamais vos données personnelles à des tiers. Vos données peuvent être partagées avec :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Nos prestataires de services (livraison, paiement)</li>
                <li>Les autorités légales si requis par la loi</li>
                <li>Nos partenaires avec votre consentement explicite</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6">
                Tous nos prestataires sont tenus par des accords de confidentialité et ne peuvent utiliser vos données que pour les fins spécifiques que nous leur avons indiquées.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Conservation des données</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Nous conservons vos données personnelles :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Pendant la durée de notre relation commerciale</li>
                <li>3 ans après votre dernière activité pour les données de compte</li>
                <li>10 ans pour les données comptables (obligation légale)</li>
                <li>Jusqu'à révocation de votre consentement pour les newsletters</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Sécurité des données</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>L'accès non autorisé</li>
                <li>La divulgation</li>
                <li>La modification</li>
                <li>La destruction</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6">
                Ces mesures incluent le chiffrement SSL, des pare-feu, des contrôles d'accès stricts et des audits de sécurité réguliers.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Vos droits</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conformément à la réglementation, vous disposez des droits suivants :
              </p>
              
              <div className="bg-green-50 rounded-xl p-6 mb-6 border border-green-100">
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Droit d'accès :</strong> obtenir une copie de vos données</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Droit de rectification :</strong> corriger vos données inexactes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Droit à l'effacement :</strong> supprimer vos données</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Droit à la limitation :</strong> limiter le traitement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Droit d'opposition :</strong> vous opposer au traitement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Droit de retirer votre consentement :</strong> à tout moment</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                Pour exercer ces droits, contactez-nous à : <strong className="text-orange-600">contact@logodouman.com</strong>
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Types de cookies utilisés :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site</li>
                <li><strong>Cookies analytiques :</strong> pour comprendre l'utilisation du site</li>
                <li><strong>Cookies de préférence :</strong> pour mémoriser vos choix</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. Modifications</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Nous vous informerons de toute modification importante par email ou via une notification sur notre site.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10. Contact</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
              </p>
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                <p className="text-gray-900 font-semibold mb-3">Responsable de la protection des données</p>
                <p className="text-gray-700 mb-2">📧 Email : contact@logodouman.com</p>
                <p className="text-gray-700 mb-2">📞 Téléphone : +225 XX XX XX XX XX</p>
                <p className="text-gray-700">📍 Adresse : LogoDouman, Abidjan, Plateau, Côte d'Ivoire</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

