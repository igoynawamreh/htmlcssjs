# HTML:CSS:JS

The simplest, fastest and leanest way to develop HTML, CSS and JS. Powered by [Vite](https://vitejs.dev/).

[Examples](https://github.com/igoynawamreh/htmlcssjs/tree/main/examples) · [Awesome Lists](https://github.com/igoynawamreh/htmlcssjs/blob/main/htmlcssjs.md)

## Key Features

- Supports ESM, EJS, Pug, Markdown, PostCSS, CSS Modules, Sass, Stylus, and Less out of the box.
- Produces CSS and JS bundle and its assets. And also produces HTML pages that can be used for static site, documentation page, preview page, etc that is suitable to be served over a static hosting service.
- Auto-organized static assets like images, fonts and other file types.
- You can use this tool with zero-config or extend using [`htmlcssjs.config.js`](#htmlcssjsconfigjs).
- Can easily develop themes using popular web frameworks like [Bootstrap](https://getbootstrap.com/), [Tailwind CSS](https://tailwindcss.com/), [Bulma](https://bulma.io/) and more.
- Build your awesome HTML:CSS:JS themes!

## Getting Started

### Installation

```bash
npm install htmlcssjs --save-dev
```

### Commands

| Command | Description |
| ------- | ----------- |
| `htmlcssjs dev` | Start dev (and server if `index.html` entry point exists) and rebuilds when source files have changed. |
| `htmlcssjs prod` | Build for production. |
| `htmlcssjs preview` | Locally preview production build (if `index.html` entry point exists). It's an easy way to check if the production build looks OK in your local environment. |
| `htmlcssjs vite` | Run Vite commands. |

### Example `package.json`

```json
{
  "name": "my-awesome-theme",
  "scripts": {
    "dev": "htmlcssjs dev",
    "prod": "htmlcssjs prod",
    "preview": "htmlcssjs preview",
    "custom-example": "htmlcssjs vite build --config node_modules/htmlcssjs/vite.config.site.js"
  },
  "devDependencies": {
    "htmlcssjs": "..."
  }
}
```

## Project Structure

You just need at least one entry point `index.html`, `index.js` and/or [`index.lib.js`](#using-library-mode) in `src` directory. The other files and directories can be flexibly arranged to your needs.

```text
.
├── build/ # auto-generated
│   ├── dist/
│   │   ├── css/
│   │   ├── documents/
│   │   ├── fonts/
│   │   ├── images/
│   │   ├── js/
│   │   ├── media/
│   │   └── others/
│   └── site/
│       ├── assets/
│       │   ├── css/
│       │   ├── documents/
│       │   ├── fonts/
│       │   ├── images/
│       │   ├── js/
│       │   ├── media/
│       │   └── others/
│       ├── example-pages/
│       │   ├── foo.html
│       │   └── page-1/
│       │       └── index.html
│       └── index.html
├── public/
└── src/
    ├── @example-assets/
    │   ├── example-images/
    │   │   └── foo.png
    │   ├── example-fonts/
    │   │   └── foo.woff2
    │   └── example-media/
    │       └── foo.mp4
    ├── @example-css/
    │   └── foo.[css|module.css|scss|styl|less]
    ├── @example-js/
    │   └── foo.js
    ├── example-pages/
    │   ├── foo.html
    │   └── page-1/
    │       └── index.html
    ├── index.html
    └── index.js
```

### The Entry Points

- `src/index.html`: The HTML entry point.
- `src/index.js`: The JS entry point.

### The `public` Directory

Assets that are never referenced in source code (e.g. `favicon.ico`, `robots.txt`, etc)

### The Source Code and Static Assets

You can add HTML, CSS, JS, images, fonts and more in `src` directory in a modularized fashion.

#### Source code

The CSS and JS source code must be imported in `src/index.js` entry point.

#### Static assets

When a static assets like images, fonts, etc is used in source code, it will be automatically emitted and organized to their build destination. Known file types:

- `documents`: `.(pdf|txt)`
- `fonts`: `.(woff|woff2|eot|ttf|otf)`
- `images`: `.(png|jpg|jpeg|jfif|pjpeg|pjp|gif|svg|ico|webp|avif)`
- `media`: `.(mp4|webm|ogg|mp3|wmv|flac|aac)`
- `others`: `.(webmanifest)`

### The Production Build

- `build/dist`: The final production CSS, JS and its assets (without HTML files).
- `build/site`: The final production HTML, CSS, JS and its assets.

The difference between `build/dist` and `build/site`:

- The `build/dist` is ready-to-use production build. It can be used in your app or anywhere.
  - You can copy all files and directories in `build/dist/` to your app.
  - Or you can [configure](#htmlcssjsconfigjs) the `out.dist.dest` config option to match your app structure, so you can use it directly without having to copy it manually.
- The `build/site` is a static site, and is suitable to be served over a static hosting service.
  - It can be used to create a static site.
  - It can be used to create documentation pages for your themes, components, layouts, etc.
  - It can be used to provide a live preview of your themes, components, layouts, etc.

## Guide

### Configure Base Path

If you want to serve the `build/site` to a hosting service you must specify the `base` option in [`htmlcssjs.config.js`](#htmlcssjsconfigjs) file.

For example, if you want to serve the `build/site` to `https://example.com/`, then set `base` to `https://example.com/` or just `/`.

Or, if you want to serve the `build/site` to `https://example.com/my-themes/`, then set `base` to `https://example.com/my-themes/` or just `/my-themes/`.

```js
// # htmlcssjs.config.js

export default {
  base: '/my-themes/'
}
```

### Targeting Browser

You can add [`.browserslistrc`](https://github.com/browserslist/browserslist) file in the root directory to target browser compatibility for CSS and JS.

Example `.browserslistrc` config:

```text
>= 0.5%
last 2 major versions
not dead
```

### Env Variables

The env variables is loaded from the following files in the root directory:

```text
.env                   # loaded in all cases
.env.local             # loaded in all cases, ignored by git
.env.development       # only loaded in development mode
.env.development.local # only loaded in development mode, ignored by git
.env.production        # only loaded in production mode
.env.production.local  # only loaded in production mode, ignored by git
```

#### Env Loading Priorities

An env file for a specific mode (e.g. `.env.production`) will take higher priority than a generic one (e.g. `.env`).

#### Env Variable Prefix

Only variables prefixed with `APP_` are exposed.

### Using Variables

You can use variables loaded from the following files:

- `src/data.yml` (`data`)
- `.env` (`env`)
- `htmlcssjs.config.js` (`config`)
- `package.json` (`pkg`)

HTML (EJS):

```html
<p><%= data.key_name %></p>
<p><%= env.APP_KEY_NAME %></p>
<p><%= config.key_name %></p>
<p><%= pkg.key_name %></p>
```

HTML (Pug):

```html
p #{data.key_name}
p #{env.APP_KEY_NAME}
p #{config.key_name}
p #{pkg.key_name}
```

JS:

```js
console.log(import.meta.env.APP_DATA.key_name) // src/data.yml
console.log(import.meta.env.APP_KEY_NAME) // .env
console.log(import.meta.env.APP_CONFIG.key_name) // htmlcssjs.config.js
console.log(import.meta.env.APP_PKG.key_name) // package.json
```

### Using YAML Front Matter Block in HTML Page

You can use YAML front matter block in HTML page and use the data using `page` or `find_page()` variable. You can also get data from all pages using `pages` or `find_pages()` variable:

```js
find_page(pathToPage) // 'path/to/page.html'
find_pages(parent = 'pages', oneLevel = false, includeParentPage = true, indexFilesOnly = false)
```

Predefined variables:

- `page.content`
- `page.data`
- `page.url` or `page.path`
- `page.isHomepage`
- `page.isEmpty`

Basic example:

```html
<!-- # src/index.html -->

---
title: Page Title
---

Content
```

- `page.data.title`: Page Title
- `page.content`: Content
- `page.url`: `/index.html`
- `page.isHomepage`: `true`
- `page.isEmpty`: `false`

Example using EJS:

```html
<!-- # src/pages/page-1.html -->

---
title: Page 1
---

<h1><%= page.data.title %></h1>
```

```html
<!-- # src/pages/page-2.html -->

---
title: Page 2
---

<h1><%= page.data.title %></h1>
```

```html
<!-- # src/pages/index.html -->

---
title: Pages
---

<h1><%= page.data.title %></h1>

<ul>
  <% find_pages('pages', true, false).forEach((p) => { %>
    <li>
      <a href="<%= p.url %>"><%= p.data.title %></a>
    </li>
  <% }) %>
</ul>
```

```html
<!-- # src/index.html -->

---
title: Home
---

<% var nav = find_pages('root', true, true, true) %>

<nav>
  <% nav.forEach((p) => { %>
    <a href="<%= p.url %>"><%= p.data.title %></a>
  <% }) %>
</nav>
```

### Source Code and Static Assets

#### Paths

- `/file.ext`: Relative to the `src` directory.
- `./file.ext` or `../../file.ext`: Relative to the current file directory.

For example:

- Page path: `src/pages/page.html`
- Image path: `src/images/image.png`

```html
<!-- # src/pages/page.html -->

<!-- Relative to the `src` directory -->
<img src="/images/image.png">
<!-- Relative to the current file directory -->
<img src="../images/image.png">
```

#### HTML Template

You can use [EJS](https://ejs.co/) and [Pug](https://pugjs.org/) in HTML page.

#### Importing JS Entry Point (`src/index.js`) to HTML page

```html
<script type="module" src="/index.js"></script>
```

#### Importing Styles to JS Entry Point (`src/index.js`)

```js
// # src/index.js

import './css/foo.css'
// import './css/foo.scss'
// import './css/foo.styl'
// import './css/foo.less'
```

#### Using Static Assets in HTML, CSS and JS

HTML (EJS):

```html
<img src="/path/to/image.png">
```

HTML (Pug):

```html
img(src='/path/to/image.png')
```

CSS:

```css
.foo {
  background-color: url(/path/to/image.png);
}
```

JS:

```js
import image from '/path/to/image.png'
document.querySelector('#el').src = image
```

#### Including HTML Template

EJS:

```html
<%- include('/path/to/template.ejs') -%>
```

Pug:

```html
include /path/to/template.pug
```

#### Links Between Pages

Links in HTML page will be automatically resolved based on the `base` value in [`htmlcssjs.config.js`](#htmlcssjsconfigjs).

Paths:

- `/path/to/file.html`: Relative to the `src` directory.
- `./path/to/file.html` or `../../path/to/file.html`: Relative to the current file directory.
- `/path/foo/`: Same as `/path/foo/index.html`
- `./path/foo/`: Same as `./path/foo/index.html`

Example:

Let's say the value of `base` option is `https://example.com/docs/`.

```html
<!-- # src/index.html -->

<a href="/">Home</a>
<a href="/index.html">Home</a>
<a href="./index.html">Home</a>

<a href="/pages/page-1/">Page 1</a>
<a href="/pages/page-1/index.html">Page 1</a>
<a href="./pages/page-1/">Page 1</a>
<a href="./pages/page-1/index.html">Page 1</a>
```

Output:

```html
<a href="https://example.com/docs/">Home</a>
<a href="https://example.com/docs/">Home</a>
<a href="https://example.com/docs/">Home</a>

<a href="https://example.com/docs/pages/page-1/">Page 1</a>
<a href="https://example.com/docs/pages/page-1/">Page 1</a>
<a href="https://example.com/docs/pages/page-1/">Page 1</a>
<a href="https://example.com/docs/pages/page-1/">Page 1</a>
```

#### Using Markdown in Pug

You can write Markdown in Pug template using `:markdown` filter. You can also use EJS syntax inside the `:markdown` filter.

```html
block content
  :markdown
    # [<%= data.title %>](https://github.com/igoynawamreh/htmlcssjs)

    [Go to page one](/path/to/page-1/)

    [Back to home](/)

    ![My Image](./path/to/image.png)
```

```html
block content
  :markdown(pug) include ./path/to/page.md
```

#### Using Markdown in EJS/HTML

You can write Markdown in EJS/HTML template using `:markdown:` tag. You can also use EJS inside the `:markdown:` tag.

Example:

```html
<html>
  <body>
    <div class="content">
      <:markdown:>
        # [<%= data.title %>](https://github.com/igoynawamreh/htmlcssjs)

        [Go to page one](/path/to/page-1/)

        [Back to home](/)

        ![My Image](./path/to/image.png)

        <%- include('./path/to/file.md') -%>
      </:markdown:>
    </div>

    <div class="code">
      <:markdown:>
        ```js
        console.log('M')
        console.log('A')
        console.log('R')
        console.log('K')
        console.log('D')
        console.log('O')
        console.log('W')
        console.log('N')
        ```
      </:markdown:>
    </div>
  </body>
<html>
```

#### Using EJS in Pug

You can use EJS/HTML syntax in Pug using `:ejs` filter.

Example:

```html
<!-- hello-world.ejs -->

<div class="hello-world">
  <p>Hello, world!</p>
</div>
```

```html
<!-- page.html -->

block content
  :ejs <%- include('./hello-world.ejs') -%>
```

## Using Library Mode

Create `index.lib.js` file in the `src` directory to create library. Now, the `htmlcssjs prod` command will produces `build/lib` directory.

By default, the library mode produces `ES` and `UMD` format. You can override the default config in [`htmlcssjs.config.js`](#htmlcssjsconfigjs) to change the formats:

```js
// # htmlcssjs.config.js

...
build: {
  js: {
    libFormats: ['es', 'cjs', 'umd', 'iife'],
    name: 'MyLib'
  }
}
...
```

Note that when using static assets in library mode, the asset will be inlined (not emitted/extracted), for example:

```js
// # src/index.lib.js

import image from 'image.png'

const myImage = image
```

Compiled code:

```js
const myImage = 'data:image/png;base64,...'
```

Read more about [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode).

## `htmlcssjs.config.js`

You can override and extend the default config by creating `htmlcssjs.config.js` file in the root directory.

### Default Config

The default config can be found in [`htmlcssjs.config.js`](https://github.com/igoynawamreh/htmlcssjs/blob/main/htmlcssjs.config.js).

Vite options:

- `viteOptions.shared` - [See Vite Shared Options](https://vitejs.dev/config/shared-options.html) except `root`, `base`, `mode`, `plugins`, `publicDir`, `envDir`, `envPrefix`, `appType`
- `viteOptions.preview` - [See Vite Preview Options](https://vitejs.dev/config/preview-options.html)
- `viteOptions.server` - [See Vite Server Options](https://vitejs.dev/config/server-options.html)
- `viteOptions.optimize` - [See Vite Dep Optimization Options](https://vitejs.dev/config/dep-optimization-options.html)
- `viteOptions.ssr` - [See Vite SSR Options](https://vitejs.dev/config/ssr-options.html)
- `viteOptions.worker` - [See Vite Worker Options](https://vitejs.dev/config/worker-options.html)

### Override Default Config

Example to override a few config only:

```js
// # htmlcssjs.config.js

const banner = `
/*!
 * Package name: <%= pkg.name %>
 * App title: <%= data.title %>
 */
`

const htmlBanner = `
<!--
<%= pkg.repository.url %>
-->
`

export default {
  build: {
    html: {
      banner: htmlBanner
    },
    css: {
      banner: banner
    },
    js: {
      banner: banner
    }
  }
}
```

You can disable `site`, `dist` and/or `lib` build:

```js
// # htmlcssjs.config.js

export default {
  out: {
    site: {
      dest: './build/site',
      clean: true
    },
    dist: false,
    lib: false
  }
}
```

Add Vite plugins:

```js
// # htmlcssjs.config.js

import awesomeVitePlugin from 'x'

function myVitePlugin() {
  let viteConfig
  return {
    name: 'my-vite-plugin',
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
    },
    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Title replaced!</title>`
        )
      }
    }
  }
}

function sitePlugin() { ... }
function distPlugin() { ... }
function libPlugin() { ... }

export default {
  vitePlugins: {
    site: [
      myVitePlugin(),
      awesomeVitePlugin(),
      sitePlugin()
    ],
    dist: [
      myVitePlugin(),
      awesomeVitePlugin(),
      distPlugin()
    ],
    lib: [
      myVitePlugin(),
      awesomeVitePlugin(),
      libPlugin()
    ]
  }
}
```
