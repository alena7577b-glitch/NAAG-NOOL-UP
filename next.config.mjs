/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/donate',
        destination: '/ayeyo-koris',
        permanent: true,
      },
      {
        source: '/ayeeyo-koris',
        destination: '/ayeyo-koris',
        permanent: true,
      },
      {
        source: '/story',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/sponsor',
        destination: '/ayeyo-koris',
        permanent: true,
      },
      {
        source: '/sponsorship',
        destination: '/ayeyo-koris',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.paypal.com https://www.sandbox.paypal.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.stripe.com https://*.paypal.com https://www.paypalobjects.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://api.stripe.com https://api-m.paypal.com https://api-m.sandbox.paypal.com https://www.paypal.com wss://*.supabase.co",
              "frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://www.paypal.com https://www.sandbox.paypal.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://checkout.stripe.com https://www.paypal.com https://www.sandbox.paypal.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
