import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { MASTER_PERFUMER_PROFILE } from "@shared/perfumer-profile";

export default function About() {
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

          <div data-testid="about-perfumer-profile" className="space-y-8 pt-8 border-t border-gray-200">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Le geste créatif</p>
              <h2 className="mt-3 text-4xl font-light text-gray-900">Le parfumeur derrière la maison</h2>
              <p className="mt-4 text-lg font-light leading-relaxed text-gray-600">
                Une écriture de parfum commence ici par la matière : son relief, son origine et la façon dont elle se révèle sur la peau.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
              <article className="border-t border-gray-300 pt-7">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">01 — Matière Première</p>
                <h3 className="mt-5 text-3xl font-light text-gray-900">{MASTER_PERFUMER_PROFILE.name}</h3>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-gray-500">{MASTER_PERFUMER_PROFILE.role}</p>
                <p className="mt-6 max-w-md text-base font-light leading-7 text-gray-600">{MASTER_PERFUMER_PROFILE.biography}</p>

                <div className="mt-8 border-l border-gray-300 pl-5">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">Créations au sein de la maison</p>
                  <p className="mt-3 text-lg font-light leading-8 text-gray-900">
                    {MASTER_PERFUMER_PROFILE.matierePremiereCreations.join(" · ")}
                  </p>
                </div>
              </article>

              <article className="border-t border-gray-300 pt-7">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">02 — Repères de création</p>
                <p className="mt-5 max-w-lg text-base font-light leading-7 text-gray-600">
                  Son parcours a également contribué à des créations pour plusieurs signatures de la parfumerie contemporaine.
                </p>
                <ul className="mt-8 grid grid-cols-1 border-t border-gray-200 sm:grid-cols-2" aria-label="Créations externes d’Aurélien Guichard">
                  {MASTER_PERFUMER_PROFILE.externalCreations.map((creation, index) => (
                    <li
                      key={`${creation.house}-${creation.name}`}
                      className={`py-5 ${index % 2 === 0 ? "sm:border-r sm:pr-6" : "sm:pl-6"} ${index < 2 ? "border-b border-gray-200" : ""}`}
                    >
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">{creation.house}</p>
                      <p className="mt-2 text-xl font-light text-gray-900">{creation.name}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-xs leading-5 text-gray-500">
                  Sources : {" "}
                  <a href={MASTER_PERFUMER_PROFILE.sources.official} target="_blank" rel="noreferrer" className="underline decoration-gray-300 underline-offset-4 transition-colors hover:text-gray-900">
                    Matière Première
                  </a>{" "}
                  et {" "}
                  <a href={MASTER_PERFUMER_PROFILE.sources.interview} target="_blank" rel="noreferrer" className="underline decoration-gray-300 underline-offset-4 transition-colors hover:text-gray-900">
                    entretien avec Aurélien Guichard
                  </a>.
                </p>
              </article>
            </div>
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
