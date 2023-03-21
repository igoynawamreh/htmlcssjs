# HTML:CSS:JS

The simplest, fastest and leanest way to develop HTML, CSS and JS. Powered by [Vite](https://vitejs.dev/).

## Key Features

- Supports ESM, PostCSS, CSS Modules, Sass, Stylus, and Less out of the box.
- Produces CSS and JS bundle and its assets. And also produces HTML pages that can be used for static site, documentation and preview page that is suitable to be served over a static hosting service.
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
| `htmlcssjs dev` | Start dev server (if `index.html` entry point exists) and rebuilds when source files have changed. |
| `htmlcssjs prod` | Build for production. |
| `htmlcssjs vite` | Run Vite commands. |

### Example `package.json`

```json
{
  "name": "my-awesome-theme",
  "scripts": {
    "dev": "htmlcssjs dev",
    "prod": "htmlcssjs prod",
    "custom-example": "htmlcssjs vite build --config node_modules/htmlcssjs/vite.config.preview.js"
  },
  "devDependencies": {
    "htmlcssjs": "..."
  }
}
```

## Project Structure

You just need at least one entry point `index.html`, `index.js` and/or [`index.lib.js`](#add-library-mode) in `src` directory. The other files and directories can be flexibly arranged to your needs.

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
│   └── preview/
│       ├── assets/
│       │   ├── css/
│       │   ├── documents/
│       │   ├── fonts/
│       │   ├── images/
│       │   ├── js/
│       │   ├── media/
│       │   └── others/
│       ├── example-pages/
│       │   └── page-one/
│       │       └── index.html
│       └── index.html
├── public/
└── src/
    ├── example-files/
    │   ├── example-images/
    │   │   └── foo.png
    │   ├── example-fonts/
    │   │   └── foo.woff2
    │   └── example-media/
    │       └── foo.mp4
    ├── example-css/
    │   └── foo.[css|module.css|scss|styl|less]
    ├── example-js/
    │   └── foo.js
    ├── example-pages/
    │   └── page-one/
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

Source code:

- The CSS and JS source code must be imported in `src/index.js` entry point.

Static assets:

- When a static assets like images, fonts, etc is used in source code, it will be automatically emitted and organized to `build/dist/[file-types]/` and `build/preview/assets/[file-types]/`. Known file types:
  - `documents`: `.(pdf|txt)`
  - `fonts`: `.(woff|woff2|eot|ttf|otf)`
  - `images`: `.(png|jpg|jpeg|jfif|pjpeg|pjp|gif|svg|ico|webp|avif)`
  - `media`: `.(mp4|webm|ogg|mp3|wmv|flac|aac)`
  - `others`: `.(webmanifest)`

### The Production Build

The `htmlcssjs prod` command produces `build/dist` and `build/preview` directory.

- `build/dist`: The final production CSS, JS and its assets (without HTML files).
- `build/preview`: The final production HTML, CSS, JS and its assets.

The difference between `build/dist` and `build/preview`:

- The `build/dist` is ready-to-use production build. It can be used in your app or anywhere.
  - You can copy all files and directories in `build/dist/` to your app.
  - Or you can [configure](#htmlcssjsconfigjs) the `out.dist` config to match your app structure, so you can use it directly without having to copy it manually.
- The `build/preview` is a static site, and is suitable to be served over a static hosting service.
  - It can be used to create a static site.
  - It can be used to document your themes, components, layouts, etc.
  - It can be used to provide a live preview of your themes, components, layouts, etc for you or for your client.

## Guide

### Configure Base URL

If you want to served the `build/preview` to a hosting service you must specify the `APP_BASE_URL` option in `.env` file.

For example, if you want to served the pages to `https://example.com/`, then set `APP_BASE_URL` to `https://example.com/` or just `/`.

Or, if you want to served the pages to `https://example.com/my-themes/`, then set `APP_BASE_URL` to `https://example.com/my-themes/` or just `/my-themes/`.

```shell
# .env

APP_BASE_URL="/my-themes/"
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

#### `.env` Files

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

#### Using Env Variables

Only variables prefixed with `APP_` are exposed.

The env variables is only accessible in HTML and JS.

HTML:

```html
<p><%= env.APP_KEY_NAME %></p>
```

JS:

```js
console.log(import.meta.env.APP_KEY_NAME)
```

### Source Code and Static Assets

#### Example Project Structure

```text
.
└── src/
    ├── example-files/
    │   ├── example-images/
    │   │   └── foo.png
    │   ├── example-fonts/
    │   │   └── foo.woff2
    │   └── example-media/
    │       └── foo.mp4
    ├── example-css/
    │   └── foo.css
    ├── example-js/
    │   └── foo.js
    ├── example-pages/
    │   └── page-one/
    │       └── index.html
    ├── html-template/
    │   └── hero.ejs
    ├── index.html
    └── index.js
```

#### Importing JS Entry Point (`src/index.js`) to HTML Entry Point (`src/index.html`)

```html
<!-- src/index.html -->

...
<body>
  ...
  <script type="module" src="@root:index.js"></script>
</body>
...
```

#### Importing Styles to JS Entry Point

```js
// src/index.js

import './example-css/foo.css'
// import './example-css/foo.scss'
// import './example-css/foo.styl'
// import './example-css/foo.less'
```

#### Importing Separate JS to JS Entry Point

```js
// src/index.js

import { x } from './example-js/foo'
```

#### Using Static Assets in CSS and JS

The path is always relative to the current file directory.

```css
/* src/example-css/foo.css */

.foo {
  background-color: url(../example-files/example-images/foo.png);
}
```

```js
// src/example-js/foo.js

import imgUrl from '../example-files/example-images/foo.png'
document.querySelector('#hero-img').src = imgUrl
```

#### HTML Template

We uses [EJS](https://ejs.co/) for HTML templating.

#### Using Variables in HTML Template

You can use data from `.env` and `package.json`:

```html
<%= env.APP_KEY_NAME %>
<%= pkg.keyName %>
```

#### Using Static Assets in HTML Template

```html
<!-- src/example-pages/page-one/index.html -->

<!-- Relative to the `src` directory (recommended when using modular template) -->
<!-- Use `@root` (recommended) or `/` -->
<img src="@root:example-files/example-images/foo.png" alt="Image">

<!-- Relative to the current file directory -->
<img src="../../example-files/example-images/foo.png" alt="Image">
```

#### Including HTML Template

The path rules are the same as when using static assets above.

```html
<!-- src/example-pages/page-one/index.html -->

...
<body>
  <%- include('@root:html-template/hero.ejs') -%>
</body>
...
```

#### Links Between Pages

Please always use `~baseUrl`.

```html
<!-- src/index.html -->

<a href="~baseUrl/example-pages/page-one/">Go to page one</a>
```

```html
<!-- src/example-pages/page-one/index.html -->

<a href="~baseUrl">Back to home</a>
```

## Add Library Mode

Create `index.lib.js` file in the `src` directory to create library. Now, the `htmlcssjs prod` command will produces `build/lib` directory.

The library mode produces `ES` and `UMD` format.

Note that when using static assets in library mode, the asset will be inlined (not emitted/extracted).

Example:

```js
// src/index.lib.js

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

```js
export default {
  src: {
    root: './src',
    public: './public'
  },
  out: {
    dist: './build/dist',
    preview: './build/preview',
    lib: './build/lib'
  },
  build: {
    cssFileName: 'app',
    jsFileName: 'app',
    banner: '',
    sourcemap: false
  },
  viteSharedOptions: {},
  viteServerOptions: {
    host: 'localhost',
    port: 1505
  },
  vitePreviewOptions: {},
  viteOptimizeOptions: {},
  viteSsrOptions: {},
  viteWorkerOptions: {},
  vitePlugins: []
}
```

- `viteSharedOptions` - [See Vite Shared Options](https://vitejs.dev/config/shared-options.html) except `root`, `base`, `mode`, `plugins`, `publicDir`, `envDir`, `envPrefix`, `appType`
- `viteServerOptions` - [See Vite Server Options](https://vitejs.dev/config/server-options.html)
- `vitePreviewOptions` - [See Vite Preview Options](https://vitejs.dev/config/preview-options.html)
- `viteOptimizeOptions` - [See Vite Dep Optimization Options](https://vitejs.dev/config/dep-optimization-options.html)
- `viteSsrOptions` - [See Vite SSR Options](https://vitejs.dev/config/ssr-options.html)
- `viteWorkerOptions` - [See Vite Worker Options](https://vitejs.dev/config/worker-options.html)

### Override Default Config

Example to override a few config only:

```js
// htmlcssjs.config.js

const banner = `
/*!
 * Package name: <%= pkg.name %>
 * App title: <%= env.APP_TITLE %>
 */
`

export default {
  build: {
    banner: banner
  }
}
```

Add Vite plugins:

```js
// htmlcssjs.config.js

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

export default {
  vitePlugins: [
    myVitePlugin(),
    awesomeVitePlugin()
  ]
}
```
