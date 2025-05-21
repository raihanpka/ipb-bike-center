/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ],
    domains: ['kbyohjsdzfncnqnnzzwe.supabase.co']
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
};

module.exports = nextConfig;
