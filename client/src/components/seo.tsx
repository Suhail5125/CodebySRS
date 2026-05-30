import { useEffect } from "react";
import { SEO_CONFIG, getKeywordsString } from "@/lib/seo-config";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  url?: string;
  noindex?: boolean;
  structuredData?: object;
}

export function SEO({
  title,
  description,
  keywords,
  image,
  type = "website",
  url,
  noindex = false,
  structuredData,
}: SEOProps) {
  const meta = {
    title: title || SEO_CONFIG.defaultTitle,
    description: description || SEO_CONFIG.defaultDescription,
    keywords: keywords || getKeywordsString(),
    image: image || `${SEO_CONFIG.siteUrl}/og-image.jpg`,
    type: type,
    url: url || (typeof window !== "undefined" ? window.location.href : SEO_CONFIG.siteUrl),
  };

  useEffect(() => {
    // Update document title
    document.title = meta.title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      
      element.setAttribute("href", href);
    };

    // Standard meta tags
    updateMetaTag("description", meta.description);
    updateMetaTag("keywords", meta.keywords);
    updateMetaTag("author", SEO_CONFIG.author);
    
    // Robots
    updateMetaTag("robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    updateMetaTag("googlebot", noindex ? "noindex, nofollow" : "index, follow");
    
    // Viewport and theme
    updateMetaTag("viewport", "width=device-width, initial-scale=1.0, maximum-scale=5.0");
    updateMetaTag("theme-color", "#FF3D00");
    updateMetaTag("msapplication-TileColor", "#FF3D00");
    
    // Language
    updateMetaTag("language", "English");
    updateMetaTag("revisit-after", "7 days");
    
    // Open Graph tags
    updateMetaTag("og:site_name", SEO_CONFIG.siteName, true);
    updateMetaTag("og:title", meta.title, true);
    updateMetaTag("og:description", meta.description, true);
    updateMetaTag("og:image", meta.image, true);
    updateMetaTag("og:image:alt", meta.title, true);
    updateMetaTag("og:type", meta.type, true);
    updateMetaTag("og:url", meta.url, true);
    updateMetaTag("og:locale", "en_US", true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:site", SEO_CONFIG.social.twitter);
    updateMetaTag("twitter:creator", SEO_CONFIG.social.twitter);
    updateMetaTag("twitter:title", meta.title);
    updateMetaTag("twitter:description", meta.description);
    updateMetaTag("twitter:image", meta.image);
    updateMetaTag("twitter:image:alt", meta.title);

    // Additional SEO tags
    updateMetaTag("format-detection", "telephone=no");
    updateMetaTag("apple-mobile-web-app-capable", "yes");
    updateMetaTag("apple-mobile-web-app-status-bar-style", "black-translucent");
    updateMetaTag("apple-mobile-web-app-title", SEO_CONFIG.siteName);
    
    // Canonical URL
    updateLinkTag("canonical", meta.url);
    
    // Favicon links
    updateLinkTag("icon", "/favicon.ico");
    updateLinkTag("apple-touch-icon", "/apple-touch-icon.png");

    // Structured Data (JSON-LD)
    const removeExistingStructuredData = () => {
      const existing = document.querySelectorAll('script[type="application/ld+json"]');
      existing.forEach(el => el.remove());
    };

    const addStructuredData = (data: object) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    };

    removeExistingStructuredData();

    // Add Organization/Person schema
    addStructuredData(SEO_CONFIG.organization);
    addStructuredData(SEO_CONFIG.person);

    // Add custom structured data if provided
    if (structuredData) {
      addStructuredData(structuredData);
    }

    // Add WebSite schema
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      description: meta.description,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });

    // Add BreadcrumbList if not home page
    if (meta.url !== SEO_CONFIG.siteUrl && meta.url !== `${SEO_CONFIG.siteUrl}/`) {
      const pathSegments = new URL(meta.url).pathname.split("/").filter(Boolean);
      const breadcrumbItems = [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SEO_CONFIG.siteUrl,
        },
        ...pathSegments.map((segment, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
          item: `${SEO_CONFIG.siteUrl}/${pathSegments.slice(0, index + 1).join("/")}`,
        })),
      ];

      addStructuredData({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
      });
    }

  }, [meta, noindex, structuredData]);

  return null;
}
