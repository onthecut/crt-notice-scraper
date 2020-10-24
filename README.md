# onthecut / crt-notice-scraper

> Canal and River Trust (CRT) Notice Scraper

## Install

```
npm install @onthecut/crt-notice-scraper
```

## API

```js
import {
    getNotices,
    getNotice
} from '@onthecut/crt-notice-scraper';

// Retreive all notice summaries (CRT Notice Search Results)
const notices = await getNotices()

// Get detailed information on individual notices
const url = 'https://canalrivertrust.org.uk/notices/14494-boston-lock';
const notice = await getNotice(url);
```

## Related

* [CRT Notices Website](https://canalrivertrust.org.uk/notices)
* [CRT Open Data](https://data-canalrivertrust.opendata.arcgis.com/)

## Licence

MIT