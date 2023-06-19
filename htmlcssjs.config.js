export default {
  src: {
    root: './src',
    public: './public'
  },
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
      banner: '',
      minify: true
    },
    css: {
      filename: 'app',
      hash: false,
      banner: '',
      minify: true
    },
    js: {
      filename: 'app',
      hash: false,
      banner: '',
      minify: true,
      distFormat: 'umd',
      libFormats: ['es', 'umd'],
      name: 'app',
      external: [],
      globals: {}
    },
    assets: {
      hash: false
    }
  },
  vitePlugins: {
    site: [],
    dist: [],
    lib: []
  },
  viteOptions: {
    shared: {},
    preview: {},
    server: {
      host: 'localhost',
      port: 1505
    },
    optimize: {},
    ssr: {},
    worker: {}
  }
}
