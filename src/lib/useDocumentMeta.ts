import { useEffect, useRef } from 'react';

const SITE_ORIGIN = 'https://drumforge.app';

export interface DocumentMeta {
  title: string;
  description: string;
  /** Site-relative path. Becomes `og:url` + `<link rel="canonical">`. */
  path: string;
}

interface Snapshot {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  canonical: string;
}

type MetaAttr = 'name' | 'property';

function getMeta(attr: MetaAttr, key: string): string {
  return (
    document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.content ?? ''
  );
}

function setMeta(attr: MetaAttr, key: string, value: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

function getLinkHref(rel: string): string {
  return document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)?.href ?? '';
}

function setLinkHref(rel: string, value: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = value;
}

function snapshotHead(): Snapshot {
  return {
    title: document.title,
    description: getMeta('name', 'description'),
    ogTitle: getMeta('property', 'og:title'),
    ogDescription: getMeta('property', 'og:description'),
    ogUrl: getMeta('property', 'og:url'),
    twitterTitle: getMeta('name', 'twitter:title'),
    twitterDescription: getMeta('name', 'twitter:description'),
    canonical: getLinkHref('canonical'),
  };
}

function applySnapshot(snap: Snapshot): void {
  document.title = snap.title;
  setMeta('name', 'description', snap.description);
  setMeta('property', 'og:title', snap.ogTitle);
  setMeta('property', 'og:description', snap.ogDescription);
  setMeta('property', 'og:url', snap.ogUrl);
  setMeta('name', 'twitter:title', snap.twitterTitle);
  setMeta('name', 'twitter:description', snap.twitterDescription);
  setLinkHref('canonical', snap.canonical);
}

/**
 * Overrides per-route `<head>` metadata (title, description, OG, Twitter,
 * canonical) and restores the page-load defaults on unmount. The first call
 * snapshots whatever index.html shipped with so we round-trip back to it.
 *
 * Note: only JS-running crawlers (Googlebot, Bingbot) see these overrides —
 * social link previews fetch raw HTML and will still show index.html values.
 * Fixing that requires prerendering at build time.
 */
export function useDocumentMeta(meta: DocumentMeta): void {
  const defaultsRef = useRef<Snapshot | null>(null);
  if (defaultsRef.current === null) {
    defaultsRef.current = snapshotHead();
  }

  useEffect(() => {
    const url = `${SITE_ORIGIN}${meta.path}`;
    applySnapshot({
      title: meta.title,
      description: meta.description,
      ogTitle: meta.title,
      ogDescription: meta.description,
      ogUrl: url,
      twitterTitle: meta.title,
      twitterDescription: meta.description,
      canonical: url,
    });
    const defaults = defaultsRef.current!;
    return () => {
      applySnapshot(defaults);
    };
  }, [meta.title, meta.description, meta.path]);
}
