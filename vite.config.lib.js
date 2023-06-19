import path from 'node:path'
import { defineConfig } from 'vite'
import {
  cfg,
  config,
  pkg
} from './data'
import {
  assetFileNames,
  browserslistToEsbuild,
  htmlcssjsLib,
  newProcessEnv,
  viteOptimizeOptions,
  vitePreviewOptions,
  viteServerOptions,
  viteSharedOptions,
  viteSsrOptions,
  viteWorkerOptions
} from './lib'

const plugins = [htmlcssjsLib(config, pkg)]
if (
  config.vitePlugins.lib &&
  Array.isArray(config.vitePlugins.lib) &&
  config.vitePlugins.lib.length
) {
  plugins.push(...config.vitePlugins.lib)
}

export default ({ mode }) => {
  process.env = newProcessEnv(mode, process.env, pkg)
  return defineConfig({
    appType: 'mpa',
    base: './',
    root: path.resolve(path.join(process.cwd(), config.src.root)),
    publicDir: path.resolve(path.join(process.cwd(), config.src.public)),
    envDir: process.cwd(),
    envPrefix: cfg.envPrefix,
    build: {
      outDir: path.resolve(path.join(process.cwd(), config.out.lib.dest)),
      assetsDir: cfg.assetsDir,
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      minify: mode === 'production' ? config.build.js.minify : false,
      cssMinify: mode === 'production' ? config.build.css.minify : false,
      sourcemap: false,
      target: browserslistToEsbuild(),
      cssTarget: browserslistToEsbuild(),
      lib: {
        entry: path.resolve(
          process.cwd(), path.join(config.src.root, 'index.lib.js')
        ),
        formats: config.build.js.libFormats,
        name: config.build.js.name,
        fileName: (format) => {
          let hash = ''
          if (true === config.build.js.hash) {
            hash = '-[hash]'
          }
          if (format === 'es' || format === 'esm') {
            return `js/${config.build.js.filename}${hash}.esm.js`
          } else if (format === 'cjs') {
            return `js/${config.build.js.filename}${hash}.cjs.js`
          } else if (format === 'umd') {
            return `js/${config.build.js.filename}${hash}.umd.js`
          } else if (format === 'iife') {
            return `js/${config.build.js.filename}${hash}.iife.js`
          } else {
            return `js/${config.build.js.filename}${hash}.${format}.js`
          }
        }
      },
      rollupOptions: {
        external: config.build.js.external,
        output: {
          globals: config.build.js.globals,
          assetFileNames: (assetInfo) => {
            return assetFileNames(assetInfo, config, 'lib')
          }
        }
      },
      copyPublicDir: false,
      emptyOutDir: config.out.lib.clean
    },
    plugins: plugins,
    ...viteSharedOptions(config.viteOptions.shared),
    preview: vitePreviewOptions(config.viteOptions.preview),
    server: viteServerOptions(config.viteOptions.server),
    optimizeDeps: viteOptimizeOptions(config.viteOptions.optimize),
    ssr: viteSsrOptions(config.viteOptions.ssr),
    worker: viteWorkerOptions(config.viteOptions.worker)
  })
}
