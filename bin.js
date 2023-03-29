#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import spawn from 'cross-spawn'
import { config } from './data.js'
import { getMyPackageJson } from './lib.js'

const argv = process.argv
const myPkg = getMyPackageJson('./package.json')
const viteConfigSite = `node_modules/${myPkg.name}/vite.config.site.js`
const viteConfigDist = `node_modules/${myPkg.name}/vite.config.dist.js`
const viteConfigLib = `node_modules/${myPkg.name}/vite.config.lib.js`

const command = argv?.[2]

if (
  (argv.length > 3 && 'vite' !== command) ||
  (
    'dev' !== command &&
    'prod' !== command &&
    'preview' !== command &&
    'vite' !== command
  )
) {
  console.log()
  console.log('Invalid command.')
  console.log()
  console.log('Available commands:')
  console.log()
  console.log(`$ ${myPkg.name} dev (Start dev server and rebuilds when source files have changed)`)
  console.log(`$ ${myPkg.name} prod (Build for production)`)
  console.log(`$ ${myPkg.name} preview (Locally preview production build)`)
  console.log(`$ ${myPkg.name} vite (Run Vite commands)`)
  process.exit(1)
}

if ('dev' === command) {
  if (
    fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.html')
    )) &&
    false !== config.out.dest.site
  ) {
    spawn('vite', ['--config', viteConfigSite], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  } else {
    if (
      fs.existsSync(path.resolve(
        process.cwd(),
        path.join(config.src.root, 'index.js')
      )) &&
      false !== config.out.dest.dist
    ) {
      if (
        fs.existsSync(path.resolve(
          process.cwd(),
          path.join(config.src.root, 'index.lib.js')
        )) &&
        false !== config.out.dest.lib
      ) {
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
      if (
        fs.existsSync(path.resolve(
          process.cwd(),
          path.join(config.src.root, 'index.lib.js')
        )) &&
        false !== config.out.dest.lib
      ) {
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
    !fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.html')
    )) &&
    !fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.js')
    )) &&
    !fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.lib.js')
    )) &&
    false !== config.out.dest.site &&
    false !== config.out.dest.dist &&
    false !== config.out.dest.lib
  ) {
    console.log('Error: need at least one entry point index.html/index.js/index.lib.js')
  }

  if (
    false === config.out.dest.site &&
    false === config.out.dest.dist &&
    false === config.out.dest.lib
  ) {
    console.log('All config.out are disabled')
  }
}

if ('prod' === command) {
  if (
    fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.html')
    )) &&
    false !== config.out.dest.site
  ) {
    spawn('vite', ['build', '--config', viteConfigSite], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  }

  if (
    fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.js')
    )) &&
    false !== config.out.dest.dist
  ) {
    spawn('vite', ['build', '--config', viteConfigDist], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  }

  if (
    fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.lib.js')
    )) &&
    false !== config.out.dest.lib
  ) {
    spawn('vite', ['build', '--config', viteConfigLib], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  }

  if (
    !fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.html')
    )) &&
    !fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.js')
    )) &&
    !fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.lib.js')
    )) &&
    false !== config.out.dest.site &&
    false !== config.out.dest.dist &&
    false !== config.out.dest.lib
  ) {
    console.log('Error: need at least one entry point index.html/index.js/index.lib.js')
  }

  if (
    false === config.out.dest.site &&
    false === config.out.dest.dist &&
    false === config.out.dest.lib
  ) {
    console.log('All config.out are disabled')
  }
}

if ('preview' === command) {
  if (
    fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.html')
    )) &&
    false !== config.out.dest.site
  ) {
    spawn('vite', ['preview', '--config', viteConfigSite], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  }

  if (
    !fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.html')
    )) &&
    false !== config.out.dest.site
  ) {
    console.log('Missing index.html entry point.')
  }

  if (false === config.out.dest.site) {
    console.log('The config.out.dest.site is disabled')
  }
}

if ('vite' === command) {
  spawn('vite', [...argv.splice(3)], {
    stdio: 'inherit',
    cwd: process.cwd()
  })
}
