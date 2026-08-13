import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHeroScrollBehavior, HERO_NEXT_SECTION_ID } from "@shared/home-hero";
import { MASTER_PERFUMER_PROFILE } from "@shared/perfumer-profile";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ScentQuizDialog from "@/components/ScentQuizDialog";

export const HOME_COLLECTION_EDITORIAL_IMAGE = "/manus-storage/matiere-premiere-ten-bottles-editorial_30095232.jpg";
export const HOME_STORY_ATELIER_IMAGE = "/manus-storage/matiere-premiere-atelier-origins-editorial_6e6945e3.jpg";

export default function HomePremium() {
  const { user, isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const [isScentQuizOpen, setIsScentQuizOpen] = useState(false);
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

  const scrollToStory = () => {
    const storySection = document.getElementById(HERO_NEXT_SECTION_ID);
    if (!storySection) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    storySection.scrollIntoView({
      behavior: getHeroScrollBehavior(prefersReducedMotion),
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-14 sm:py-16 md:py-20">
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

        <div className="container relative z-10 mx-auto max-w-4xl space-y-6 text-center sm:space-y-7">
          <div className="space-y-6">
            <p className="hero-copy-reveal text-sm uppercase tracking-[0.24em] text-gray-600" style={{ animationDelay: "80ms" }}>Bienvenue chez</p>
            <h1 className="hero-copy-reveal text-4xl font-light leading-tight tracking-tight text-gray-900 sm:text-6xl md:text-7xl" style={{ animationDelay: "180ms" }}>
              Matière Première
            </h1>
            <p className="hero-copy-reveal text-xl font-light text-gray-700 sm:text-2xl" style={{ animationDelay: "300ms" }}>
              L'essence pure de la parfumerie
            </p>
          </div>

          <div className="hero-copy-reveal pt-3 sm:pt-4" style={{ animationDelay: "420ms" }}>
            <p className="mx-auto mb-6 max-w-2xl text-sm font-light leading-7 text-gray-600 sm:text-base">
              Découvrez une collection exclusive de décants 50ml, où chaque fragrance célèbre la pureté d'une seule matière première.
            </p>
            <Button
              type="button"
              onClick={scrollToStory}
              className="min-h-12 gap-2 bg-gray-900 px-8 py-6 text-base text-white shadow-lg shadow-gray-900/10 transition-transform hover:-translate-y-0.5 hover:bg-gray-800"
            >
              Explorer la Collection
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="hero-copy-reveal mx-auto w-full max-w-[16rem] pt-0 sm:max-w-[22rem]" style={{ animationDelay: "560ms" }}>
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/25 p-2 shadow-[0_20px_60px_rgba(104,80,54,0.12)] backdrop-blur-sm">
              <img
                src={HOME_COLLECTION_EDITORIAL_IMAGE}
                alt="Dix flacons de la collection Matière Première, composition éditoriale"
                className="aspect-[4/5] w-full rounded-[1.1rem] object-cover brightness-[0.96] contrast-[1.12] saturate-[1.08]"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-2 rounded-[1.1rem] bg-gradient-to-t from-stone-900/15 via-transparent to-white/5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4 flex justify-center text-gray-500" aria-hidden="true">
            <span className="h-8 w-px animate-pulse-subtle bg-gray-400" />
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
                src={HOME_STORY_ATELIER_IMAGE}
                alt="Atelier de création de Matière Première, matières et flacons de parfum"
                className="aspect-[3/2] w-full rounded-lg object-cover shadow-lg transition-transform duration-1000 group-hover:scale-[1.02]"
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

      {/* Perfumer Section */}
      <section
        ref={setRef("noses")}
        id="noses"
        className={`bg-gray-50 px-4 py-20 transition-all duration-1000 sm:py-32 ${
          visibleSections["noses"] ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm uppercase tracking-widest text-gray-600">Le Créateur</p>
            <h2 className="text-3xl font-light text-gray-900 sm:text-5xl">
              Une signature, de la matière à l’émotion.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
            <div
              className={`border-t border-gray-300 pt-8 transition-all duration-1000 motion-reduce:transform-none motion-reduce:transition-none ${
                visibleSections["noses"] ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-gray-400">01 — Matière Première</p>
              <h3 className="mb-3 text-3xl font-light text-gray-900">{MASTER_PERFUMER_PROFILE.name}</h3>
              <p className="mb-6 text-sm uppercase tracking-[0.14em] text-gray-500">{MASTER_PERFUMER_PROFILE.role}</p>
              <p className="max-w-md text-base font-light leading-7 text-gray-600">{MASTER_PERFUMER_PROFILE.biography}</p>
              <div className="mt-8 border-l border-gray-300 pl-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-gray-500">Créations au sein de la maison</p>
                <p className="text-lg font-light leading-8 text-gray-900">{MASTER_PERFUMER_PROFILE.matierePremiereCreations.join(" · ")}</p>
              </div>
            </div>

            <div
              className={`border-t border-gray-300 pt-8 transition-all duration-1000 delay-100 motion-reduce:transform-none motion-reduce:transition-none ${
                visibleSections["noses"] ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-gray-400">02 — Repères de création</p>
              <p className="max-w-lg text-base font-light leading-7 text-gray-600">
                En parallèle de la maison, son parcours a contribué à des créations pour plusieurs grandes signatures de la parfumerie contemporaine.
              </p>
              <div className="mt-8 grid grid-cols-1 border-t border-gray-200 sm:grid-cols-2">
                {MASTER_PERFUMER_PROFILE.externalCreations.map((creation, index) => (
                  <div
                    key={`${creation.house}-${creation.name}`}
                    className={`py-5 ${index % 2 === 0 ? "sm:border-r sm:pr-6" : "sm:pl-6"} ${index < 2 ? "border-b border-gray-200" : ""}`}
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">{creation.house}</p>
                    <p className="mt-2 text-xl font-light text-gray-900">{creation.name}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs leading-5 text-gray-500">
                Sources :{" "}
                <a href={MASTER_PERFUMER_PROFILE.sources.official} target="_blank" rel="noreferrer" className="underline decoration-gray-300 underline-offset-4 transition-colors hover:text-gray-900">
                  Matière Première
                </a>{" "}
                et{" "}
                <a href={MASTER_PERFUMER_PROFILE.sources.interview} target="_blank" rel="noreferrer" className="underline decoration-gray-300 underline-offset-4 transition-colors hover:text-gray-900">
                  entretien avec Aurélien Guichard
                </a>.
              </p>
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
          <Button type="button" onClick={() => setIsScentQuizOpen(true)} className="gap-2 bg-white px-8 py-6 text-base text-gray-900 hover:bg-gray-100">
            Commencer l'Exploration
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <Footer />
      <ScentQuizDialog open={isScentQuizOpen} onOpenChange={setIsScentQuizOpen} />
    </div>
  );
}
