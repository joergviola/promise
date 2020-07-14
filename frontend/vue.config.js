module.exports = {
    publicPath: './',
    outputDir: '../backend/public/app',
    pwa: {
        workboxOptions: {
            skipWaiting: true
        }
    }
}