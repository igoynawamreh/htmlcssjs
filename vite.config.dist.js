import path from 'node:path'
import { defineConfig } from 'vite'
import {
  cfg,
  config,
  pkg,
  viteOptimizeOptions,
  vitePreviewOptions,
  viteServerOptions,
  viteSharedOptions,
  viteSsrOptions,
  viteWorkerOptions
} from './data'
import {
  assetFileNames,
  browserslistToEsbuild,
  chunkFileNames,
  entryFileNames,
  htmlcssjsDist,
  newProcessEnv
} from './lib'

const plugins = [htmlcssjsDist(config, pkg)]
if (
  config?.plugins?.all &&
  Array.isArray(config?.plugins?.all) &&
  config?.plugins?.all?.length
) {
  plugins.push(...config.plugins.all)
}
if (
  config?.plugins?.dist &&
  Array.isArray(config?.plugins?.dist) &&
  config?.plugins?.dist?.length
) {
  plugins.push(...config.plugins.dist)
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
      outDir: path.resolve(path.join(process.cwd(), config.out.dist)),
      assetsDir: cfg.assetsDir,
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      minify: 'production' === mode ? config.build.minify : false,
      sourcemap: config.build.sourcemap,
      target: browserslistToEsbuild(),
      cssTarget: browserslistToEsbuild(),
      rollupOptions: {
        input: path.resolve(process.cwd(), path.join(config.src.root, 'index.js')),
        output: {
          format: 'umd',
          entryFileNames: (chunkInfo) => {
            return entryFileNames(chunkInfo, config, false, false, 'named')
          },
          chunkFileNames: (chunkInfo) => {
            return chunkFileNames(chunkInfo, config, false, false, 'named')
          },
          assetFileNames: (assetInfo) => {
            return assetFileNames(assetInfo, config, false, 'named')
          }
        }
      },
      copyPublicDir: false,
      emptyOutDir: true
    },
    plugins: plugins,
    ...viteSharedOptions,
    ...(config?.viteServerOptions && { server: viteServerOptions }),
    ...(config?.vitePreviewOptions && { preview: vitePreviewOptions }),
    ...(config?.viteOptimizeOptions && { optimizeDeps: viteOptimizeOptions }),
    ...(config?.viteSsrOptions && { ssr: viteSsrOptions }),
    ...(config?.viteWorkerOptions && { worker: viteWorkerOptions })
  })
}
