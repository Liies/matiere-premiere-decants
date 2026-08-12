import { Link, useLocation } from "wouter";
import { Leaf, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { OLFACTORY_FILTERS } from "@shared/olfactory";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
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
          <div
            className="relative"
            onMouseEnter={() => setCategoryMenuOpen(true)}
            onMouseLeave={() => setCategoryMenuOpen(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setCategoryMenuOpen(false);
              }
            }}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={categoryMenuOpen}
              aria-controls="perfume-categories-menu"
              onClick={() => setCategoryMenuOpen((isOpen) => !isOpen)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setCategoryMenuOpen(false);
              }}
              className={`flex min-h-11 items-center gap-1 text-sm transition ${
                categoryMenuOpen || isActive("/products") ? "font-medium text-gray-900" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Par familles
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${categoryMenuOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <div
              id="perfume-categories-menu"
              role="menu"
              aria-label="Familles olfactives"
              className={`absolute left-1/2 top-full z-50 mt-2 w-80 -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-900/10 transition-all duration-300 ease-out motion-reduce:transition-none ${
                categoryMenuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
              }`}
            >
              <p className="px-3 pb-2 pt-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-gray-400">
                Explorer par notes
              </p>
              <div className="grid grid-cols-2 gap-1">
                {OLFACTORY_FILTERS.map((filter, index) => (
                  <Link
                    key={filter.id}
                    href={`/products#${filter.id}`}
                    role="menuitem"
                    onClick={() => setCategoryMenuOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm transition-all duration-300 hover:bg-gray-50 hover:text-gray-900 motion-reduce:transition-none ${
                      categoryMenuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    }`}
                    style={{ transitionDelay: categoryMenuOpen ? `${80 + index * 35}ms` : "0ms" }}
                  >
                    <span className="block font-medium text-gray-800">{filter.label}</span>
                    <span className="mt-0.5 block text-xs text-gray-400">{filter.terms[0]}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
            <div className="rounded-lg">
              <button
                type="button"
                onClick={() => setMobileCategoriesOpen((isOpen) => !isOpen)}
                aria-expanded={mobileCategoriesOpen}
                aria-controls="mobile-perfume-categories"
                className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                Par familles
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileCategoriesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              <div
                id="mobile-perfume-categories"
                className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  mobileCategoriesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0">
                  <div className="grid grid-cols-2 gap-1 px-3 pb-2 pt-1">
                    {OLFACTORY_FILTERS.map((filter, index) => (
                      <Link
                        key={filter.id}
                        href={`/products#${filter.id}`}
                        onClick={closeMobileMenu}
                        className={`rounded-md px-2 py-2 text-xs text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-gray-900 motion-reduce:transition-none ${
                          mobileCategoriesOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                        }`}
                        style={{ transitionDelay: mobileCategoriesOpen ? `${index * 30}ms` : "0ms" }}
                      >
                        {filter.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
