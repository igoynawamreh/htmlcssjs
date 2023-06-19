export default {
  src: {
    root: './src'
  },
  out: {
    lib: {
      dest: './lib',
      clean: true
    },
    site: false,
    dist: false
  },
  build: {
    js: {
      libFormats: ['es', 'cjs', 'umd'],
      name: 'MyLib'
    }
  },
  viteOptions: {
    shared: {
      esbuild: {
        minifyIdentifiers: false
      }
    }
  }
}
