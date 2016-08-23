'use strict'

let tape = require('tape'),
    humanReadable = require('../')

tape('Check lib.VERSION against package.json', (test) => {
  test.equal(
    humanReadable.version,
    require('../package.json').version
  )
  test.end()
})

tape('lat-lon', (test) => {
  test.equal(
    humanReadable.simple({lat:0.1, lng: 0.2}),
    '<a href="https://www.openstreetmap.org/#map=5/0.1/0.2" target="_blank">📍 0.10/0.20</a>'
  )
  test.end()
})
