import { Link, useLocation } from "wouter";
import { Leaf, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => location === path;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container flex items-center justify-between gap-3 py-3 sm:py-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <Leaf className="h-5 w-5 shrink-0 text-gray-900 sm:h-6 sm:w-6" />
            <h1 className="text-[0.95rem] font-light tracking-[0.12em] text-gray-900 sm:text-xl sm:tracking-wider">
              Matière Première
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm transition ${
              isActive("/") ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Accueil
          </Link>
          <Link
            href="/products"
            className={`text-sm transition ${
              isActive("/products") ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Catalogue
          </Link>
          <Link
            href="/about"
            className={`text-sm transition ${
              isActive("/about") ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            À Propos
          </Link>
          <Link
            href="/faq"
            className={`text-sm transition ${
              isActive("/faq") ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            FAQ
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <Link
            href="/cart"
            aria-label="Ouvrir le panier"
            className="flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href="/account"
                aria-label="Ouvrir mon compte"
                className="flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <User className="h-5 w-5" aria-hidden="true" />
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden min-h-11 items-center border border-gray-900 px-3 py-2 text-xs text-gray-900 transition hover:bg-gray-900 hover:text-white sm:flex"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="hidden min-h-11 items-center px-2 py-2 text-xs text-gray-600 transition hover:text-gray-900 sm:flex"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <a
              href={getLoginUrl()}
              className="hidden min-h-11 items-center border border-gray-900 px-3 py-2 text-xs text-gray-900 transition hover:bg-gray-900 hover:text-white sm:flex"
            >
              Connexion
            </a>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="border-t border-gray-200 bg-white md:hidden">
          <nav className="container space-y-1 py-3" aria-label="Navigation mobile">
            <Link href="/" onClick={closeMobileMenu} className="flex min-h-11 items-center rounded-lg px-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
              Accueil
            </Link>
            <Link href="/products" onClick={closeMobileMenu} className="flex min-h-11 items-center rounded-lg px-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
              Catalogue
            </Link>
            <Link href="/about" onClick={closeMobileMenu} className="flex min-h-11 items-center rounded-lg px-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
              À Propos
            </Link>
            <Link href="/faq" onClick={closeMobileMenu} className="flex min-h-11 items-center rounded-lg px-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
              FAQ
            </Link>
            <Link href="/contact" onClick={closeMobileMenu} className="flex min-h-11 items-center rounded-lg px-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
              Contact
            </Link>
            {isAuthenticated && (
              <Link href="/account" onClick={closeMobileMenu} className="flex min-h-11 items-center rounded-lg px-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
                Mon compte
              </Link>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin" onClick={closeMobileMenu} className="flex min-h-11 items-center rounded-lg px-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
                Administration
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
