import fs from 'node:fs'
import path from 'node:path'
import ejs from 'ejs'
import pug from 'pug'
import YAML from 'yaml'
import matter from 'gray-matter'
import beautify from 'js-beautify'
import browserslist from 'browserslist'
import { minify } from 'html-minifier-terser'
import { createRequire } from 'node:module'
import { cfg } from './config.js'
import { marked } from 'marked'
import { loadEnv } from 'vite'

const require = createRequire(import.meta.url)

export const htmlRegExp = new RegExp(/\.(html)$/i)
export const cssRegExp = new RegExp(/\.(css)$/i)
export const jsRegExp = new RegExp(/\.([mc]?js)$/i)
export const htmlCssJsRegExp = new RegExp(/\.(html|css|[mc]?js)$/i)
export const vendorRegExp = new RegExp(/vendor/)

export function viteSharedOptions(options) {
  delete options?.root
  delete options?.base
  delete options?.mode
  delete options?.plugins
  delete options?.publicDir
  delete options?.envDir
  delete options?.envPrefix
  delete options?.appType
  return options
}

export function vitePreviewOptions(options) {
  return options
}

export function viteServerOptions(options) {
  return options
}

export function viteOptimizeOptions(options) {
  return options
}

export function viteSsrOptions(options) {
  return options
}

export function viteWorkerOptions(options) {
  return options
}

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
  type = 'site'
) {
  let assetsDir = type === 'site' ? cfg.assetsDir + '/' : ''
  let name = '[name]'
  let hash = ''
  let format = ''

  if (
    type === 'site' ||
    (type === 'dist' && config.build.js.hash) ||
    (type === 'lib' && config.build.js.hash)
  ) {
    hash = '-[hash]'
  }

  if (type === 'site') {
    name = 'script'
  }

  if ((type === 'dist' || type === 'lib') && chunkInfo.isEntry) {
    name = config.build.js.filename
  }

  return `${assetsDir}js/${name}${hash}${format}.js`
}

export function chunkFileNames(
  chunkInfo,
  config,
  type = 'site'
) {
  let assetsDir = type === 'site' ? cfg.assetsDir + '/' : ''
  let name = '[name]'
  let hash = ''
  let format = ''

  if (
    type === 'site' ||
    (type === 'dist' && config.build.js.hash) ||
    (type === 'lib' && config.build.js.hash)
  ) {
    hash = '-[hash]'
  }

  if (type === 'site') {
    name = 'script'
  }

  if ((type === 'dist' || type === 'lib') && chunkInfo.isEntry) {
    name = config.build.js.filename
  }

  return `${assetsDir}js/${name}${hash}${format}.js`
}

export function assetFileNames(
  assetInfo,
  config,
  type = 'site'
) {
  const imagesRegExp = new RegExp(/\.(png|jpg|jpeg|jfif|pjpeg|pjp|gif|svg|ico|webp|avif)$/i)
  const mediaRegExp = new RegExp(/\.(mp4|webm|ogg|mp3|wmv|flac|aac)$/i)
  const fontsRegExp = new RegExp(/\.(woff|woff2|eot|ttf|otf)$/i)
  const documentsRegExp = new RegExp(/\.(pdf|txt)$/i)
  const othersRegExp = new RegExp(/\.(webmanifest)$/i)

  let dir = ''
  if (path.extname(assetInfo.name) === '.css') {
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

  let assetsDir = type === 'site' ? cfg.assetsDir + '/' : ''
  let name = '[name]'
  let hash = ''

  if (
    type === 'site' ||
    (dir === 'css' && type === 'dist' && config.build.css.hash) ||
    (dir === 'css' && type === 'lib' && config.build.css.hash) ||
    (
      dir !== 'css' &&
      (type === 'dist' || type === 'lib') &&
      config.build.assets.hash
    )
  ) {
    hash = '-[hash]'
  }

  if (type === 'site' && dir === 'css') {
    name = 'style'
  }

  if ((type === 'dist' || type === 'lib') && dir === 'css') {
    name = config.build.css.filename
  }

  return `${assetsDir}${dir}/${name}${hash}[extname]`
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

export function getData(mode, config) {
  const dataPath = path.resolve(process.cwd(), config.src.data)

  let data = {}
  if (fs.existsSync(dataPath)) {
    data = YAML.parse(fs.readFileSync(dataPath, 'utf8'))
  }

  return data
}

export function newProcessEnv(mode, processEnv, config) {
  const data = getData(mode, config)

  processEnv = {
    ...processEnv,
    ...loadEnv(mode, process.cwd(), cfg.envPrefix)
  }

  processEnv[cfg.envDataKey] = data
  processEnv[cfg.envConfigKey] = config

  return processEnv
}

export function pages(
  config,
  parent = '',
  oneLevel = false,
  includeParentPage = true,
  indexFilesOnly = false
) {
  const pages = []
  let dir = path.resolve(process.cwd(), config.src.root)
  if (parent && parent !== 'root') {
    dir = path.resolve(process.cwd(), config.src.root, parent)
  }
  if (fs.existsSync(dir)) {
    const filePaths = findFiles(dir)
    filePaths && filePaths.length && filePaths.forEach((file) => {
      if (htmlRegExp.test(file)) {
        let _path = path.join('/', path.relative(config.src.root, file))
        _path = _path.replace(/\\/g, '/')

        if (_path.endsWith('/index.html')) {
          if (_path === '/index.html') {
            _path = '/'
          } else {
            _path = path.dirname(_path) + '/'
          }
        }

        let content = fs.readFileSync(file, 'utf8')
        let fm = matter(content)
        fm.data.title = fm?.data?.title ?? null
        fm.isHomepage = _path === '/'
        fm.path = _path
        fm.url = _path

        if (
          parent &&
          parent !== 'root' &&
          oneLevel &&
          (
            path.dirname(file).replace(/\\/g, '/').endsWith('/' + parent) ||
            path.dirname(path.dirname(file)).replace(/\\/g, '/').endsWith('/' + parent)
          )
        ) {
          if (
            !includeParentPage &&
            !file.replace(/\\/g, '/').endsWith('/' + parent + '/index.html')
          ) {
            if (indexFilesOnly && file.replace(/\\/g, '/').endsWith('/index.html')) {
              pages.push(fm)
            }
            if (!indexFilesOnly) {
              pages.push(fm)
            }
          }
          if (includeParentPage) {
            if (indexFilesOnly && file.replace(/\\/g, '/').endsWith('/index.html')) {
              pages.push(fm)
            }
            if (!indexFilesOnly) {
              pages.push(fm)
            }
          }
        }

        if (parent && parent !== 'root' && !oneLevel) {
          if (
            !includeParentPage &&
            !file.replace(/\\/g, '/').endsWith('/' + parent + '/index.html')
          ) {
            if (indexFilesOnly && file.replace(/\\/g, '/').endsWith('/index.html')) {
              pages.push(fm)
            }
            if (!indexFilesOnly) {
              pages.push(fm)
            }
          }
          if (includeParentPage) {
            if (indexFilesOnly && file.replace(/\\/g, '/').endsWith('/index.html')) {
              pages.push(fm)
            }
            if (!indexFilesOnly) {
              pages.push(fm)
            }
          }
        }

        if (
          parent === 'root' &&
          oneLevel &&
          (
            path.dirname(file).replace(/\\/g, '/').endsWith('/' + path.basename(config.src.root)) ||
            path.dirname(path.dirname(file)).replace(/\\/g, '/').endsWith('/' + path.basename(config.src.root))
          )
        ) {
          if (
            !includeParentPage &&
            !file.replace(/\\/g, '/').endsWith('/' + path.basename(config.src.root) + '/index.html')
          ) {
            if (indexFilesOnly && file.replace(/\\/g, '/').endsWith('/index.html')) {
              pages.push(fm)
            }
            if (!indexFilesOnly) {
              pages.push(fm)
            }
          }
          if (includeParentPage) {
            if (indexFilesOnly && file.replace(/\\/g, '/').endsWith('/index.html')) {
              pages.push(fm)
            }
            if (!indexFilesOnly) {
              pages.push(fm)
            }
          }
        }

        if (!parent && !oneLevel) {
          if (indexFilesOnly && file.replace(/\\/g, '/').endsWith('/index.html')) {
            pages.push(fm)
          }
          if (!indexFilesOnly) {
            pages.push(fm)
          }
        }
      }
    })
  }
  return pages.sort((a, b) => a.url.localeCompare(b.url, undefined, { numeric: true }))
}

export function page(config, pathToPage) {
  let file = path.resolve(process.cwd(), config.src.root, pathToPage)
  if (fs.existsSync(file)) {
    let _path = path.join('/', path.relative(config.src.root, pathToPage))
    _path = _path.replace(/\\/g, '/')

    if (_path.endsWith('/index.html')) {
      if (_path === '/index.html') {
        _path = '/'
      } else {
        _path = path.dirname(_path) + '/'
      }
    }

    let content = fs.readFileSync(file, 'utf8')
    let fm = matter(content)
    fm.data.title = fm?.data?.title ?? null
    fm.isHomepage = _path === '/'
    fm.path = _path
    fm.url = _path

    return fm
  }
  return {}
}

export function ejsRender(
  template,
  filename,
  viteConfig,
  config,
  pkg,
  fm = {}
) {
  template = ejs.render(
    template,
    {
      NODE_ENV: viteConfig.mode,
      isDev: viteConfig.mode === 'development',
      config: config,
      env: process.env,
      pkg: pkg,
      data: getData(viteConfig.mode, config),
      page: fm,
      pages: pages(config),
      find_page: function (pathToPage) {
        return page(config, pathToPage)
      },
      find_pages: function (
        parent = 'pages',
        oneLevel = false,
        includeParentPage = true,
        indexFilesOnly = false
      ) {
        return pages(config, parent, oneLevel, includeParentPage, indexFilesOnly)
      }
    },
    {
      root: path.resolve(path.join(process.cwd(), config.src.root)),
      filename: filename,
      async: false
    }
  )

  return template
}

export function pugRender(
  template,
  filename,
  viteConfig,
  config,
  pkg,
  fm = {}
) {
  template = pug.render(template, {
    basedir: config.src.root,
    filename: filename,
    config: config,
    env: process.env,
    pkg: pkg,
    data: getData(viteConfig.mode, config),
    page: fm,
    pages: pages(config),
    find_page: function (pathToPage) {
      return page(config, pathToPage)
    },
    find_pages: function (
      parent = 'pages',
      oneLevel = false,
      includeParentPage = true,
      indexFilesOnly = false
    ) {
      return pages(config, parent, oneLevel, includeParentPage, indexFilesOnly)
    },
    filters: {
      'ejs': function(text, _options) {
        return ejsRender(text, filename, viteConfig, config, pkg, fm)
      },
      'markdown': function(text, options) {
        if (options?.pug) {
          text = pugRender(text, filename, viteConfig, config, pkg, fm)
        }
        return markdownRender(text, filename, viteConfig, config, pkg, fm)
      }
    }
  })

  return template
}

export function markdownRender(
  content,
  filename,
  viteConfig,
  config,
  pkg,
  fm = {}
) {
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

  content = ejsRender(content, filename, viteConfig, config, pkg, fm)
  content = marked.parse(content)

  return content
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
  let content = fs.readFileSync(file, 'utf8')
  let template = ''
  if (htmlRegExp.test(file)) template = config.build.html.banner ?? ''
  if (cssRegExp.test(file)) template = config.build.css.banner ?? ''
  if (jsRegExp.test(file)) template = config.build.js.banner ?? ''
  template = ejsRender(template, file, viteConfig, config, pkg)
  template = template.trim()
  content = content.trim()
  if (htmlRegExp.test(file) || jsRegExp.test(file)) {
    template = template !== '' ? template + '\n' : template
  }
  fs.writeFileSync(file, template + content, { encoding: 'utf-8' })
}

export function htmlcssjsSite(config, pkg) {
  let viteConfig
  return {
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
    },
    name: 'htmlcssjs:site',
    transformIndexHtml: {
      enforce: 'pre',
      transform (html, ctx) {
        let base = config.base
        if (viteConfig.mode === 'development') {
          try {
            let newBase = new URL(base)
            base = newBase.pathname
          } catch {}
        }

        let _path = ctx.path
        if (_path.endsWith('/index.html')) {
          if (_path === '/index.html') {
            _path = '/'
          } else {
            _path = path.dirname(_path) + '/'
          }
        }

        let fm = matter(html)
        fm.data.title = fm?.data?.title ?? null
        fm.isHomepage = _path === '/'
        fm.path = _path
        fm.url = _path

        html = html.replace(/\s*---.*?---\s*/s, '')

        try {
          html = pugRender(html, ctx.filename, viteConfig, config, pkg, fm)
        } catch {}

        html = ejsRender(html, ctx.filename, viteConfig, config, pkg, fm)

        html = html.replace(
          new RegExp(`(^|\\n)([ \\t]*)<:markdown:>([\\s\\S]*?)</:markdown:>`, 'g'),
          (full, start, dent, mdContent) => {
            if (mdContent) {
              if (dent) {
                // Remove outer HTML indent
                mdContent = mdContent.split('\n' + dent).join('\n');
              }
              // console.log('<pre>' + mdContent + '</pre>');
              let m = /^\n([ \t]+)/.exec(mdContent);
              if (m && m[1]) {
                // Remove inner HTML indent
                mdContent = mdContent.split('\n' + m[1]).join('\n');
              }
              // console.log('<pre>' + mdContent + '</pre>');
              return markdownRender(
                mdContent, ctx.filename, viteConfig, config, pkg, fm
              )
            }
            return ''
          }
        )

        html = html.replace(
          /(<a\s*[^>]*(href="([^>^\"]*)")[^>]*>)([^<]+)(<\/a>)/gi,
          (full, start, href, url, text, end) => {
            const filename = ctx.filename.replace(/\\/g, '/')
            const cwd = process.cwd().replace(/\\/g, '/')
            const fileDir = path.dirname(filename)
              .split(cwd)[1]
              .substring(1)
              .replace(/\\/g, '/')

            if (url.startsWith('.')) {
              let urlToFilePath = path.resolve(fileDir, url)
              let urlPath = path.relative(
                path.join(fileDir.split('/')[0]),
                urlToFilePath
              ).replace(/\\/g, '/')
              let urlSep = (
                !base.endsWith('/') && !urlPath.startsWith('/') ? '/' : ''
              )
              let newUrl = (base + urlSep + urlPath)
              if (!newUrl.endsWith('.html') && !newUrl.endsWith('/')) {
                newUrl = newUrl + '/'
              }
              if (newUrl.endsWith('/index.html')) {
                if (newUrl === './index.html' || newUrl === '/index.html') {
                  newUrl = '/'
                } else {
                  newUrl = path.dirname(newUrl) + '/'
                }
              }
              if (newUrl.endsWith('//')) {
                newUrl = newUrl.slice(0, -2)
              }
              full = full.replace(url, newUrl)
            } else if (url.startsWith('/')) {
              let newUrl = (
                base.endsWith('/')
                ? (base.slice(0, -1) + url)
                : (base + url)
              )
              if (!newUrl.endsWith('.html') && !newUrl.endsWith('/')) {
                newUrl = newUrl + '/'
              }
              if (newUrl.endsWith('/index.html')) {
                if (newUrl === './index.html' || newUrl === '/index.html') {
                  newUrl = '/'
                } else {
                  newUrl = path.dirname(newUrl) + '/'
                }
              }
              if (newUrl.endsWith('//')) {
                newUrl = newUrl.slice(0, -2)
              }
              full = full.replace(url, newUrl)
            }

            return full
          }
        )

        html = beautify.html(html, {
          end_with_newline: false,
          eol: '\n',
          extra_liners: [],
          indent_char: ' ',
          indent_inner_html: true,
          indent_size: 2,
          indent_with_tabs: false,
          css: {
            end_with_newline: false,
            eol: '\n',
            indent_char: ' ',
            indent_size: 2,
            indent_with_tabs: false,
            newline_between_rules: false,
            selector_separator_newline: true,
            space_around_combinator: true
          },
          js: {
            end_with_newline: false,
            eol: '\n',
            indent_char: ' ',
            indent_size: 2,
            indent_with_tabs: false,
            preserve_newlines: false,
            space_after_anon_function: true,
            space_after_named_function: false,
            space_in_empty_paren: false,
            space_in_paren: false
          }
        })

        return html
      }
    },
    closeBundle() {
      const dir = path.resolve(process.cwd(), config.out.site.dest)
      if (fs.existsSync(dir)) {
        const filePaths = findFiles(dir)
        filePaths && filePaths.length && filePaths.forEach((file) => {
          if (htmlCssJsRegExp.test(file) && !vendorRegExp.test(file)) {
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
      const dir = path.resolve(process.cwd(), config.out.dist.dest)
      if (fs.existsSync(dir)) {
        const filePaths = findFiles(dir)
        filePaths && filePaths.length && filePaths.forEach((file) => {
          if (htmlCssJsRegExp.test(file) && !vendorRegExp.test(file)) {
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
    name: 'htmlcssjs:lib',
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
    },
    closeBundle() {
      const dir = path.resolve(process.cwd(), config.out.lib.dest)
      if (fs.existsSync(dir)) {
        const filePaths = findFiles(dir)
        filePaths && filePaths.length && filePaths.forEach((file) => {
          if (htmlCssJsRegExp.test(file) && !vendorRegExp.test(file)) {
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
      return (
        viteConfig.mode === 'production' && config.build.html.minify
        ? minifyHTML(html)
        : html
      )
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
