import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { getOfficialFragranceVideo } from "@shared/official-fragrance-videos";

type OfficialFragranceVideoProps = {
  productName: string;
  productSlug: string | undefined;
};

export function OfficialFragranceVideo({ productName, productSlug }: OfficialFragranceVideoProps) {
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const video = getOfficialFragranceVideo(productSlug);

  if (!video) return null;

  return (
    <section
      data-testid="official-fragrance-video"
      className="mx-auto mt-16 max-w-5xl border-t border-stone-200 pt-12 sm:mt-20 sm:pt-16"
      aria-labelledby="official-video-title"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">Film officiel</p>
        <h2 id="official-video-title" className="mt-3 text-2xl font-light tracking-tight text-gray-900 sm:text-3xl">
          {productName}, en mouvement
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
          Découvrez la présentation publiée par Matière Première. Le lecteur est chargé uniquement à votre demande.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm">
        {isPlayerLoaded ? (
          <iframe
            title={video.title}
            src={video.embedUrl}
            className="aspect-[9/16] w-full border-0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlayerLoaded(true)}
            aria-label={`Lire le film officiel de ${productName}`}
            className="group relative flex aspect-[9/16] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700 px-8 text-center text-white transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-4 motion-reduce:transform-none"
          >
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(223,205,175,0.25),transparent_48%)]" aria-hidden="true" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/10 transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none" aria-hidden="true">
              <Play className="ml-1 h-6 w-6 fill-current" />
            </span>
            <span className="relative mt-5 text-xs font-medium uppercase tracking-[0.2em]">Lire le film officiel</span>
          </button>
        )}
      </div>

      <p className="mt-5 text-center text-xs text-stone-500">
        Publié par <span className="font-medium text-stone-700">@matierepremiereparfums</span> sur Instagram.
        <a
          href={video.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-2 inline-flex items-center gap-1 font-medium text-stone-700 underline-offset-4 hover:underline"
        >
          Ouvrir la publication officielle
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </p>
    </section>
  );
}
