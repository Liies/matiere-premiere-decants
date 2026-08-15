import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight, Clock3, PackageCheck, RotateCcw, Truck } from "lucide-react";

const deliveryOptions = [
  {
    destination: "France métropolitaine",
    price: "4,95 €",
    freeFrom: "Offerte dès 80,00 €",
    timing: "2 à 3 jours ouvrés",
    carrier: "Colissimo",
  },
  {
    destination: "Europe",
    price: "9,95 €",
    freeFrom: "Offerte dès 150,00 €",
    timing: "4 à 7 jours ouvrés",
    carrier: "Colissimo Europe",
  },
];

export default function DeliveryReturns() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container py-10 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <header className="border-b border-gray-200 pb-10 sm:pb-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Informations pratiques</p>
            <h1 className="mt-4 text-4xl font-light tracking-tight text-gray-900 sm:text-5xl">Livraison et retours</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Retrouvez les modalités d’expédition de votre décant de 50 ml, ainsi que les étapes à suivre pour exercer votre droit de rétractation.
            </p>
          </header>

          <section aria-labelledby="delivery-title" className="py-12 sm:py-16">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-gray-800"><Truck className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <h2 id="delivery-title" className="text-2xl font-light text-gray-900 sm:text-3xl">Expédition</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">Nous livrons actuellement en France métropolitaine et dans les destinations européennes proposées au moment de la commande. Le coût et l’éventuelle gratuité sont recalculés avant la validation du paiement.</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {deliveryOptions.map((option) => (
                <article key={option.destination} className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">{option.destination}</p>
                  <p className="mt-4 text-3xl font-light text-gray-900">{option.price}</p>
                  <p className="mt-1 text-sm font-medium text-emerald-700">{option.freeFrom}</p>
                  <dl className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-sm text-gray-600">
                    <div className="flex items-center justify-between gap-4"><dt>Délai indicatif</dt><dd className="font-medium text-gray-900">{option.timing}</dd></div>
                    <div className="flex items-center justify-between gap-4"><dt>Transporteur</dt><dd className="font-medium text-gray-900">{option.carrier}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="withdrawal-title" className="border-t border-gray-200 py-12 sm:py-16">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-gray-800"><RotateCcw className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <h2 id="withdrawal-title" className="text-2xl font-light text-gray-900 sm:text-3xl">Droit de rétractation</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">Pour un achat à distance, vous disposez d’un délai légal de 14 jours calendaires à compter de la réception du bien pour nous notifier votre décision, sans avoir à la justifier.[1] [2]</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl bg-stone-50 p-6"><p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">1 — Nous écrire</p><p className="mt-3 text-sm leading-6 text-gray-700">Envoyez une déclaration sans ambiguïté à <a className="font-medium text-gray-900 underline underline-offset-4" href="mailto:lies.haouas@gmail.com">lies.haouas@gmail.com</a>, en précisant votre numéro de commande.</p></article>
              <article className="rounded-2xl bg-stone-50 p-6"><p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">2 — Retourner</p><p className="mt-3 text-sm leading-6 text-gray-700">Après notification, retournez le produit au plus tard dans les 14 jours. Les frais directs de renvoi sont à votre charge, sauf erreur de notre part.[1] [2]</p></article>
              <article className="rounded-2xl bg-stone-50 p-6"><p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">3 — Être remboursé</p><p className="mt-3 text-sm leading-6 text-gray-700">Le remboursement intervient via le moyen de paiement initial, au plus tard dans les 14 jours suivant votre notification, sous réserve de réception ou d’une preuve d’expédition.[1] [2]</p></article>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-sm leading-6 text-amber-950">
              Pour préserver l’hygiène et l’intégrité des produits, contactez-nous avant tout envoi. Les produits descellés, utilisés ou dont l’emballage de protection a été ouvert peuvent relever des exceptions prévues par la loi, notamment pour des raisons d’hygiène ou de protection de la santé.[1]
            </div>
          </section>

          <section aria-labelledby="contact-title" className="border-t border-gray-200 py-12 sm:py-16">
            <div className="rounded-2xl bg-gray-900 px-6 py-8 text-white sm:px-8">
              <PackageCheck className="h-6 w-6 text-stone-300" aria-hidden="true" />
              <h2 id="contact-title" className="mt-4 text-2xl font-light">Besoin d’aide avant ou après votre commande&nbsp;?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">Écrivez-nous à lies.haouas@gmail.com. Nous vous confirmerons les modalités utiles à votre situation, notamment l’adresse de retour lorsqu’elle est nécessaire.</p>
              <Link href="/contact" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-100">Nous contacter <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </section>

          <section aria-labelledby="sources-title" className="border-t border-gray-200 pt-8 text-xs leading-5 text-gray-500">
            <div className="flex items-center gap-2 text-gray-700"><Clock3 className="h-4 w-4" aria-hidden="true" /><h2 id="sources-title" className="font-medium">Références</h2></div>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li><a className="underline underline-offset-2 hover:text-gray-900" href="https://www.service-public.gouv.fr/particuliers/vosdroits/F10485" target="_blank" rel="noreferrer">Service Public — Achat à distance : droit de rétractation du consommateur</a>.</li>
              <li><a className="underline underline-offset-2 hover:text-gray-900" href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221365/" target="_blank" rel="noreferrer">Code de la consommation, articles L221-18 à L221-24</a>.</li>
            </ol>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
