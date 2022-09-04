module.exports = {
  presets: [
    '@babel/preset-env',
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ["@supermap/babel-plugin-import",
      {
      "libraryName": "@supermap/iclient-leaflet"
      }
    ]
  ]
}
