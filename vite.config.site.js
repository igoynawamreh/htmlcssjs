import path from 'node:path'
import fg from 'fast-glob'
import { defineConfig } from 'vite'
import {
  cfg,
  config,
  pkg
} from './config'
import {
  assetFileNames,
  browserslistToEsbuild,
  chunkFileNames,
  entryFileNames,
  htmlcssjsMinifyHTML,
  htmlcssjsSite,
  newProcessEnv,
  viteOptimizeOptions,
  vitePreviewOptions,
  viteServerOptions,
  viteSharedOptions,
  viteSsrOptions,
  viteWorkerOptions
} from './lib'

const plugins = [
  htmlcssjsSite(config, pkg),
  htmlcssjsMinifyHTML(config, pkg)
]
if (
  config.vitePlugins.site &&
  Array.isArray(config.vitePlugins.site) &&
  config.vitePlugins.site.length
) {
  plugins.push(...config.vitePlugins.site)
}

export default ({ mode }) => {
  process.env = newProcessEnv(mode, process.env, config)

  let base = config.base
  if (mode === 'development') {
    try {
      let newBase = new URL(base)
      base = newBase.pathname
    } catch {}
  }

  return defineConfig({
    appType: 'mpa',
    base: base,
    root: path.resolve(path.join(process.cwd(), config.src.root)),
    publicDir: path.resolve(path.join(process.cwd(), config.src.public)),
    envDir: process.cwd(),
    envPrefix: cfg.envPrefix,
    build: {
      outDir: path.resolve(path.join(process.cwd(), config.out.site.dest)),
      assetsDir: cfg.assetsDir,
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      minify: mode === 'production' ? config.build.js.minify : false,
      cssMinify: mode === 'production' ? config.build.css.minify : false,
      sourcemap: false,
      target: browserslistToEsbuild(),
      cssTarget: browserslistToEsbuild(),
      rollupOptions: {
        input: fg.sync(['./src/**/*.html']).map((entry) => {
          return path.resolve(process.cwd(), entry)
        }),
        external: config.build.js.external,
        output: {
          globals: config.build.js.globals,
          entryFileNames: (chunkInfo) => {
            return entryFileNames(chunkInfo, config, 'site')
          },
          chunkFileNames: (chunkInfo) => {
            return chunkFileNames(chunkInfo, config, 'site')
          },
          assetFileNames: (assetInfo) => {
            return assetFileNames(assetInfo, config, 'site')
          }
        }
      },
      copyPublicDir: true,
      emptyOutDir: config.out.site.clean
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
