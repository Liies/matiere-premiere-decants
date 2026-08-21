import { Link, useLocation } from "wouter";
import { Leaf, ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const PRIMARY_NAVIGATION = [
  { href: "/", label: "Accueil" },
  { href: "/products", label: "Catalogue" },
  { href: "/about", label: "À propos" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

const desktopNavigationLinkClass = (active: boolean) => `relative inline-flex min-h-11 items-center text-sm transition-colors duration-200 after:absolute after:bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:rounded-full after:bg-[#756a58] after:transition-transform after:duration-500 after:[transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-reduce:after:transition-none ${
  active
    ? "font-medium text-gray-900 after:scale-x-100 after:shadow-[0_1px_8px_rgba(117,106,88,0.38)]"
    : "text-gray-600 after:scale-x-0 hover:text-gray-900 hover:after:scale-x-100 hover:after:bg-gray-300"
}`;

const mobileNavigationLinkClass = (active: boolean) => `relative flex min-h-11 items-center overflow-hidden rounded-lg px-3 text-sm transition-colors duration-200 before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:origin-center before:rounded-full before:bg-[#756a58] before:transition-transform before:duration-500 before:[transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-reduce:before:transition-none ${
  active
    ? "bg-[#f1eee7] font-medium text-gray-900 before:scale-y-100 before:shadow-[0_0_8px_rgba(117,106,88,0.34)]"
    : "text-gray-600 before:scale-y-0 hover:bg-gray-50 hover:text-gray-900"
}`;

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
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {PRIMARY_NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={desktopNavigationLinkClass(isActive(item.href))}
            >
              {item.label}
            </Link>
          ))}
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
          <Link
            href="/wishlist"
            aria-label="Ouvrir la liste de souhaits"
            className="hidden h-11 w-11 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-red-500 sm:flex"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
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
            {PRIMARY_NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={mobileNavigationLinkClass(isActive(item.href))}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/wishlist" onClick={closeMobileMenu} className="flex min-h-11 items-center rounded-lg px-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-red-500">
              Liste de souhaits
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
