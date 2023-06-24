export default {
  base: '/',
  src: {
    root: './src',
    public: './public',
    data: './src/data.yml'
  },
  out: {
    site: {
      dest: './site',
      clean: true
    },
    dist: false,
    lib: false
  }
}
