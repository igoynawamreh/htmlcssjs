import path from 'node:path'
import { loadConfig } from 'unconfig'
import { getMyPackageJson, getPackageJson } from './lib.js'

export const myPkg = getMyPackageJson('./package.json')
export const pkg = getPackageJson()

export const cfg = {
  assetsDir: 'assets',
  envPrefix: 'APP_',
  envDataKey: 'APP_DATA',
  envConfigKey: 'APP_CONFIG'
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
