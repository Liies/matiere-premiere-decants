import { useAuth } from "@/_core/hooks/useAuth";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Terms() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-5xl font-light text-gray-900 mb-4">
            Conditions d'Utilisation
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
            <h2 className="text-3xl font-light text-gray-900">1. Acceptation des Conditions</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              En accédant et en utilisant ce site, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">2. Utilisation du Site</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Vous acceptez d'utiliser ce site uniquement à des fins légales et de manière qui ne viole pas les droits d'autrui ou ne restreint pas leur utilisation et leur jouissance du site.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">3. Propriété Intellectuelle</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Tout le contenu du site, y compris les textes, les images, les logos et les vidéos, est la propriété de Matière Première ou de ses fournisseurs de contenu et est protégé par les lois sur les droits d'auteur.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">4. Produits et Prix</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Tous les produits sont offerts sous réserve de disponibilité. Nous nous réservons le droit de modifier les prix à tout moment. Les prix affichés incluent les taxes applicables.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">5. Commandes et Paiement</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              En passant une commande, vous acceptez de fournir des informations exactes et à jour. Nous acceptons les paiements par carte bancaire et autres méthodes de paiement sécurisées.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">6. Livraison</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Nous livrons dans toute l'Europe. Les délais de livraison sont estimatifs et ne constituent pas une garantie. Nous ne sommes pas responsables des retards causés par les transporteurs.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">7. Retours et Remboursements</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Les retours sont acceptés dans les 30 jours suivant la réception. Les produits doivent être non ouverts et dans leur emballage d'origine. Les frais de retour sont à la charge du client.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">8. Limitation de Responsabilité</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Matière Première ne sera pas responsable des dommages indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'incapacité à utiliser ce site ou les produits.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">9. Modifications des Conditions</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront publiées sur ce site et entreront en vigueur immédiatement.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-light text-gray-900">10. Droit Applicable</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Ces conditions d'utilisation sont régies par les lois de la France. Tout litige sera soumis à la juridiction exclusive des tribunaux français.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-gray-200">
            <h2 className="text-3xl font-light text-gray-900">Contact</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              Pour toute question concernant ces conditions, veuillez nous contacter à{" "}
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
