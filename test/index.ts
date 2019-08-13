const test = require('tape')
const fs = require('fs')
const path = require('path')
const { parseNotice, parseSearchResults } = require('..')

const loadFixture = (name) => {
  return fs.readFileSync(
    path.resolve(__dirname, name),
    'utf8'
  )
}

test('parseNotice', (t) => {
  const html14096 = loadFixture('14096.html')
  const result14096 = parseNotice(html14096)

  t.equal(result14096.fromDate, '30th October 2018 at 06:00')
  t.equal(result14096.toDate, '30th June 2019 at 23:59 inclusive')
  t.equal(result14096.type, 'Advice')
  t.equal(result14096.reason, 'Information')
  t.equal(result14096.waterway, 'Lee Navigation')

  const html14913 = loadFixture('14913.html')
  const result14913 = parseNotice(html14913)

  t.equal(result14913.fromDate, '19th April 2019 at 19:00')
  t.equal(result14913.toDate, '21st April 2019 at 04:00 inclusive')
  t.equal(result14913.type, 'Event')
  t.equal(result14913.description, 'Devizes to Westminster International Canoe Race\nA canoe/kayak marathon event organised by the Devizes to Westminster Organisation Ltd.  The navigation will remain open but please proceed with care and listen to the advice of the event organisers.')
  t.equal(result14913.waterway, 'Kennet & Avon Canal')
  t.equal(result14913.startsAt, 'Bridge 140, Cemetery Road')
  t.equal(result14913.endsAt, 'Bridge 1, Duke Street Bridge')
  t.equal(result14913.upStreamWindingHole, 'Turn above County Lock 106 but be careful of weir KA-001-010')
  t.equal(result14913.downStreamWindingHole, 'Devizes Wharf 72ft winding hole KA 086 024')

  t.end()
})

test('parseSearchResults', (t) => {
  const htmlSearch = loadFixture('results.html')
  const result = parseSearchResults(htmlSearch)

  t.equal(result.length, 10)

  t.end()
})
