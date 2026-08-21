import { Link } from "wouter";

const SOCIAL_NETWORKS = ["Instagram", "Facebook", "Snapchat"] as const;

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-12 px-4 bg-gray-50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-light text-gray-900 mb-4">À Propos</h3>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li>
                <Link href="/about" className="hover:text-gray-900 transition">
                  Notre Histoire
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gray-900 transition">
                  Notre Philosophie
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-light text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li>
                <Link href="/faq" className="hover:text-gray-900 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/livraison-retours" className="hover:text-gray-900 transition">
                  Livraison et retours
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-light text-gray-900 mb-4">Légal</h3>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li>
                <Link href="/terms" className="hover:text-gray-900 transition">
                  Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-900 transition">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-light text-gray-900 mb-4">Suivez-nous</h3>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              {SOCIAL_NETWORKS.map((network) => (
                <li key={network}>
                  <a href="#" className="hover:text-gray-900 transition">
                    {network}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>© 2026 Matière Première. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
