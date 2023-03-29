export default {
  src: {
    root: './src',
    public: './public'
  },
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
      name: undefined, // default: (pkg?.name ?? 'app')
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
