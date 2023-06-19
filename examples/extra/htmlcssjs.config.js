const banner = `
/*!
 * Package name: <%= pkg.name %>
 * App title: <%= env.APP_TITLE %>
 */
`

const htmlBanner = `
<!--
<%= pkg.name %>
-->
`

export default {
  out: {
    site: {
      dest: './build/site',
      clean: true
    },
    dist: {
      dest: './build/dist',
      clean: true
    },
    lib: {
      dest: './build/lib',
      clean: true
    }
  },
  build: {
    html: {
      banner: htmlBanner,
      minify: true
    },
    css: {
      filename: 'app',
      hash: false,
      banner: banner,
      minify: true
    },
    js: {
      filename: 'app',
      hash: false,
      banner: banner,
      minify: true,
      distFormat: 'umd',
      libFormats: ['es', 'umd'],
      name: 'MyAwesomeJS'
    },
    assets: {
      hash: false
    }
  }
}
