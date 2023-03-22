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
  viteSharedOptions: {},
  viteServerOptions: {
    host: 'localhost',
    port: 1505
  },
  vitePreviewOptions: {},
  viteOptimizeOptions: {},
  viteSsrOptions: {},
  viteWorkerOptions: {},
  vitePlugins: []
}
