import path from 'node:path'
import { loadConfig } from 'unconfig'
import { getMyPackageJson, getPackageJson } from './lib.js'

export const myPkg = getMyPackageJson('./package.json')
export const pkg = getPackageJson()

export const cfg = {
  assetsDir: 'assets',
  envPrefix: 'APP_',
  envBaseUrlKey: 'APP_BASE_URL',
  envAppTitleKey: 'APP_TITLE',
  envDefaultBaseUrl: '/',
  envDefaultAppTitle: pkg?.name ?? 'HTML:CSS:JS'
}

export const { config, sources } = await loadConfig({
  sources: [
    {
      files: path.resolve(path.join(process.cwd(), 'htmlcssjs.config')),
      extensions: ['js', 'mjs', 'ts']
    },
    {
      files: path.resolve(
        path.join(process.cwd(), 'node_modules', myPkg.name, 'htmlcssjs.config')
      ),
      extensions: ['js', 'mjs', 'ts']
    },
    {
      files: 'htmlcssjs.config',
      extensions: ['js', 'mjs', 'ts']
    }
  ],
  merge: true
})

const getViteSharedOptions = config?.viteSharedOptions ?? {}
delete getViteSharedOptions?.root
delete getViteSharedOptions?.base
delete getViteSharedOptions?.mode
delete getViteSharedOptions?.plugins
delete getViteSharedOptions?.publicDir
delete getViteSharedOptions?.envDir
delete getViteSharedOptions?.envPrefix
delete getViteSharedOptions?.appType

export const viteSharedOptions = getViteSharedOptions
export const viteServerOptions = config?.viteServerOptions ?? {}
export const vitePreviewOptions = config?.vitePreviewOptions ?? {}
export const viteOptimizeOptions = config?.viteOptimizeOptions ?? {}
export const viteSsrOptions = config?.viteSsrOptions ?? {}
export const viteWorkerOptions = config?.viteWorkerOptions ?? {}
