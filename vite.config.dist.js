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
  chunkFileNames,
  entryFileNames,
  htmlcssjsDist,
  newProcessEnv,
  viteOptimizeOptions,
  vitePreviewOptions,
  viteServerOptions,
  viteSharedOptions,
  viteSsrOptions,
  viteWorkerOptions
} from './lib'

const plugins = [htmlcssjsDist(config, pkg)]
if (
  config.vitePlugins.dist &&
  Array.isArray(config.vitePlugins.dist) &&
  config.vitePlugins.dist.length
) {
  plugins.push(...config.vitePlugins.dist)
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
      outDir: path.resolve(path.join(process.cwd(), config.out.dest.dist)),
      assetsDir: cfg.assetsDir,
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      minify: 'production' === mode ? config.build.js.minify : false,
      cssMinify: 'production' === mode ? config.build.css.minify : false,
      sourcemap: false,
      target: browserslistToEsbuild(),
      cssTarget: browserslistToEsbuild(),
      rollupOptions: {
        input: path.resolve(
          process.cwd(), path.join(config.src.root, 'index.js')
        ),
        external: config.build.js.external,
        output: {
          format: config.build.js.distFormat,
          name: config.build.js.name ?? (pkg?.name ? pkg.name.replace(/-/g, '_') : 'app'),
          globals: config.build.js.globals,
          entryFileNames: (chunkInfo) => {
            return entryFileNames(chunkInfo, config, 'dist')
          },
          chunkFileNames: (chunkInfo) => {
            return chunkFileNames(chunkInfo, config, 'dist')
          },
          assetFileNames: (assetInfo) => {
            return assetFileNames(assetInfo, config, 'dist')
          }
        }
      },
      copyPublicDir: false,
      emptyOutDir: config.out.clean.dist
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
