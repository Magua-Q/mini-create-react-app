const paths = require("./paths")
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = function (env) {
  const isEnvDevelopment = env === "development" // 是否是开发环境
  const isEnvProduction = env === "production" // 是否是生产环境
  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    entry: paths.appIndexJs,
    output: {
      // The build folder.
      path: paths.appBuild,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: isEnvProduction ? "static/js/[name].[contenthash:8].js" : isEnvDevelopment && "static/js/bundle.js",
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : isEnvDevelopment && "static/js/[name].chunk.js",
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: paths.publicUrlOrPath,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: paths.appSrc,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-react"], // TODO: 用来干什么
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
      }),
    ],
  }
}
