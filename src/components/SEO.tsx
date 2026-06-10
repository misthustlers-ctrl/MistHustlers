import { Helmet } from "react-helmet-async";
import { SITE_URL, DEFAULT_OG_IMAGE, TWITTER_HANDLE, PAGE_META, SITE_NAME, type PageMeta } from "@/utils/metadata";
import { useContent } from "@/utils/useContent";

interface SEOProps {
  page: keyof typeof PAGE_META;
  overrides?: Partial<PageMeta>;
}

const SEO_DEFAULTS = {
  siteName: SITE_NAME,
  ogImage: DEFAULT_OG_IMAGE,
  twitterHandle: TWITTER_HANDLE,
};

export default function SEO({ page, overrides }: SEOProps) {
  const seo = useContent("seo", SEO_DEFAULTS);
  const siteName = seo.siteName || SITE_NAME;
  const ogImagePath = seo.ogImage || DEFAULT_OG_IMAGE;

  const base = PAGE_META[page];
  if (!base) return null;
  const meta = { ...base, ...overrides };

  const title = meta.title.replaceAll(SITE_NAME, siteName);
  const description = meta.description.replaceAll(SITE_NAME, siteName);
  const ogTitle = (meta.ogTitle || meta.title).replaceAll(SITE_NAME, siteName);
  const ogDescription = (meta.ogDescription || meta.description).replaceAll(SITE_NAME, siteName);
  const url = meta.canonical || SITE_URL;
  const ogImage = `${SITE_URL}${ogImagePath}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
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
