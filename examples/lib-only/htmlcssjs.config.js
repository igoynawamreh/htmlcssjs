export default {
  src: {
    root: './src'
  },
  out: {
    dest: {
      lib: './lib'
    }
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
