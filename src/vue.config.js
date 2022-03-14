const argvs = process.argv
if (argvs.length > 3) {
  process.env.VUE_APP_TYPE = argvs[3].split('=')[1]
}
module.exports = {
  publicPath: '/', // 路由路径
  filenameHashing: true, // 文件名hasg
  assetsDir: 'assets', //静态资源打包文件夹
  productionSourceMap: false,
  devServer: {
    open: false,
    port: 8080, //设置端口
    proxy: {
      '/map': {
        target: 'https://test-escort.1rendata.com',
        changeOrigin: true,
        pathRewrite: {
          '^/map': '/map'
        }
      } 
    },
  }
}
