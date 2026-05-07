import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Leaf } from "lucide-react";
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
      <section className="flex-1 flex items-center justify-center py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={imageAssets.heroBackground.compressed}
            alt="Matière Première"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
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

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4">
        <div className="container text-center text-sm text-gray-600">
          <p>© 2026 Matière Première. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
