const prod = process.env.NODE_ENV === 'production'
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  disable: prod ? false : true,
  skipWaiting: true
});

module.exports = withPWA({
  // next.js config
  images: {
    unoptimized: true,
  },
  exportPathMap: function () {
    return {
      '/': { page: '/' },
    }
  }
});
