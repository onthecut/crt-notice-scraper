import * as url from 'url';
import fetch from 'axios';
import * as cheerio from 'cheerio';
import camelCase = require('camel-case');

interface Notice {
  waterway: string;
  
}

const cleanDate = (text) => {
	return text.replace(/ {1,}/g, ' ').replace(/\n/g, '').trim()
}

const parseNotice = (html) => {
  const $ = cheerio.load(html)

  const contentEl = $('.notice-content')

  const names = contentEl.find('fieldset').toArray().map((fieldset) => {
    return $(fieldset).children('.name').map((index, el) => {
      return $(el).text().trim()
    }).toArray()
  })

  const values = contentEl.find('fieldset').toArray().map((fieldset) => {
    return $(fieldset).children('.value').map((index, el) => {
      return $(el).text().trim()
    }).toArray()
  })

  const out = {
    waterway: undefined,
    fromDate: undefined,
    toDate: undefined
  }

  names.forEach((nameBlock, outerIndex) => {
    nameBlock.forEach((name, innerIndex) => {
      if (outerIndex === 1) {
        if (innerIndex === 0) {
		  out.waterway = name
		  return
        } else {
          innerIndex--
        }
      }
      out[camelCase(name)] = values[outerIndex][innerIndex]
    })
  })

  out.fromDate = out.fromDate ? out.fromDate.replace(/ {1,}/g, ' ').replace(/\n/g, '') : out.fromDate
  out.toDate = out.toDate ? out.toDate.replace(/ {1,}/g, ' ').replace(/\n/g, '') : out.toDate

  return out
}

const fetchNotice = (url) => {
  return fetch(url)
    .then(res => res.data)
    .then(parseNotice)
}

const parseSearchResults = (html) => {
	const $ = cheerio.load(html)

	return $($('.search-results-list-table').children()[0]).children().map((index, resultEl) => {
		const type = $(resultEl).find('img').attr('alt')
		const name = $(resultEl).find('.search-result-title a').text().replace('»', '').trim()
		const href = $(resultEl).find('.search-result-title a').attr('href').trim()
		const match = $(resultEl).find('.search-result-url').text().replace(/\n/g, '')
								.match(/Waterway: (.+)From Date:(.+)To Date:(.+)/)

		return {
			name,
			type,
			href: url.resolve('https://canalrivertrust.org.uk/', href),
			waterway: match[1].trim(),
			fromDate: cleanDate(match[2]),
			toDate: cleanDate(match[3])
		}
	}).toArray()
}

const fetchSearchResults = (
	url = 'https://canalrivertrust.org.uk/notices/results/page/1?region=-1&datefrom=&dateto=&itemcount=10000&Search=Search&waterways=-1',
	extended = true
) => {
	return fetch(url)
	.then(res => res.data)
	.then(parseSearchResults)
	.then((results) => {
		if (!extended) {
			return results
		}
		return Promise.all(
			results.map(({href}) => fetchNotice(href))
		)
	})
}

module.exports = {
  parseNotice,
  fetchNotice,
  parseSearchResults,
  fetchSearchResults
}
