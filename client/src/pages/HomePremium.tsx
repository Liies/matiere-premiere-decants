import { lazy, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const ScentQuizDialog = lazy(() => import("@/components/ScentQuizDialog"));

export const HOME_COLLECTION_EDITORIAL_IMAGE = "/manus-storage/matiere-premiere-collection-hero_6296f243.png";

export default function HomePremium() {
  const [isScentQuizOpen, setIsScentQuizOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="relative overflow-hidden px-4 py-14 sm:py-16 md:py-20">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/mp-story-hero-88whgjPV3o5cgctoSVF89Q.webp"
              alt=""
              className="h-full w-full object-cover opacity-30"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/35 via-white/40 to-white/90" aria-hidden="true" />

          <div className="container relative z-10 mx-auto max-w-3xl text-center">
            <p className="hero-copy-reveal text-xs font-medium uppercase tracking-[0.24em] text-gray-600" style={{ animationDelay: "80ms" }}>Matière Première</p>
            <h1 className="hero-copy-reveal mt-5 text-4xl font-light leading-tight tracking-tight text-gray-900 sm:text-6xl" style={{ animationDelay: "160ms" }}>
              La matière au cœur du parfum.
            </h1>
            <p className="hero-copy-reveal mx-auto mt-5 max-w-xl text-base font-light leading-7 text-gray-600 sm:text-lg" style={{ animationDelay: "240ms" }}>
              Une sélection de décants 50 ml, au prix unique de 120,00 €.
            </p>
            <div className="hero-copy-reveal mt-8" style={{ animationDelay: "320ms" }}>
              <Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-gray-900 px-7 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-gray-800">
                Découvrir la collection
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div data-testid="home-offer-reassurance" className="hero-copy-reveal mx-auto mt-8 grid max-w-xl grid-cols-1 divide-y divide-gray-200/80 rounded-2xl border border-white/80 bg-white/65 text-left shadow-sm backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0" style={{ animationDelay: "400ms" }}>
              <p className="px-4 py-3 text-xs leading-5 text-gray-600"><span className="block font-medium uppercase tracking-[0.14em] text-gray-900">Format</span>Décant 50 ml</p>
              <p className="px-4 py-3 text-xs leading-5 text-gray-600"><span className="block font-medium uppercase tracking-[0.14em] text-gray-900">Prix</span>120,00 €</p>
              <p className="px-4 py-3 text-xs leading-5 text-gray-600"><span className="block font-medium uppercase tracking-[0.14em] text-gray-900">Expédition</span>France & Europe</p>
            </div>
          </div>
        </section>

        <section className="bg-stone-50 px-4 py-14 sm:py-20">
          <div className="container mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">La collection</p>
              <h2 className="mt-4 text-3xl font-light leading-tight text-gray-900 sm:text-5xl">Dix signatures à explorer.</h2>
              <p className="mt-5 max-w-md text-base font-light leading-7 text-gray-600">
                Chaque fragrance révèle une matière première dans une composition précise et contemporaine.
              </p>
              <Link href="/products" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 transition hover:decoration-gray-900">
                Voir les 10 parfums
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_rgba(38,29,21,0.10)]">
              <img
                src={HOME_COLLECTION_EDITORIAL_IMAGE}
                alt="Six flacons Matière Première présentés sur des socles minéraux"
                className="aspect-[66/85] w-full object-contain"
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-900 px-4 py-14 text-white sm:py-20">
          <div className="container mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Un doute ?</p>
            <h2 className="mt-4 text-3xl font-light sm:text-4xl">Trouvez votre parfum.</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-6 text-gray-300 sm:text-base">
              Quelques questions suffisent pour orienter votre découverte.
            </p>
            <Button type="button" onClick={() => setIsScentQuizOpen(true)} className="mt-7 min-h-11 gap-2 bg-white px-6 text-sm text-gray-900 hover:bg-gray-100">
              Commencer l’Exploration
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      {isScentQuizOpen ? (
        <Suspense fallback={null}>
          <ScentQuizDialog open={isScentQuizOpen} onOpenChange={setIsScentQuizOpen} />
        </Suspense>
      ) : null}
    </div>
  );
}
