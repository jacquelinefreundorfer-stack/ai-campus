// ── Shared SEO meta tags & structured data helpers ─────────────────────────────
// Reusable across routes for consistent OG, Twitter Card, and JSON-LD output.

const SITE_URL = "https://aicampus.ctonew.app";
const OG_IMAGE = `${SITE_URL}/og-image.svg`;

export interface PageMeta {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article";
  publishedAt?: string;
  author?: string;
}

export function buildOgTags(meta: PageMeta) {
  const image = meta.image || OG_IMAGE;
  return [
    { property: "og:title", content: meta.title },
    { property: "og:description", content: meta.description },
    { property: "og:image", content: image },
    { property: "og:url", content: meta.url },
    { property: "og:type", content: meta.type || "website" },
    { property: "og:site_name", content: "AI Campus" },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: meta.title },
    { name: "twitter:description", content: meta.description },
    { name: "twitter:image", content: image },
  ];
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI Campus",
    url: SITE_URL,
    description:
      "AI Campus offers rigorous online programs in AI, data science, digital marketing, and more. Earn verifiable digital certificates from a prestigious online institution.",
    logo: `${SITE_URL}/og-image.svg`,
    sameAs: [],
  };
}

export function jsonLdArticle(post: {
  title: string;
  slug: string;
  excerpt?: string | null;
  author?: string | null;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author || "AI Campus",
    },
    publisher: {
      "@type": "Organization",
      name: "AI Campus",
      url: SITE_URL,
    },
  };
}

export function jsonLdCourse(bundle: {
  title: string;
  description: string;
  modulesCount: number;
  hours: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: bundle.title,
    description: bundle.description,
    provider: {
      "@type": "Organization",
      name: "AI Campus",
      sameAs: SITE_URL,
    },
    educationalCredentialAwarded: "Certificate of Completion",
    timeRequired: `P${Math.ceil(bundle.hours / 7)}W`, // Approximate weeks
  };
}
