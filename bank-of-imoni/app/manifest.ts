import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bank of Imoni",
    short_name: "BoI",
    description: "A financial tracker for Imoni",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/bank-of-imoni/public/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/bank-of-imoni/public/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
