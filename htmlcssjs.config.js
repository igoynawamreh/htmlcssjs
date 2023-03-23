export default {
  src: {
    root: './src',
    public: './public'
  },
  out: {
    site: './build/site',
    dist: './build/dist',
    lib: './build/lib'
  },
  build: {
    cssFileName: 'app',
    jsFileName: 'app',
    banner: '',
    minify: true,
    sourcemap: false
  },
  plugins: {
    all: [],
    site: [],
    dist: [],
    lib: []
  },
  viteServerOptions: {
    host: 'localhost',
    port: 1505
  },
  viteSharedOptions: {},
  vitePreviewOptions: {},
  viteOptimizeOptions: {},
  viteSsrOptions: {},
  viteWorkerOptions: {}
}
