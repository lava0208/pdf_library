const withPWA = require("next-pwa")({
  dest: "public",
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
