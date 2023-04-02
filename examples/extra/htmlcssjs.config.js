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
    dest: {
      site: './build/site',
      dist: './build/dist',
      lib: './build/lib'
    },
    clean: {
      site: true,
      dist: true,
      lib: true
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
