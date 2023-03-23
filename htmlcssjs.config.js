export default {
  src: {
    root: './src',
    public: './public'
  },
  out: {
    dist: './build/dist',
    preview: './build/preview',
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
    dist: [],
    preview: [],
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
