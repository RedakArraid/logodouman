'use client';

import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <PublicHeader />
      
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-orange-400/30">
              <DocumentTextIcon className="w-5 h-5 text-orange-400" />
              <span className="text-orange-200 font-semibold">Informations légales</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
              Mentions Légales
            </h1>
            <p className="text-lg text-gray-300">
              Informations légales sur LogoDouman
            </p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            
            <div className="prose prose-lg max-w-none">
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
              <div className="bg-orange-50 rounded-xl p-6 mb-6 border border-orange-100">
                <p className="text-gray-900 font-semibold mb-4">LogoDouman</p>
                <p className="text-gray-700 mb-2">
                  <strong>Raison sociale :</strong> LogoDouman SARL
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Siège social :</strong> Abidjan, Plateau, Côte d'Ivoire
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Email :</strong> contact@logodouman.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Téléphone :</strong> +225 XX XX XX XX XX
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Directeur de la publication :</strong> [Nom du directeur]
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Hébergement</h2>
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                <p className="text-gray-700 mb-2">
                  <strong>Hébergeur :</strong> Genea.space
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Site web :</strong> https://genea.space
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Propriété intellectuelle</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est la propriété exclusive de LogoDouman, sauf mention contraire. Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord exprès par écrit de LogoDouman.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                La marque LogoDouman, ainsi que les logos et graphismes figurant sur le site sont des marques déposées. Toute reproduction totale ou partielle de ces marques et/ou logos sans autorisation préalable et écrite de LogoDouman est interdite.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Protection des données personnelles</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Conformément à la loi relative à la protection des données personnelles, vous disposez d'un droit d'accès, de modification, de rectification et de suppression des données vous concernant.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Pour exercer ce droit, vous pouvez nous contacter :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Par email : contact@logodouman.com</li>
                <li>Par courrier : LogoDouman, Abidjan, Plateau, Côte d'Ivoire</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6">
                Les données collectées sont destinées à la gestion de votre compte client, au traitement de vos commandes et à l'amélioration de nos services. Elles ne seront en aucun cas cédées à des tiers sans votre consentement préalable.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Le site LogoDouman utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visites. Un cookie est un fichier texte déposé sur votre ordinateur lors de la visite d'un site ou de la consultation d'une publicité.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Vous pouvez désactiver les cookies dans les paramètres de votre navigateur. Toutefois, cela peut affecter certaines fonctionnalités du site.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Responsabilité</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                LogoDouman s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, LogoDouman ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                En conséquence, LogoDouman décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Liens hypertextes</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Le site peut contenir des liens vers d'autres sites. LogoDouman n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à l'accès, au contenu ou à l'utilisation de ces sites, ainsi qu'aux dommages pouvant résulter de la consultation des informations présentes sur ces sites.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Droit applicable</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Les présentes mentions légales sont régies par le droit ivoirien. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux compétents d'Abidjan, Côte d'Ivoire.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. Contact</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
              </p>
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                <p className="text-gray-700 mb-1">📧 Email : contact@logodouman.com</p>
                <p className="text-gray-700 mb-1">📞 Téléphone : +225 XX XX XX XX XX</p>
                <p className="text-gray-700">📍 Adresse : Abidjan, Plateau, Côte d'Ivoire</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

