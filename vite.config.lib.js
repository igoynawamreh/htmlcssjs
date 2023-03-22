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
  htmlcssjsLib,
  newProcessEnv
} from './lib'

const plugins = [htmlcssjsLib(config, pkg)]
if (
  config?.vitePlugins &&
  Array.isArray(config?.vitePlugins) &&
  config?.vitePlugins?.length
) {
  plugins.push(...config.vitePlugins)
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
      outDir: path.resolve(path.join(process.cwd(), config.out.lib)),
      assetsDir: cfg.assetsDir,
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      minify: 'production' === mode ? config.build.minify : false,
      sourcemap: config.build.sourcemap,
      target: browserslistToEsbuild(),
      cssTarget: browserslistToEsbuild(),
      lib: {
        entry: path.resolve(process.cwd(), path.join(config.src.root, 'index.lib.js')),
        formats: ['es', 'umd'],
        name: pkg?.name ?? 'lib'
      },
      rollupOptions: {
        output: {
          entryFileNames: (chunkInfo) => {
            return entryFileNames(chunkInfo, config, true, false, 'named')
          },
          chunkFileNames: (chunkInfo) => {
            return chunkFileNames(chunkInfo, config, true, false, 'named')
          },
          assetFileNames: (assetInfo) => {
            return assetFileNames(assetInfo, config, false, 'named')
          }
        }
      },
      copyPublicDir: false,
      emptyOutDir: true
    },
    esbuild: {
      minifyIdentifiers: true
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
