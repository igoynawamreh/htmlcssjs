#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import spawn from 'cross-spawn'
import { config } from './data.js'
import { getMyPackageJson } from './lib.js'

const argv = process.argv
const myPkg = getMyPackageJson('./package.json')
const viteConfigDist = `node_modules/${myPkg.name}/vite.config.dist.js`
const viteConfigPreview = `node_modules/${myPkg.name}/vite.config.preview.js`
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
    ))
  ) {
    spawn('vite', ['--config', viteConfigPreview], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  } else {
    if (
      fs.existsSync(path.resolve(
        process.cwd(),
        path.join(config.src.root, 'index.js')
      ))
    ) {
      if (
        fs.existsSync(path.resolve(
          process.cwd(),
          path.join(config.src.root, 'index.lib.js')
        ))
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
        ))
      ) {
        spawn('nodemon', [
          '--watch', config.src.root,
          '--ext', '*',
          '--exec', `vite build --config ${viteConfigLib}`
        ], {
          stdio: 'inherit',
          cwd: process.cwd()
        })
      } else {
        console.log('Error: need at least one entry point index.html/index.js/index.lib.js')
      }
    }
  }
}

if ('prod' === command) {
  if (
    fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.js')
    ))
  ) {
    spawn('vite', ['build', '--config', viteConfigDist], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  }

  if (
    fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.html')
    ))
  ) {
    spawn('vite', ['build', '--config', viteConfigPreview], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  }

  if (
    fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.lib.js')
    ))
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
    ))
  ) {
    console.log('Error: need at least one entry point index.html/index.js/index.lib.js')
  }
}

if ('preview' === command) {
  if (
    fs.existsSync(path.resolve(
      process.cwd(),
      path.join(config.src.root, 'index.html')
    ))
  ) {
    spawn('vite', ['preview', '--config', viteConfigPreview], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  } else {
    console.log('Missing index.html entry point.')
  }
}

if ('vite' === command) {
  spawn('vite', [...argv.splice(3)], {
    stdio: 'inherit',
    cwd: process.cwd()
  })
}
