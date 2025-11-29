const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://meticulous-smile-production-9fd4.up.railway.app',
            changeOrigin: true,
        })
    );
};
