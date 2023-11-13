/**
 * la ruta 'template-laravel-vuejs' debe ser cambiada por el nombre de la carpeta contenedora del proyecto
 */
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/SIGEDO/public1" : "/",
  outputDir: "../public1/",

  configureWebpack: {
    devtool: "source-map"
  },

  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass") // This line must in sass option
      }
    }
  }
};
