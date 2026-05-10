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

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <Leaf className="w-6 h-6 text-gray-900" />
            <h1 className="text-xl font-light tracking-wider text-gray-900 hidden sm:block">
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
        <div className="flex items-center gap-4">
          <Link href="/cart" className="text-gray-600 hover:text-gray-900 transition">
            <ShoppingCart className="w-5 h-5" />
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/account" className="text-gray-600 hover:text-gray-900 transition">
                <User className="w-5 h-5" />
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-xs px-3 py-1 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="text-xs px-3 py-1 text-gray-600 hover:text-gray-900 transition"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <a
              href={getLoginUrl()}
              className="text-xs px-3 py-1 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
            >
              Connexion
            </a>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="container py-4 space-y-3">
            <Link href="/" className="block text-sm text-gray-600 hover:text-gray-900 transition">
              Accueil
            </Link>
            <Link href="/products" className="block text-sm text-gray-600 hover:text-gray-900 transition">
              Catalogue
            </Link>
            <Link href="/about" className="block text-sm text-gray-600 hover:text-gray-900 transition">
              À Propos
            </Link>
            <Link href="/faq" className="block text-sm text-gray-600 hover:text-gray-900 transition">
              FAQ
            </Link>
            <Link href="/contact" className="block text-sm text-gray-600 hover:text-gray-900 transition">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
