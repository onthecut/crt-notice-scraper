# onthecut / crt-notice-scraper

> Canal and River Trust (CRT) Notice Scraper

## Install

```
npm install @onthecut/crt-notice-scraper
```

## API

```js
import { getNotices } from '@onthecut/crt-notice-scraper';

await getNotices()
// >
// [ { fromDate: '30th October 2018 at 06:00',
//     toDate: '30th June 2019 at 23:59 inclusive',
//     type: 'Advice',
//     reason: 'Information',
//     noticeUpdates:
//      '26/03/2019 @ 17:59\n                        UPDATE: The mooring ...',
//     description:
//      'The Canal & River Trust is working with Hackney Council and ...',
//     waterway: 'Lee Navigation',
//     startsAt: 'Bridge 14, Eastway Road (A106)',
//     endsAt: 'Bridge 14A, Newham Way' },
//     ...
// ]
```

## Licence

MIT