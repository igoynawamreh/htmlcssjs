import path from 'node:path'
import fg from 'fast-glob'
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
  htmlcssjsMinifyHTML,
  htmlcssjsSite,
  newProcessEnv
} from './lib'

const plugins = [
  htmlcssjsSite(config, pkg),
  htmlcssjsMinifyHTML(config, pkg)
]
if (
  config?.plugins?.all &&
  Array.isArray(config?.plugins?.all) &&
  config?.plugins?.all?.length
) {
  plugins.push(...config.plugins.all)
}
if (
  config?.plugins?.site &&
  Array.isArray(config?.plugins?.site) &&
  config?.plugins?.site?.length
) {
  plugins.push(...config.plugins.site)
}

export default ({ mode }) => {
  process.env = newProcessEnv(mode, process.env, pkg)
  return defineConfig({
    appType: 'mpa',
    base: process.env[cfg.envBaseUrlKey],
    root: path.resolve(path.join(process.cwd(), config.src.root)),
    publicDir: path.resolve(path.join(process.cwd(), config.src.public)),
    envDir: process.cwd(),
    envPrefix: cfg.envPrefix,
    build: {
      outDir: path.resolve(path.join(process.cwd(), config.out.site)),
      assetsDir: cfg.assetsDir,
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      minify: 'production' === mode ? config.build.minify : false,
      sourcemap: config.build.sourcemap,
      target: browserslistToEsbuild(),
      cssTarget: browserslistToEsbuild(),
      rollupOptions: {
        input: fg.sync(['./src/**/*.html']).map((entry) => {
          return path.resolve(process.cwd(), entry)
        }),
        output: {
          entryFileNames: (chunkInfo) => {
            return entryFileNames(chunkInfo, config)
          },
          chunkFileNames: (chunkInfo) => {
            return chunkFileNames(chunkInfo, config)
          },
          assetFileNames: (assetInfo) => {
            return assetFileNames(assetInfo, config)
          }
        }
      },
      copyPublicDir: true,
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
