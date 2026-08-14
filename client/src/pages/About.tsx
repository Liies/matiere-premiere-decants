import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function About() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900">
            À Propos de Matière Première
          </h1>
          <p className="text-xl text-gray-600 font-light">
            L'histoire d'une passion pour la pureté olfactive
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-3xl mx-auto space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-light text-gray-900">Notre Fondation</h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Matière Première a été fondée en 2016 avec une vision simple mais audacieuse : créer des parfums qui célèbrent la pureté d'une seule matière première. Entre Paris et Grasse, deux villes symboles de la parfumerie française, nous avons construit une maison dédiée à l'excellence olfactive.
            </p>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Chaque fragrance Matière Première raconte l'histoire d'une matière brute exceptionnelle, transformée par nos maîtres parfumeurs en une expérience sensorielle inoubliable. Pas de compromis, pas de distractions. Juste la pureté absolue.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-light text-gray-900">Notre Philosophie</h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Nous croyons que la parfumerie véritable commence par la qualité des matières premières. C'est pourquoi nous travaillons exclusivement avec les meilleures sources mondiales : vanille de Madagascar, safran de Grasse, roses de Bulgarie, cuir d'Espagne.
            </p>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Chaque ingrédient est sélectionné avec soin, chaque formule est perfectionnée par nos nez expérimentés. Le résultat ? Des fragrances qui ne ressemblent à aucune autre, proposées en décants 50 ml de pur luxe minimaliste.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-light text-gray-900">Notre Engagement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="text-xl font-light text-gray-900">Qualité</h3>
                <p className="text-gray-600 font-light">
                  Nous n'utilisons que les matières premières les plus pures et les plus rares du monde.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-light text-gray-900">Transparence</h3>
                <p className="text-gray-600 font-light">
                  Chaque fragrance est documentée avec ses notes, ses ingrédients et son histoire.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-light text-gray-900">Durabilité</h3>
                <p className="text-gray-600 font-light">
                  Nous travaillons avec des fournisseurs éthiques et responsables.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-gray-200">
            <h2 className="text-4xl font-light text-gray-900">Les Nez Derrière la Magie</h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Nos maîtres parfumeurs sont les gardiens de la tradition olfactive française. Avec des décennies d'expérience combinées, ils créent des fragrances qui transcendent le temps et les tendances.
            </p>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Chacun apporte sa propre perspective, ses propres influences, ses propres rêves olfactifs. Ensemble, ils forment le cœur créatif de Matière Première.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-light text-gray-900">Découvrez Notre Collection</h2>
          <p className="text-lg text-gray-600 font-light">
            Explorez nos fragrances exceptionnelles et trouvez votre matière première préférée.
          </p>
          <Link href="/products">
            <Button className="gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-base">
              Voir le Catalogue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
