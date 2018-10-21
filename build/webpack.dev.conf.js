

'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const axios = require('axios');
const express = require('express');
const apiRoutes = express.Router();

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

var jsonp =require('./jsonp.js')
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before(apiRoutes){
      apiRoutes.get('/api/getMusicList',function(req,res){
         let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
         var data = req.query;
        
         axios.get(url,{params:data,header:{}}).then(res1=>{
              var res1 = res1.data;
              res.json({
                status:'0',
                result:res1
              })
         }).catch(e=>{console.log(e)})
      })
      apiRoutes.get('/api/getSingers',function(req,res){
        var query = req.query;
        var name = query.jsonpCallback
        console.log(name)
        let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
        var data = {
          g_tk: '1078325585',
          callback:name,
          jsonpCallback:name,
         
          loginUin: '577174667',
          hostUin: '0',
          format: 'jsonp',
          inCharset: 'utf8',
          outCharset: 'utf-8',
          notice: '0',
          platform: 'yqq',
          needNewCode:'0',
          data: {"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}
       }
        
       
         axios.get(url,{params:data}).then(res1=>{
             var res1 = res1.data;
             res.write(res1)
              res.end()            
        }).catch(e=>{console.log(e)})
     })
     apiRoutes.get('/api/getLyric',function(req,res){
       var midid = req.query.midid
        var data = {
          
          songmid: midid,
          g_tk: '1078325585',
         
          loginUin: '577174667',
          hostUin: 0,
          format: 'json',
          inCharset: 'utf8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'yqq',
          needNewCode: 0,
          
        }
        axios.get('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',{params:data,headers:{
          referer: 'https://y.qq.com/portal/player.html',
          cookie: 'pgv_pvi=3889743872; RK=lN8WOz2vGn; tvfe_boss_uuid=0892fe4759f7fb8b; ptcz=ee6ed8dc3997e4810f29ccd33ca0392f50a72bc2642ca07917585a92439577d9; ts_uid=867922710; pgv_pvid=1299941788; o_cookie=577174667; eas_sid=w1G5A2o3l5E8Y5L0c2x7r1H1G4; mobileUV=1_1631651e8d9_95752; pt2gguin=o0577174667; _ga=GA1.2.327679859.1529136969; luin=o0577174667; lskey=000100007e50117c6edf3aa3d4ee434fb8cf29e89227cb3262cf4d662e751dc95154fb661488fa41da650e21; pgv_info=ssid=s1350174696; pgv_si=s2607355904; ts_refer=ADTAGnewyqq.singer; yqq_stat=0; player_exist=1; ts_last=y.qq.com/portal/player.html; qqmusic_fromtag=66; yplayer_open=1; yq_index=0',
          authority: 'c.y.qq.com'
         }}).then(res1=>{
            console.log(res1.data)
            var ret = res1.data
            //console.log(typeof ret)
            console.log('1')
           if(typeof ret == 'string'){
             var test = /^\w+\(({[^()]+})\)$/
             var matches = ret.match(test)
             //console.log(matches)
             if(matches){
              
               ret =JSON.parse(matches[1]) 
             }
             
             
           }
           console.log('lyric',ret)
           res.json(ret)
         })
     })

     apiRoutes.get('/api/recommandList',function(req,res){
       var disstid = req.query.disstid
        var data = {
          g_tk: '5381',
          uin: '0',
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'h5',
          needNewCode: 1,
          new_format: 1,
          pic: 500,
          disstid: disstid,
          type: 1,
          json: 1,
          utf8: 1,
          onlysong: 0,
          picmid: 1,
          nosign: 1,
          song_begin: 0,
          song_num: 15,
          _: '1539912950369'
        }

        axios.get('https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',{params:data,headers:{
          authority:'c.y.qq.com',
          origin: 'https://y.qq.com',
          referer: 'https://y.qq.com/w/taoge.html',
          cookie:'pgv_pvi=3889743872; RK=lN8WOz2vGn; tvfe_boss_uuid=0892fe4759f7fb8b; ptcz=ee6ed8dc3997e4810f29ccd33ca0392f50a72bc2642ca07917585a92439577d9; ts_uid=867922710; pgv_pvid=1299941788; o_cookie=577174667; eas_sid=w1G5A2o3l5E8Y5L0c2x7r1H1G4; mobileUV=1_1631651e8d9_95752; pt2gguin=o0577174667; _ga=GA1.2.327679859.1529136969; luin=o0577174667; lskey=000100007e50117c6edf3aa3d4ee434fb8cf29e89227cb3262cf4d662e751dc95154fb661488fa41da650e21; pgv_si=s9043109888; pgv_info=ssid=s548724736; yq_playschange=0; yq_playdata=; player_exist=1; yq_index=0; qqmusic_fromtag=66; yplayer_open=0; yqq_stat=1; ts_refer=ADTAGnewyqq.taoge; ts_last=y.qq.com/m/index.html'
        }}).then(res1=>{
        //  console.log('recommand list',res1.data)
//console.log(typeof res1.data)
          res.json(res1.data)
        })
     })
     apiRoutes.get('/api/getTopList',function(req,res){
       var data = {
       
        g_tk: '1078325585',
       
        loginUin: '577174667',
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        data: {"comm":{"ct":24},"category":{"method":"get_hot_category","param":{"qq":""},"module":"music.web_category_svr"},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"},"playlist":{"method":"get_playlist_by_category","param":{"id":8,"curPage":1,"size":40,"order":5,"titleid":8},"module":"playlist.PlayListPlazaServer"},"new_song":{"module":"QQMusic.MusichallServer","method":"GetNewSong","param":{"type":0}},"new_album":{"module":"music.web_album_library","method":"get_album_by_tags","param":{"area":7,"company":-1,"genre":-1,"type":-1,"year":-1,"sort":2,"get_tags":1,"sin":0,"num":40,"click_albumid":0}},"toplist":{"module":"music.web_toplist_svr","method":"get_toplist_index","param":{}},"focus":{"module":"QQMusic.MusichallServer","method":"GetFocus","param":{}}}
       }
       axios.get('https://u.y.qq.com/cgi-bin/musicu.fcg',{params:data}).then(res1=>{
      // console.log(res)  
       //console.log(res1.data)
         res.json(res1.data)
       })
     })

     apiRoutes.get('/api/getAlltoplist',function(req,res){
       var topId = req.query.topId
       var specity = '2018-10-19'
       if(topId == 26){
          specity = '2018_41'
       }
      var data = {
        tpl: 3,
        page: 'detail',
        date: specity,
        topid: topId,
        type: 'top',
        song_begin: 0,
        song_num: 30,
        g_tk: '1078325585',
        
        loginUin: '577174667',
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
    }
      axios.get('https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',{params:data}).then(res1=>{
     // console.log(res)  
      //console.log(res1.data)
        res.json(res1.data)
      })
    })

    apiRoutes.get('/api/getHotKey',function(req,res){
      let data = {
        g_tk: '1078325585',
        //jsonpCallback: hotSearchKeysmod_top_search
        loginUin: '577174667',
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
      }
      axios.get('https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',{params:data}).then(res1=>{
        
        res.json(res1.data)
      })
    })

    apiRoutes.get('/api/searchMessage',function(req,res){
      var query = req.query.query
      var zhida = req.query.zhida
      var page = req.query.page
      let data = {
        g_tk:'5381',
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        w: query,
        zhidaqu: zhida?1:0,
        catZhida: zhida?1:0,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: page,
        aggr: 0,
        perpage: 20,
        n: 20,
        p: page,
        remoteplace: 'txt.mqq.all',
        _: '1540005420998'
      }
      axios.get('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',{params:data,headers:{
        origin: 'https://y.qq.com',
        referer: 'https://y.qq.com/m/index.html',
      }}).then(res1=>{
        console.log(res1.data)
        res.json(res1.data)
      })
    })
  },
},
  //加入需要加密,那么需要后端代理
  
  
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})


module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
