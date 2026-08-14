import { useEffect } from "react";
import { DEFAULT_SITE_NAME, DEFAULT_SITE_URL } from "@shared/seo";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: object | object[];
}

export function useSEO({ title, description, canonical, ogImage, noIndex, jsonLd }: SEOProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const createdElements: HTMLElement[] = [];

    const setOrCreateMeta = (attrName: string, attrValue: string, content: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
        createdElements.push(el);
      }
      el.setAttribute("content", content);
    };

    setOrCreateMeta("name", "description", description);
    setOrCreateMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

    setOrCreateMeta("property", "og:title", title);
    setOrCreateMeta("property", "og:description", description);
    const resolvedUrl = canonical || window.location.href;
    setOrCreateMeta("property", "og:url", resolvedUrl);
    setOrCreateMeta("property", "og:site_name", DEFAULT_SITE_NAME);
    if (ogImage) {
      setOrCreateMeta("property", "og:image", ogImage);
    }

    setOrCreateMeta("name", "twitter:card", "summary_large_image");
    setOrCreateMeta("name", "twitter:title", title);
    setOrCreateMeta("name", "twitter:description", description);
    if (ogImage) {
      setOrCreateMeta("name", "twitter:image", ogImage);
    }

    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    let createdCanonical = false;
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
      createdCanonical = true;
    }
    const previousCanonical = linkCanonical.getAttribute("href");
    linkCanonical.setAttribute("href", canonical || window.location.origin + window.location.pathname);

    let scriptLdJson: HTMLScriptElement | null = null;
    let createdLdJson = false;
    if (jsonLd) {
      scriptLdJson = document.createElement("script");
      scriptLdJson.setAttribute("type", "application/ld+json");
      scriptLdJson.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(scriptLdJson);
      createdLdJson = true;
    }

    return () => {
      document.title = previousTitle;
      for (const el of createdElements) {
        el.remove();
      }
      if (createdCanonical && previousCanonical) {
        linkCanonical.setAttribute("href", previousCanonical);
      } else if (createdCanonical) {
        linkCanonical.remove();
      }
      if (createdLdJson && scriptLdJson) {
        scriptLdJson.remove();
      }
    };
  }, [title, description, canonical, ogImage, noIndex, jsonLd]);
}
