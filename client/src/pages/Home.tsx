import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Leaf, Sparkles, Droplet, Package } from "lucide-react";
import { imageAssets } from "@shared/image-assets";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-gray-900" />
            <h1 className="text-2xl font-light tracking-wider text-gray-900">
              Matière Première
            </h1>
          </div>
          <nav className="flex items-center gap-8">
            <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Catalogue
            </Link>
            <Link href="/cart" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Panier
            </Link>
            {isAuthenticated && (
              <Link href="/account" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Compte
              </Link>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Admin
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="absolute inset-0 -z-10">
          <img
            src={imageAssets.heroBackground.compressed}
            alt="Matière Première"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900">
              Décants de Luxe
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Explorez notre collection exclusive de parfums Matière Première en décants 50ml.
              Chaque fragrance célèbre la pureté d'une seule matière première.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-gray-500 text-sm uppercase tracking-widest">
              Fondée en 2016 • Entre Paris et Grasse
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-base">
                  Découvrir la Collection
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-widest text-gray-600">Matières Premières</p>
              <p className="text-gray-900 font-light">Pureté et authenticité</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-widest text-gray-600">Décants 50ml</p>
              <p className="text-gray-900 font-light">Format voyage luxe</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-widest text-gray-600">Livraison</p>
              <p className="text-gray-900 font-light">Partout en Europe</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Gallery Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light text-gray-900 mb-4">Notre Collection</h3>
            <p className="text-gray-600 font-light">Découvrez l'élégance minimaliste de Matière Première</p>
          </div>

          {/* Large image grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Main large image */}
            <div className="md:row-span-2 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/hero-luxury-1-QzwKrLcDc7QF9UyfdGGhyT.webp"
                alt="Collection Matière Première"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Top right image */}
            <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/hero-luxury-2-RyhmHKpHaMuFNsagsmypsz.webp"
                alt="Parfums avec fleurs"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Bottom right grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/hero-luxury-3-c5wpduqUCdxQ9ra353ZRKD.webp"
                  alt="Collection de parfums"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663634453748/oKjLk7qKw3XzkAh8kgeZU3/hero-luxury-4-UHcjw8sBNpq5xTEggAkuFx.webp"
                  alt="Parfum élégant"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Matière Première Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light text-gray-900 mb-4">Pourquoi Matière Première</h3>
            <p className="text-gray-600 font-light">L'excellence à travers la pureté</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gray-900" />
                </div>
              </div>
              <h4 className="text-xl font-light text-gray-900">Pureté Absolue</h4>
              <p className="text-gray-600 font-light">
                Chaque parfum célèbre une seule matière première, sans compromis sur la qualité.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Droplet className="w-8 h-8 text-gray-900" />
                </div>
              </div>
              <h4 className="text-xl font-light text-gray-900">Format Voyage</h4>
              <p className="text-gray-600 font-light">
                Décants 50ml parfaits pour découvrir ou emporter vos fragrances préférées.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-900" />
                </div>
              </div>
              <h4 className="text-xl font-light text-gray-900">Emballage Luxe</h4>
              <p className="text-gray-600 font-light">
                Chaque commande est préparée avec soin dans un emballage élégant et minimaliste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-2xl mx-auto text-center space-y-8">
          <h3 className="text-4xl font-light text-gray-900">Prêt à explorer ?</h3>
          <p className="text-lg text-gray-600 font-light">
            Découvrez notre sélection complète de parfums Matière Première et trouvez votre fragrance signature.
          </p>
          <Link href="/products">
            <Button className="gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-base">
              Voir le Catalogue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 bg-gray-50">
        <div className="container text-center text-sm text-gray-600">
          <p>© 2026 Matière Première. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
