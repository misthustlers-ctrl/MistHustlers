import { Helmet } from "react-helmet-async";
import { SITE_URL, DEFAULT_OG_IMAGE, TWITTER_HANDLE, PAGE_META, SITE_NAME, type PageMeta } from "@/utils/metadata";
import { useContent } from "@/utils/useContent";

interface SEOProps {
  page: string;
  overrides?: Partial<PageMeta>;
  robots?: string;
}

const SEO_DEFAULTS = {
  siteName: SITE_NAME,
  ogImage: DEFAULT_OG_IMAGE,
  twitterHandle: TWITTER_HANDLE,
};

function replaceSiteName(value: string, siteName: string) {
  return value.split(SITE_NAME).join(siteName);
}

function currentCanonical() {
  if (typeof window === "undefined") return SITE_URL;
  const path = window.location.pathname === "/" ? "" : window.location.pathname;
  return `${SITE_URL}${path}`;
}

export default function SEO({ page, overrides, robots }: SEOProps) {
  const seo = useContent("seo", SEO_DEFAULTS);
  const siteName = seo.siteName || SITE_NAME;
  const ogImagePath = seo.ogImage || DEFAULT_OG_IMAGE;

  const base = PAGE_META[page] || {
    ...PAGE_META.home,
    canonical: currentCanonical(),
  };
  const meta = { ...base, ...overrides };

  const title = replaceSiteName(meta.title, siteName);
  const description = replaceSiteName(meta.description, siteName);
  const ogTitle = replaceSiteName(meta.ogTitle || meta.title, siteName);
  const ogDescription = replaceSiteName(meta.ogDescription || meta.description, siteName);
  const url = meta.canonical || SITE_URL;
  const ogImage = `${SITE_URL}${ogImagePath}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {robots && <meta name="robots" content={robots} />}
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      {seo.twitterHandle && <meta name="twitter:site" content={seo.twitterHandle} />}
    </Helmet>
  );
}
