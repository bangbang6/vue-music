'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api/getLyric':{
        target: 'https://szc.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
        bypass: function (req, res, proxyOptions) {
          req.headers.referer = 'https://c.y.qq.com';
          req.headers.host = 'c.y.qq.com';
          ///req.headers.cookie = 'pgv_pvi=3889743872; RK=lN8WOz2vGn; tvfe_boss_uuid=0892fe4759f7fb8b; ptcz=ee6ed8dc3997e4810f29ccd33ca0392f50a72bc2642ca07917585a92439577d9; ts_uid=867922710; pgv_pvid=1299941788; o_cookie=577174667; eas_sid=w1G5A2o3l5E8Y5L0c2x7r1H1G4; mobileUV=1_1631651e8d9_95752; pt2gguin=o0577174667; _ga=GA1.2.327679859.1529136969; luin=o0577174667; lskey=000100007e50117c6edf3aa3d4ee434fb8cf29e89227cb3262cf4d662e751dc95154fb661488fa41da650e21; ts_refer=www.baidu.com/link; pgv_info=ssid=s1303050792; pgv_si=s5955182592; yqq_stat=0; qqmusic_fromtag=66; player_exist=1; yq_playschange=0; yq_playdata=; ts_last=y.qq.com/portal/player.html; yplayer_open=1; yq_index=0'
       // req.headers.cookie = 'c.y.qq.com'
        },
        pathRewrite: {
          '/api/getLyric': ''
        }
      },
      /* '/api/getAllToplist':{
        target: 'https://szc.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
        bypass: function (req, res, proxyOptions) {
          req.headers.referer = 'https://c.y.qq.com';
          req.headers.host = 'c.y.qq.com';
          ///req.headers.cookie = 'pgv_pvi=3889743872; RK=lN8WOz2vGn; tvfe_boss_uuid=0892fe4759f7fb8b; ptcz=ee6ed8dc3997e4810f29ccd33ca0392f50a72bc2642ca07917585a92439577d9; ts_uid=867922710; pgv_pvid=1299941788; o_cookie=577174667; eas_sid=w1G5A2o3l5E8Y5L0c2x7r1H1G4; mobileUV=1_1631651e8d9_95752; pt2gguin=o0577174667; _ga=GA1.2.327679859.1529136969; luin=o0577174667; lskey=000100007e50117c6edf3aa3d4ee434fb8cf29e89227cb3262cf4d662e751dc95154fb661488fa41da650e21; ts_refer=www.baidu.com/link; pgv_info=ssid=s1303050792; pgv_si=s5955182592; yqq_stat=0; qqmusic_fromtag=66; player_exist=1; yq_playschange=0; yq_playdata=; ts_last=y.qq.com/portal/player.html; yplayer_open=1; yq_index=0'
       // req.headers.cookie = 'c.y.qq.com'
        },
        pathRewrite: {
          '/api/getAllToplist': ''
        }
      } */
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),
    port:8080,
    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
