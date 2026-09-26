import { Helmet } from "react-helmet-async";
import { SITE_URL, DEFAULT_OG_IMAGE, TWITTER_HANDLE, PAGE_META, SITE_NAME, type PageMeta } from "@/utils/metadata";
import { useContent } from "@/utils/useContent";

interface SEOProps {
  page: string;
  overrides?: Partial<PageMeta>;
  robots?: string;
  authorName?: string;
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

export default function SEO({ page, overrides, robots, authorName }: SEOProps) {
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

  const ogType = "website";

  return (
    <Helmet>
      {/* === Core === */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      {robots && <meta name="robots" content={robots} />}
      <meta name="author" content={authorName || "Naveen Salve, MistHustlers"} />
      <link rel="canonical" href={url} />

      {/* === Branding === */}
      <meta name="application-name" content={siteName} />
      <meta name="theme-color" content="#fc5000" />
      <meta name="color-scheme" content="light" />

      {/* === OpenGraph === */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={`${siteName} — ${ogTitle}`} />
      <meta property="og:locale" content="en_US" />

      {/* === Twitter Cards === */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seo.twitterHandle || TWITTER_HANDLE} />
      <meta name="twitter:creator" content={seo.twitterHandle || TWITTER_HANDLE} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${siteName} — ${ogTitle}`} />

      {/* === Additional SEO signals === */}
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="English" />
      {page === "locationIndore" && (
        <>
          <meta name="geo.region" content="IN-MP" />
          <meta name="geo.placename" content="Indore, Madhya Pradesh, India" />
          <meta name="geo.position" content="22.7196;75.8577" />
          <meta name="ICBM" content="22.7196, 75.8577" />
        </>
      )}
    </Helmet>
  );
}
