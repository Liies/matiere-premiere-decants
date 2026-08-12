import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getNoseImage, getProductImage } from "@shared/image-assets";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function HomePremium() {
  const { user, isAuthenticated } = useAuth();
  const heroBottle = getProductImage(1);
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

  useEffect(() => {
    const targetId = window.location.hash.replace(/^#/, "").trim();
    if (!targetId) return;

    setVisibleSections((current) => ({ ...current, [targetId]: true }));

    const scrollToAnchor = () => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" });
    };

    const timer = window.setTimeout(scrollToAnchor, 50);
    return () => window.clearTimeout(timer);
  }, []);

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden px-4 py-20 sm:py-28 md:py-32">
        <div
          className="absolute inset-0 -z-10"
          style={{
            transform: `translate3d(0, ${Math.min(scrollY * 0.18, 80)}px, 0) scale(1.06)`,
          }}
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/mp-story-hero-88whgjPV3o5cgctoSVF89Q.webp"
            alt="Matière Première"
            className="h-full w-full object-cover opacity-35 will-change-transform"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/85" aria-hidden="true" />
        <span className="luxury-orb luxury-orb-one" aria-hidden="true" />
        <span className="luxury-orb luxury-orb-two" aria-hidden="true" />

        {heroBottle && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-0 flex justify-center sm:bottom-0" aria-hidden="true">
            <div className="hero-bottle-reveal relative h-56 w-44 sm:h-72 sm:w-56 md:h-80 md:w-64">
              <span className="hero-bottle-halo" />
              <img
                src={heroBottle.compressed}
                alt=""
                className="relative z-10 h-full w-full object-contain drop-shadow-[0_24px_30px_rgba(17,24,39,0.14)]"
              />
            </div>
          </div>
        )}

        <div className="container relative z-10 mx-auto max-w-4xl space-y-8 text-center">
          <div className="space-y-6">
            <p className="hero-copy-reveal text-sm uppercase tracking-[0.24em] text-gray-600" style={{ animationDelay: "80ms" }}>Bienvenue chez</p>
            <h1 className="hero-copy-reveal text-4xl font-light leading-tight tracking-tight text-gray-900 sm:text-6xl md:text-7xl" style={{ animationDelay: "180ms" }}>
              Matière Première
            </h1>
            <p className="hero-copy-reveal text-xl font-light text-gray-700 sm:text-2xl" style={{ animationDelay: "300ms" }}>
              L'essence pure de la parfumerie
            </p>
          </div>

          <div className="hero-copy-reveal pt-8" style={{ animationDelay: "420ms" }}>
            <p className="mx-auto mb-8 max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base">
              Découvrez une collection exclusive de décants 50ml, où chaque fragrance célèbre la pureté d'une seule matière première.
            </p>
            <Link href="/products">
              <Button className="min-h-12 gap-2 bg-gray-900 px-8 py-6 text-base text-white shadow-lg shadow-gray-900/10 transition-transform hover:-translate-y-0.5 hover:bg-gray-800">
                Explorer la Collection
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex justify-center text-gray-500" aria-hidden="true">
            <span className="h-12 w-px animate-pulse-subtle bg-gray-400" />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section
        ref={setRef("story")}
        id="story"
        className={`bg-gray-50 px-4 py-20 transition-all duration-1000 sm:py-32 ${
          visibleSections["story"] ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
            <div
              className={`space-y-6 transition-all duration-1000 ${
                visibleSections["story"] ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <p className="text-sm uppercase tracking-widest text-gray-600">Notre Histoire</p>
              <h2 className="text-3xl font-light text-gray-900 sm:text-5xl">
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
              className={`luxury-image-frame group transition-all duration-1000 ${
                visibleSections["story"] ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/mp-history-EUBK4GLMuWtze4obx7Syvj.webp"
                alt="L'histoire de Matière Première"
                className="h-auto w-full rounded-lg shadow-lg transition-transform duration-1000 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section
        ref={setRef("ingredients")}
        id="ingredients"
        className={`bg-white px-4 py-20 transition-all duration-1000 sm:py-32 ${
          visibleSections["ingredients"] ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
            <div
              className={`luxury-image-frame group transition-all duration-1000 ${
                visibleSections["ingredients"] ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/mp-ingredients-W6x6mGy9Xy9zMzRqyytYqp.webp"
                alt="Matières premières luxe"
                className="h-auto w-full rounded-lg shadow-lg transition-transform duration-1000 group-hover:scale-[1.02]"
              />
            </div>

            <div
              className={`space-y-6 transition-all duration-1000 ${
                visibleSections["ingredients"] ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}
            >
              <p className="text-sm uppercase tracking-widest text-gray-600">L'Essence de Luxe</p>
              <h2 className="text-3xl font-light text-gray-900 sm:text-5xl">
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

      {/* Craft Section */}
      <section
        ref={setRef("craft")}
        id="craft"
        className={`bg-stone-50 px-4 py-20 transition-all duration-1000 sm:py-32 ${
          visibleSections["craft"] ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid items-end gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
            <div
              className={`transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                visibleSections["craft"] ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <p className="mb-4 text-sm uppercase tracking-widest text-gray-600">Le savoir-faire</p>
              <h2 className="text-3xl font-light leading-tight text-gray-900 sm:text-5xl">
                De la matière
                <br />
                à l’émotion.
              </h2>
            </div>
            <p
              className={`max-w-xl text-base font-light leading-7 text-gray-600 transition-all duration-700 delay-100 ease-out motion-reduce:transform-none motion-reduce:transition-none sm:text-lg ${
                visibleSections["craft"] ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              Chaque décant est préparé avec le même respect du geste parfumier : une matière première choisie avec exigence, une composition précise, puis une expérience à découvrir à son rythme.
            </p>
          </div>

          <div className="mt-12 grid border-t border-gray-200 sm:mt-16 md:grid-cols-3">
            {[
              { number: "01", title: "Sélectionner", copy: "Chercher l’éclat singulier d’une matière et préserver son caractère." },
              { number: "02", title: "Composer", copy: "Construire autour d’elle une signature équilibrée, lisible et mémorable." },
              { number: "03", title: "Transmettre", copy: "Proposer un format de découverte pensé pour laisser parler la fragrance." },
            ].map((step, index) => (
              <article
                key={step.number}
                className={`border-b border-gray-200 py-8 transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0 ${
                  visibleSections["craft"] ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: visibleSections["craft"] ? `${180 + index * 130}ms` : "0ms" }}
              >
                <p className="mb-8 text-xs font-medium tracking-[0.2em] text-gray-400">{step.number}</p>
                <h3 className="mb-3 text-xl font-light text-gray-900">{step.title}</h3>
                <p className="max-w-xs text-sm leading-6 text-gray-600">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Master Noses Section */}
      <section
        ref={setRef("noses")}
        id="noses"
        className={`bg-gray-50 px-4 py-20 transition-all duration-1000 sm:py-32 ${
          visibleSections["noses"] ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-600 mb-4">Les Créateurs</p>
            <h2 className="text-3xl font-light text-gray-900 sm:text-5xl">
              Les Nez Derrière la Magie
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            {/* Nose 1 */}
            <div
              className={`group space-y-6 transition-all duration-1000 ${
                visibleSections["noses"] ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              {(() => {
                const image = getNoseImage(1);
                return image ? (
                  <img
                    src={image.compressed}
                    alt="Master Perfumer"
                    className="h-80 w-full rounded-lg object-cover shadow-lg transition-transform duration-1000 group-hover:scale-[1.02] sm:h-96"
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
              className={`group space-y-6 transition-all duration-1000 ${
                visibleSections["noses"] ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              {(() => {
                const image = getNoseImage(2);
                return image ? (
                  <img
                    src={image.compressed}
                    alt="Master Perfumer"
                    className="h-80 w-full rounded-lg object-cover shadow-lg transition-transform duration-1000 group-hover:scale-[1.02] sm:h-96"
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
        className={`bg-white px-4 py-20 transition-all duration-1000 sm:py-32 ${
          visibleSections["collection"] ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container max-w-5xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-gray-600 mb-4">La Collection</p>
                      <h2 className="mb-6 text-3xl font-light text-gray-900 sm:mb-8 sm:text-5xl">

            10 Fragrances Exceptionnelles
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-base font-light leading-7 text-gray-600 sm:mb-12 sm:text-xl">
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
      <section className="bg-gray-900 px-4 py-20 text-white sm:py-32">
        <div className="container max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-light sm:text-5xl">Prêt à découvrir ?</h2>
          <p className="text-base font-light leading-7 text-gray-300 sm:text-xl">
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
