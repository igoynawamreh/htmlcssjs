import fs from 'node:fs'
import path from 'node:path'
import ejs from 'ejs'
import prettier from 'prettier'
import browserslist from 'browserslist'
import { minify } from 'html-minifier-terser'
import { createRequire } from 'node:module'
import { cfg } from './data.js'
import { marked } from 'marked'
import { loadEnv } from 'vite'

const require = createRequire(import.meta.url)

export const htmlRegExp = new RegExp(/\.(html|ejs)$/i)
export const cssRegExp = new RegExp(/\.(css)$/i)
export const jsRegExp = new RegExp(/\.([mc]?js)$/i)
export const cssJsRegExp = new RegExp(/\.(css|[mc]?js)$/i)
export const vendorRegExp = new RegExp(/vendor/)

export function findFiles(dir) {
  try {
    let files = []
    const list = fs.readdirSync(dir)
    list.forEach(file => {
      file = path.join(dir, file)
      const stat = fs.statSync(file)
      if (stat && stat.isDirectory()) {
        files = [...files, ...findFiles(file)]
      } else {
        files.push(file)
      }
    })
    return files
  } catch (error) {
    console.error(`Error when walking dir ${dir}`, error)
  }
}

export function entryFileNames(
  chunkInfo,
  config,
  useFormat = false,
  useHash = true,
  type = 'html'
) {
  let assetsDir = 'html' === type ? cfg.assetsDir + '/' : ''
  let hash = useHash ? '-[hash]' : ''
  let format = useFormat ? '.[format]' : ''
  let finalPath = `${assetsDir}js/[name]${hash}${format}.js`

  if ('named' === type && chunkInfo.isEntry) {
    finalPath = `${assetsDir}js/${config.build.jsFileName}${hash}${format}.js`
  }

  return finalPath
}

export function chunkFileNames(
  chunkInfo,
  config,
  useFormat = false,
  useHash = true,
  type = 'html'
) {
  let assetsDir = 'html' === type ? cfg.assetsDir + '/' : ''
  let hash = useHash ? '-[hash]' : ''
  let format = useFormat ? '.[format]' : ''
  let finalPath = `${assetsDir}js/[name]${hash}${format}.js`

  if ('named' === type && chunkInfo.isEntry) {
    finalPath = `${assetsDir}js/${config.build.jsFileName}${hash}${format}.js`
  }

  return  finalPath
}

export function assetFileNames(
  assetInfo,
  config,
  useHash = true,
  type = 'html'
) {
  const imagesRegExp = new RegExp(/\.(png|jpg|jpeg|jfif|pjpeg|pjp|gif|svg|ico|webp|avif)$/i)
  const mediaRegExp = new RegExp(/\.(mp4|webm|ogg|mp3|wmv|flac|aac)$/i)
  const fontsRegExp = new RegExp(/\.(woff|woff2|eot|ttf|otf)$/i)
  const documentsRegExp = new RegExp(/\.(pdf|txt)$/i)
  const othersRegExp = new RegExp(/\.(webmanifest)$/i)

  let dir = ''
  if ('.css' === path.extname(assetInfo.name)) {
    dir = 'css'
  } else if (imagesRegExp.test(assetInfo.name)) {
    dir = 'images'
  } else if (mediaRegExp.test(assetInfo.name)) {
    dir = 'media'
  } else if (fontsRegExp.test(assetInfo.name)) {
    dir = 'fonts'
  } else if (documentsRegExp.test(assetInfo.name)) {
    dir = 'documents'
  } else if (othersRegExp.test(assetInfo.name)) {
    dir = 'others'
  }

  let assetsDir = 'html' === type ? cfg.assetsDir + '/' : ''
  let hash = useHash ? '-[hash]' : ''
  let finalPath = `${assetsDir}${dir}/[name]${hash}[extname]`

  if ('named' === type && 'css' === dir) {
    finalPath = `${assetsDir}${dir}/${config.build.cssFileName}${hash}[extname]`
  }

  return finalPath
}

export function getMyPackageJson(path) {
  let pkg = {}
  if (fs.existsSync(path)) {
    pkg = require(path)
  }
  return pkg
}

export function getPackageJson() {
  const pkgPath = path.resolve(process.cwd(), 'package.json')

  let pkg = {}
  if (fs.existsSync(pkgPath)) {
    pkg = require(pkgPath)
  }
  return pkg
}

export function ejsRender(template, viteConfig, config, pkg) {
  if (process.env[cfg.envBaseUrlKey].endsWith('/')) {
    template = template.replace(/\~baseUrl\//g, `~baseUrl`)
  }
  template = template
    .replace(/\~baseUrl/g, `<%= env.${cfg.envBaseUrlKey} %>`)
    .replace(/\@root:/g, '/')
    .replace(/\@root:\//g, '/')

  template = ejs.render(
    template,
    {
      NODE_ENV: viteConfig.mode,
      isDev: 'development' === viteConfig.mode,
      env: process.env,
      pkg: pkg
    },
    {
      root: path.resolve(path.join(process.cwd(), config.src.root)),
      async: false
    }
  )

  if (template.includes('~baseUrl') || template.includes('@root:')) {
    template = ejsRender(template, viteConfig, config, pkg)
  }

  return template
}

export function markdownRender(content) {
  marked.setOptions({
    async: false,
    baseUrl: '',
    breaks: true,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    highlight: function(code, lang) {
      const hljs = require('highlight.js')
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
    langPrefix: 'hljs language-',
    mangle: true,
    pedantic: false,
    renderer: new marked.Renderer(),
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartypants: false,
    xhtml: false
  })

  return marked.parse(content)
}

export function minifyHTML(html) {
  return minify(html, {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: false,
    removeEmptyAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true
  })
}

export function createBanner(file, viteConfig, config, pkg) {
  let content = fs.readFileSync(file, { encoding: 'utf8' })
  let template = config?.build?.banner ?? ''
  template = ejsRender(template, viteConfig, config, pkg)
  template = template.trim()
  content = content.trim()
  if (jsRegExp.test(file)) {
    template = '' !== template ? template + '\n' : template
  }
  fs.writeFileSync(file, template + content, { encoding: 'utf-8' })
}

export function newProcessEnv(mode, processEnv, pkg) {
  processEnv = {
    ...processEnv,
    ...loadEnv(mode, process.cwd(), cfg.envPrefix)
  }

  processEnv[cfg.envBaseUrlKey] = (
    processEnv?.[cfg.envBaseUrlKey] ?? cfg.envDefaultBaseUrl
  )
  processEnv[cfg.envAppTitleKey] = (
    processEnv?.[cfg.envAppTitleKey] ?? cfg.envDefaultAppTitle
  )

  if ('development' === mode) {
    try {
      let newBaseUrl = new URL(processEnv[cfg.envBaseUrlKey])
      processEnv[cfg.envBaseUrlKey] = newBaseUrl.pathname
    } catch {}
  }

  return processEnv
}

export function htmlcssjsPreview(config, pkg) {
  let viteConfig
  return {
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
    },
    name: 'htmlcssjs:preview',
    transformIndexHtml: {
      enforce: 'pre',
      transform (html) {
        html = ejsRender(html, viteConfig, config, pkg)

        let mdPattern = new RegExp(`<:markdown:>((.|\\n)*?)</:markdown:>`)
        let mdContent = mdPattern.exec(html)
        mdContent = mdContent ? mdContent[1] : null
        mdContent = mdContent ? markdownRender(mdContent.trim()) : ''
        html = html.replace(/<:markdown:>[\s\S]*?<\/:markdown:>/g, mdContent)

        html = prettier.format(html, {
          parser: 'html',
          printWidth: 1000
        })

        html = html.replace(/\s\/>/g, '>')

        return html
      }
    },
    closeBundle() {
      let dir = path.resolve(process.cwd(), config.out.preview)
      if (fs.existsSync(dir)) {
        const filePaths = findFiles(dir)
        filePaths && filePaths.length && filePaths.forEach((file) => {
          if (cssJsRegExp.test(file) && !vendorRegExp.test(file)) {
            createBanner(file, viteConfig, config, pkg)
          }
        })
      }
    }
  }
}

export function htmlcssjsDist(config, pkg) {
  let viteConfig
  return {
    name: 'htmlcssjs:dist',
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
    },
    closeBundle() {
      let dir = path.resolve(process.cwd(), config.out.dist)
      if (fs.existsSync(dir)) {
        const filePaths = findFiles(dir)
        filePaths && filePaths.length && filePaths.forEach((file) => {
          if (cssJsRegExp.test(file) && !vendorRegExp.test(file)) {
            createBanner(file, viteConfig, config, pkg)
          }
        })
      }
    }
  }
}

export function htmlcssjsLib(config, pkg) {
  let viteConfig
  return {
    name: 'htmlcssjs:dist',
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
    },
    closeBundle() {
      let dir = path.resolve(process.cwd(), config.out.lib)
      if (fs.existsSync(dir)) {
        const filePaths = findFiles(dir)
        filePaths && filePaths.length && filePaths.forEach((file) => {
          if (cssJsRegExp.test(file) && !vendorRegExp.test(file)) {
            createBanner(file, viteConfig, config, pkg)
          }
        })
      }
    }
  }
}

export function htmlcssjsMinifyHTML(config, pkg) {
  let viteConfig
  return {
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
    },
    name: 'htmlcssjs:minify-html',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml: (html) => {
      return 'production' === viteConfig.mode && config.build.minify
        ? minifyHTML(html)
        : html
    }
  }
}

// Copied from https://github.com/marcofugaro/browserslist-to-esbuild
// because there are some important pull-requests that haven't been merged yet,
// or the package is unmaintained.
export function browserslistToEsbuild(browserslistConfig) {
  if (!browserslistConfig) {
    // the path from where the script is run
    const path = process.cwd()

    // read config if none is passed
    browserslistConfig = browserslist.loadConfig({ path })
  }

  const SUPPORTED_ESBUILD_TARGETS = [
    'es',
    'chrome',
    'edge',
    'firefox',
    'ios',
    'node',
    'safari',
    'opera',
    'ie'
  ]

  // https://github.com/eBay/browserslist-config/issues/16#issuecomment-863870093
  const UNSUPPORTED = ['android 4']

  const replaces = {
    ios_saf: 'ios',
    android: 'chrome',
  }

  const separator = ' '

  return (
    browserslist(browserslistConfig)
      // filter out the unsupported ones
      .filter((b) => !UNSUPPORTED.some((u) => b.startsWith(u)))
      // transform into ['chrome', '88']
      .map((b) => b.split(separator))
      // replace the similar browser
      .map((b) => {
        if (replaces[b[0]]) {
          b[0] = replaces[b[0]]
        }

        return b
      })
      // 11.0-12.0 --> 11.0
      .map((b) => {
        if (b[1].includes('-')) {
          b[1] = b[1].slice(0, b[1].indexOf('-'))
        }

        return b
      })
      // 11.0 --> 11
      .map((b) => {
        if (b[1].endsWith('.0')) {
          b[1] = b[1].slice(0, -2)
        }

        return b
      })
      // only get the ones supported by esbuild
      .filter((b) => SUPPORTED_ESBUILD_TARGETS.includes(b[0]))
      // only get the oldest version
      .reduce((acc, b) => {
        const existingIndex = acc.findIndex((br) => br[0] === b[0])

        if (existingIndex !== -1) {
          acc[existingIndex][1] = b[1]
        } else {
          acc.push(b)
        }
        return acc
      }, [])
      // remove separator
      .map((b) => b.join(''))
  )
}
