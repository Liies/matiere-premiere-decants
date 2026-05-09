import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ChevronDown, Leaf } from "lucide-react";

export default function FAQ() {
  const { isAuthenticated } = useAuth();
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqs = [
    {
      question: "Qu'est-ce qu'un décant ?",
      answer:
        "Un décant est une petite portion d'un parfum, généralement 50ml, présentée dans un flacon de luxe. C'est le format parfait pour découvrir une fragrance ou l'emporter en voyage.",
    },
    {
      question: "Quelle est la différence entre une Eau de Parfum et une Eau de Toilette ?",
      answer:
        "L'Eau de Parfum contient 15-20% de concentration en parfum et dure plus longtemps (4-8 heures). L'Eau de Toilette en contient 5-15% et dure environ 3-4 heures. Nos décants sont des Eaux de Parfum pour une meilleure tenue.",
    },
    {
      question: "Comment conserver mon parfum ?",
      answer:
        "Conservez votre décant à l'abri de la lumière directe, à température ambiante stable. Évitez les variations de température extrêmes. Un placard ou un tiroir est idéal. Gardez le bouchon fermé pour éviter l'évaporation.",
    },
    {
      question: "Combien de temps dure un décant 50ml ?",
      answer:
        "Cela dépend de votre utilisation. En moyenne, 2-3 pulvérisations par jour, un décant 50ml dure environ 2-3 mois. Chaque personne a une consommation différente selon ses préférences.",
    },
    {
      question: "Livrez-vous en dehors de l'Europe ?",
      answer:
        "Actuellement, nous livrons partout en Europe. Pour les livraisons internationales, veuillez nous contacter via notre page de contact.",
    },
    {
      question: "Quelle est votre politique de retour ?",
      answer:
        "Nous acceptons les retours dans les 30 jours suivant la réception. Le produit doit être non ouvert et dans son emballage d'origine. Les frais de retour sont à la charge du client.",
    },
    {
      question: "Puis-je acheter sans créer un compte ?",
      answer:
        "Oui ! Vous pouvez ajouter des produits au panier sans vous connecter. Cependant, vous devrez créer un compte ou vous connecter pour finaliser votre commande.",
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer:
        "Les commandes sont généralement expédiées sous 2-3 jours ouvrables. La livraison en Europe prend 5-10 jours ouvrables selon votre localisation.",
    },
    {
      question: "Puis-je obtenir un échantillon gratuit ?",
      answer:
        "Nous proposons occasionnellement des échantillons gratuits avec les commandes. Contactez-nous pour connaître les conditions actuelles.",
    },
    {
      question: "Comment puis-je connaître les notes olfactives d'un parfum ?",
      answer:
        "Chaque parfum dans notre catalogue est accompagné d'une description détaillée incluant les notes de tête, de cœur et de fond. Vous trouverez également des informations sur les matières premières utilisées.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container flex items-center justify-between py-6">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Leaf className="w-6 h-6 text-gray-900" />
              <h1 className="text-2xl font-light tracking-wider text-gray-900">
                Matière Première
              </h1>
            </div>
          </Link>
          <nav className="flex items-center gap-8">
            <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Catalogue
            </Link>
            <Link href="/faq" className="text-sm text-gray-900 font-medium">
              FAQ
            </Link>
            <Link href="/cart" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Panier
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900">
            Questions Fréquentes
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Trouvez les réponses à vos questions sur Matière Première
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-light text-gray-900 text-left">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      openItems[index] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openItems[index] && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 font-light leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-light text-gray-900">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Contactez-nous directement et nous serons heureux de vous aider.
          </p>
          <Link href="/contact">
            <button className="inline-block px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-light rounded transition">
              Nous Contacter
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
