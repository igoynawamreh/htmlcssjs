import './@css/index.css'
import './@scss/index.scss'
import './@stylus/index.styl'
import './@less/index.less'
import 'highlight.js/styles/github.css'

import fooClasses from './@css-module/foo.module.css'
import barClasses from './@css-module/bar.module.scss'

import { myAlert } from './@js/foo'

import htmlImage from './@assets/logo/html.png'
import cssImage from './@assets/logo/css.png'
import jsImage from './@assets/logo/js.png'

const DATA = {
  text: {
    title: import.meta.env.APP_DATA.title,
    foo: import.meta.env.APP_FOO
  },
  images: {
    html: htmlImage,
    css: cssImage,
    js: jsImage
  }
}

document.body.classList.add(fooClasses['bg-white'])
document.body.classList.add(barClasses['text-black'])

const dataImageEl = document.querySelectorAll('[data-image]')
dataImageEl && dataImageEl.forEach((el) => {
  el.src = DATA.images[el.dataset.image]
})

const dataAlertEl = document.querySelectorAll('[data-alert]')
dataAlertEl && dataAlertEl.forEach((el) => {
  el.addEventListener(el.dataset.event || 'click', function () {
    myAlert(DATA.text[el.dataset.alert] ?? el.dataset.alert)
  })
})
