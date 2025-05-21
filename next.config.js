/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'kbyohjsdzfncnqnnzzwe.supabase.co',
        port: '',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  transpilePackages: ['geist'],
  serverExternalPackages: [], // This will use the default list minus any packages you specify
  experimental: {
    serverComponentsExternalPackages: [] // For older Next.js versions
  },
};

module.exports = nextConfig;
