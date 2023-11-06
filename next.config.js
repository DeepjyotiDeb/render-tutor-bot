const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'elasticbeanstalk-ap-south-1-860768680752.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/',
      },
    ],
  },
};

module.exports = nextConfig;
