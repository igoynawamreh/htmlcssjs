#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import spawn from 'cross-spawn'
import { config } from './config.js'
import { getMyPackageJson } from './lib.js'

const argv = process.argv
const myPkg = getMyPackageJson('./package.json')
const viteConfigSite = `node_modules/${myPkg.name}/vite.config.site.js`
const viteConfigDist = `node_modules/${myPkg.name}/vite.config.dist.js`
const viteConfigLib = `node_modules/${myPkg.name}/vite.config.lib.js`

const command = argv?.[2]
const allowed = (
  command === 'dev' ||
  command === 'prod' ||
  command === 'preview' ||
  command === 'vite'
)
const htmlIndex = path.resolve(
  process.cwd(),
  path.join(config.src.root, 'index.html')
)
const jsIndex = path.resolve(
  process.cwd(),
  path.join(config.src.root, 'index.js')
)
const libIndex = path.resolve(
  process.cwd(),
  path.join(config.src.root, 'index.lib.js')
)

if ((argv.length > 3 && command !== 'vite') || !allowed) {
  console.log()
  console.log('Invalid command')
  console.log()
  console.log('Available commands:')
  console.log()
  console.log(`$ ${myPkg.name} dev (Start dev server and rebuilds when source files have changed)`)
  console.log(`$ ${myPkg.name} prod (Build for production)`)
  console.log(`$ ${myPkg.name} preview (Locally preview production build)`)
  console.log(`$ ${myPkg.name} vite (Run Vite commands)`)
  process.exit(1)
}

if (command === 'dev') {
  if (fs.existsSync(htmlIndex) && config.out.site !== false) {
    spawn('vite', ['--config', viteConfigSite], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  } else {
    if (fs.existsSync(jsIndex) && config.out.dist !== false) {
      if (fs.existsSync(libIndex) && config.out.lib !== false) {
        spawn('nodemon', [
          '--watch', config.src.root,
          '--ext', '*',
          '--exec', `vite build --config ${viteConfigDist} && vite build --config ${viteConfigLib}`
        ], {
          stdio: 'inherit',
          cwd: process.cwd()
        })
      } else {
        spawn('nodemon', [
          '--watch', config.src.root,
          '--ext', '*',
          '--exec', `vite build --config ${viteConfigDist}`
        ], {
          stdio: 'inherit',
          cwd: process.cwd()
        })
      }
    } else {
      if (fs.existsSync(libIndex) && config.out.lib !== false) {
        spawn('nodemon', [
          '--watch', config.src.root,
          '--ext', '*',
          '--exec', `vite build --config ${viteConfigLib}`
        ], {
          stdio: 'inherit',
          cwd: process.cwd()
        })
      }
    }
  }

  if (
    !fs.existsSync(htmlIndex) &&
    !fs.existsSync(jsIndex) &&
    !fs.existsSync(libIndex) &&
    config.out.site !== false &&
    config.out.dist !== false &&
    config.out.lib !== false
  ) {
    console.log('Error: need at least one entry point index.html/index.js/index.lib.js')
  }

  if (
    config.out.site === false &&
    config.out.dist === false &&
    config.out.lib === false
  ) {
    console.log('All config.out are disabled')
  }
}

if (command === 'prod') {
  if (fs.existsSync(htmlIndex) && config.out.site !== false) {
    spawn('vite', ['build', '--config', viteConfigSite], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  }

  if (fs.existsSync(jsIndex) && config.out.dist !== false) {
    spawn('vite', ['build', '--config', viteConfigDist], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  }

  if (fs.existsSync(libIndex) && config.out.lib !== false) {
    spawn('vite', ['build', '--config', viteConfigLib], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  }

  if (
    !fs.existsSync(htmlIndex) &&
    !fs.existsSync(jsIndex) &&
    !fs.existsSync(libIndex) &&
    config.out.site !== false &&
    config.out.dist !== false &&
    config.out.lib !== false
  ) {
    console.log('Error: need at least one entry point index.html/index.js/index.lib.js')
  }

  if (
    config.out.site === false &&
    config.out.dist === false &&
    config.out.lib === false
  ) {
    console.log('All config.out are disabled')
  }
}

if (command === 'preview') {
  if (fs.existsSync(htmlIndex) && config.out.site !== false) {
    spawn('vite', ['preview', '--config', viteConfigSite], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  }

  if (!fs.existsSync(htmlIndex) && config.out.site !== false) {
    console.log('Missing index.html entry point')
  }

  if (config.out.site === false) {
    console.log('The config.out.site.dest is disabled')
  }
}

if (command === 'vite') {
  spawn('vite', [...argv.splice(3)], {
    stdio: 'inherit',
    cwd: process.cwd()
  })
}
