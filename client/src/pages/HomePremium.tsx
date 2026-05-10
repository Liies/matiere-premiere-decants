import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getNoseImage } from "@shared/image-assets";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function HomePremium() {
  const { user, isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/mp-story-hero-88whgjPV3o5cgctoSVF89Q.webp"
            alt="Matière Première"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6 animate-fade-in">
            <p className="text-sm uppercase tracking-widest text-gray-600">Bienvenue chez</p>
            <h1 className="text-6xl md:text-7xl font-light tracking-tight text-gray-900 leading-tight">
              Matière Première
            </h1>
            <p className="text-2xl font-light text-gray-700">
              L'essence pure de la parfumerie
            </p>
          </div>

          <div className="pt-8">
            <p className="text-gray-600 font-light mb-8">
              Découvrez une collection exclusive de décants 50ml, où chaque fragrance célèbre la pureté d'une seule matière première.
            </p>
            <Link href="/products">
              <Button className="gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-base">
                Explorer la Collection
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section
        ref={setRef("story")}
        id="story"
        className={`py-32 px-4 bg-gray-50 transition-all duration-1000 ${
          visibleSections["story"] ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div
              className={`space-y-6 transition-all duration-1000 ${
                visibleSections["story"] ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <p className="text-sm uppercase tracking-widest text-gray-600">Notre Histoire</p>
              <h2 className="text-5xl font-light text-gray-900">
                Fondée en 2016
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Entre Paris et Grasse, Matière Première a été créée avec une vision simple mais audacieuse : célébrer la pureté d'une seule matière première dans chaque fragrance.
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Chaque parfum raconte l'histoire d'une matière brute, transformée en une expérience olfactive exquisite par nos maîtres parfumeurs.
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                visibleSections["story"] ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/mp-history-EUBK4GLMuWtze4obx7Syvj.webp"
                alt="L'histoire de Matière Première"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section
        ref={setRef("ingredients")}
        id="ingredients"
        className={`py-32 px-4 bg-white transition-all duration-1000 ${
          visibleSections["ingredients"] ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div
              className={`transition-all duration-1000 ${
                visibleSections["ingredients"] ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/mp-ingredients-W6x6mGy9Xy9zMzRqyytYqp.webp"
                alt="Matières premières luxe"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            <div
              className={`space-y-6 transition-all duration-1000 ${
                visibleSections["ingredients"] ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}
            >
              <p className="text-sm uppercase tracking-widest text-gray-600">L'Essence de Luxe</p>
              <h2 className="text-5xl font-light text-gray-900">
                Matières Premières Exceptionnelles
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Chaque ingrédient est soigneusement sélectionné auprès des meilleures sources mondiales. De la vanille de Madagascar au safran de Grasse, nous ne travaillons qu'avec les matières premières les plus pures et les plus rares.
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                C'est cette obsession pour la qualité qui fait la différence. Chaque décant 50ml est une promesse de pureté absolue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Master Noses Section */}
      <section
        ref={setRef("noses")}
        id="noses"
        className={`py-32 px-4 bg-gray-50 transition-all duration-1000 ${
          visibleSections["noses"] ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-600 mb-4">Les Créateurs</p>
            <h2 className="text-5xl font-light text-gray-900">
              Les Nez Derrière la Magie
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Nose 1 */}
            <div
              className={`space-y-6 transition-all duration-1000 ${
                visibleSections["noses"] ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              {(() => {
                const image = getNoseImage(1);
                return image ? (
                  <img
                    src={image.compressed}
                    alt="Master Perfumer"
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg shadow-lg" />
                );
              })()}
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-2">
                  Maître Parfumeur I
                </h3>
                <p className="text-gray-600 font-light mb-4">
                  Avec plus de 25 ans d'expérience, ce maître parfumeur a créé certaines des fragrances les plus emblématiques de Matière Première.
                </p>
                <p className="text-gray-500 text-sm">
                  Spécialité : Notes florales et épicées
                </p>
              </div>
            </div>

            {/* Nose 2 */}
            <div
              className={`space-y-6 transition-all duration-1000 ${
                visibleSections["noses"] ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              {(() => {
                const image = getNoseImage(2);
                return image ? (
                  <img
                    src={image.compressed}
                    alt="Master Perfumer"
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg shadow-lg" />
                );
              })()}
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-2">
                  Maître Parfumeur II
                </h3>
                <p className="text-gray-600 font-light mb-4">
                  Innovatrice dans l'art de la parfumerie moderne, elle apporte une perspective unique et contemporaine à nos créations.
                </p>
                <p className="text-gray-500 text-sm">
                  Spécialité : Notes boisées et minérales
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Preview Section */}
      <section
        ref={setRef("collection")}
        id="collection"
        className={`py-32 px-4 bg-white transition-all duration-1000 ${
          visibleSections["collection"] ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container max-w-5xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-gray-600 mb-4">La Collection</p>
          <h2 className="text-5xl font-light text-gray-900 mb-8">
            10 Fragrances Exceptionnelles
          </h2>
          <p className="text-xl text-gray-600 font-light mb-12 max-w-2xl mx-auto">
            Chaque parfum Matière Première est une célébration de pureté. Découvrez notre sélection complète de décants 50ml, chacun racontant l'histoire d'une matière première unique.
          </p>

          <Link href="/products">
            <Button className="gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-base">
              Voir Tous les Parfums
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gray-900 text-white">
        <div className="container max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-light">Prêt à découvrir ?</h2>
          <p className="text-xl font-light text-gray-300">
            Explorez notre collection exclusive et trouvez votre fragrance signature.
          </p>
          <Link href="/products">
            <Button className="gap-2 bg-white hover:bg-gray-100 text-gray-900 px-8 py-6 text-base">
              Commencer l'Exploration
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
