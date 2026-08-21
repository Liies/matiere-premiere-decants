import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-5xl font-light text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-600 font-light">
            Dernière mise à jour : Mai 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">1. Introduction</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Matière Première s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">2. Données Collectées</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Nous collectons les informations que vous nous fournissez directement, telles que votre nom, votre adresse email, votre adresse de livraison et vos informations de paiement. Nous collectons également automatiquement certaines informations sur votre utilisation du site, comme votre adresse IP et vos habitudes de navigation.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">3. Utilisation des Données</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Nous utilisons vos données pour traiter vos commandes, vous envoyer des confirmations, vous contacter en cas de problème, et améliorer notre service. Nous ne vendons jamais vos données à des tiers.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">4. Sécurité des Données</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Nous utilisons des mesures de sécurité appropriées pour protéger vos données personnelles contre l'accès non autorisé, la modification ou la destruction. Toutes les transactions sont chiffrées avec SSL.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">5. Cookies</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez contrôler les cookies via les paramètres de votre navigateur. Certains cookies sont essentiels au fonctionnement du site.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">6. Droits de l'Utilisateur</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Vous avez le droit d'accéder à vos données personnelles, de les corriger ou de les supprimer. Vous pouvez également vous opposer à certains traitements. Pour exercer ces droits, veuillez nous contacter.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">7. Partage des Données</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Nous ne partageons vos données qu'avec nos partenaires de livraison et de paiement, uniquement pour traiter votre commande. Ces partenaires sont tenus de respecter la confidentialité de vos données.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">8. Modifications de la Politique</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Nous nous réservons le droit de modifier cette politique à tout moment. Les modifications seront publiées sur ce site. Votre utilisation continue du site signifie votre acceptation des modifications.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">9. Conformité RGPD</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Matière Première est conforme au Règlement Général sur la Protection des Données (RGPD). Nous traitons vos données uniquement avec votre consentement ou pour l'exécution d'un contrat.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-gray-200">
            <h2 className="text-3xl font-light text-gray-900">Contact</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à{" "}
              <a href="mailto:contact@matiere-premiere.fr" className="text-gray-900 hover:underline">
                contact@matiere-premiere.fr
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
