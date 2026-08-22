import { Link } from "wouter";

const SOCIAL_NETWORKS = ["Instagram", "Facebook", "Snapchat"] as const;

const footerLinkClass = "transition hover:text-gray-900 dark:hover:text-[#fff8ec]";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-4 py-12 dark:border-[#40382e] dark:bg-[#1b1712]">
      <div className="container">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-light text-gray-900 dark:text-[#fff8ec]">À Propos</h3>
            <ul className="space-y-2 text-sm font-light text-gray-600 dark:text-[#b9ae9b]">
              <li><Link href="/about" className={footerLinkClass}>Notre Histoire</Link></li>
              <li><Link href="/about" className={footerLinkClass}>Notre Philosophie</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-light text-gray-900 dark:text-[#fff8ec]">Support</h3>
            <ul className="space-y-2 text-sm font-light text-gray-600 dark:text-[#b9ae9b]">
              <li><Link href="/faq" className={footerLinkClass}>FAQ</Link></li>
              <li><Link href="/contact" className={footerLinkClass}>Contact</Link></li>
              <li><Link href="/livraison-retours" className={footerLinkClass}>Livraison et retours</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-light text-gray-900 dark:text-[#fff8ec]">Légal</h3>
            <ul className="space-y-2 text-sm font-light text-gray-600 dark:text-[#b9ae9b]">
              <li><Link href="/terms" className={footerLinkClass}>Conditions</Link></li>
              <li><Link href="/privacy" className={footerLinkClass}>Confidentialité</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-light text-gray-900 dark:text-[#fff8ec]">Suivez-nous</h3>
            <ul className="space-y-2 text-sm font-light text-gray-600 dark:text-[#b9ae9b]">
              {SOCIAL_NETWORKS.map((network) => <li key={network}><a href="#" className={footerLinkClass}>{network}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600 dark:border-[#40382e] dark:text-[#b9ae9b]">
          <p>© 2026 Matière Première. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
