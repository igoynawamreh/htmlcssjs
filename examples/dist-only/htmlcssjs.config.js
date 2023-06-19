export default {
  src: {
    root: './src'
  },
  out: {
    dist: {
      dest: './dist',
      clean: true
    },
    site: false,
    lib: false
  },
  build: {
    js: {
      distFormat: 'iife'
    }
  }
}
