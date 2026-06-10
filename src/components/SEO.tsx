import { Helmet } from "react-helmet-async";
import { SITE_URL, DEFAULT_OG_IMAGE, TWITTER_HANDLE, PAGE_META, type PageMeta } from "@/utils/metadata";

interface SEOProps {
  page: keyof typeof PAGE_META;
  overrides?: Partial<PageMeta>;
}

export default function SEO({ page, overrides }: SEOProps) {
  const base = PAGE_META[page];
  if (!base) return null;
  const meta = { ...base, ...overrides };
  const url = meta.canonical || SITE_URL;
  const ogImage = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={meta.ogTitle || meta.title} />
      <meta property="og:description" content={meta.ogDescription || meta.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="MistHustlers" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.ogTitle || meta.title} />
      <meta name="twitter:description" content={meta.ogDescription || meta.description} />
      <meta name="twitter:image" content={ogImage} />
      {TWITTER_HANDLE && <meta name="twitter:site" content={TWITTER_HANDLE} />}
    </Helmet>
  );
}
