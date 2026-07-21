/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Include blog infographics for Content desk + /api/content-images on Vercel
  outputFileTracingIncludes: {
    "/api/content-images/**/*": ["./content/blog-images/**/*"],
    "/api/admin/blog-images/**/*": ["./content/blog-images/**/*"],
    "/api/admin/articles/generate/**/*": ["./content/blog-images/**/*"],
    "/api/admin/leads/**/*": ["./public/brand/**/*"],
    "/admin/content/**/*": ["./content/blog-images/**/*"],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;
