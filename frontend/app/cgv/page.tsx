'use client';

import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import { ScaleIcon } from '@heroicons/react/24/outline';

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <PublicHeader />
      
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-orange-400/30">
              <ScaleIcon className="w-5 h-5 text-orange-400" />
              <span className="text-orange-200 font-semibold">Informations légales</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
              Conditions Générales de Vente
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
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">1. Objet</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Les présentes Conditions Générales de Vente (CGV) régissent les ventes de sacs à main et accessoires proposés par LogoDouman sur le site logodouman.genea.space. Toute commande implique l'acceptation sans réserve des présentes CGV.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Produits</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Les produits proposés sont conformes à la législation en vigueur en Côte d'Ivoire. Les photographies et descriptions sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite avec le produit livré.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Prix</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Les prix sont indiqués en Francs CFA (FCFA), toutes taxes comprises (TTC). LogoDouman se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix figurant sur le site le jour de la commande sera le seul applicable à l'acheteur.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Commande</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Le client passe commande via le site internet ou par téléphone. Toute commande vaut acceptation des prix et descriptions des produits disponibles à la vente. La vente ne sera considérée comme définitive qu'après l'envoi au client de la confirmation de l'acceptation de la commande par LogoDouman.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Paiement</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Le paiement peut s'effectuer par :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Espèces à la livraison</li>
                <li>Virement bancaire</li>
                <li>Mobile Money (Orange Money, MTN Money, Moov Money)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6">
                Le paiement est exigible immédiatement à la commande ou à la livraison selon le mode choisi.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Livraison</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Les livraisons sont effectuées à l'adresse indiquée par le client lors de la commande. Les délais de livraison sont donnés à titre indicatif. LogoDouman ne pourra être tenu responsable des conséquences dues à un retard d'acheminement.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>Zone de livraison :</strong> Abidjan et environs<br />
                <strong>Délai indicatif :</strong> 2 à 5 jours ouvrés
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Droit de rétractation</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Conformément à la réglementation en vigueur, le client dispose d'un délai de 14 jours à compter de la réception du produit pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Le produit doit être retourné dans son état d'origine, non utilisé, avec tous ses accessoires et son emballage d'origine. Les frais de retour sont à la charge du client.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Garantie</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Tous nos produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés. En cas de non-conformité ou de vice caché, le client peut demander l'échange ou le remboursement du produit dans un délai de 30 jours suivant la livraison.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. Responsabilité</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                LogoDouman ne saurait être tenu responsable de l'inexécution du contrat en cas de rupture de stock, d'indisponibilité du produit, de force majeure, de perturbation ou grève totale ou partielle notamment des services postaux et moyens de transport.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10. Données personnelles</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Les informations recueillies font l'objet d'un traitement informatique destiné à la gestion des commandes. Conformément à la loi, vous disposez d'un droit d'accès, de modification et de suppression des données vous concernant.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11. Litiges</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Les présentes CGV sont soumises au droit ivoirien. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux d'Abidjan seront seuls compétents.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">12. Contact</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Pour toute question relative aux présentes CGV, vous pouvez nous contacter :
              </p>
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                <p className="text-gray-900 font-semibold mb-2">LogoDouman</p>
                <p className="text-gray-700 mb-1">📍 Abidjan, Plateau, Côte d'Ivoire</p>
                <p className="text-gray-700 mb-1">📧 contact@logodouman.com</p>
                <p className="text-gray-700">📞 +225 XX XX XX XX XX</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

