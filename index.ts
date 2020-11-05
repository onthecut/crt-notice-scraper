import puppeteer from "puppeteer";

declare global {
  interface Window {
    crt: any;
  }
}

export interface CRTNoticeSummary {
  path: string;
  href: string;
  [key: string]: Object | string;
}

export interface CRTNotice {
  title: string;
  href: string;

  detail: CRTNoticeBlock;
  location: CRTNoticeBlock;

  [key: string]: CRTNoticeBlock | string;
}

export interface CRTNoticeBlock {
  [key: string]: Object | string;
}

/**
 * Base CRT Notices URL
 */
export const NOTICES_URL = "https://canalrivertrust.org.uk/notices";

/**
 * Options passed to chromium.launch(). Disables headless mode when DEBUG
 * environment variable's set.
 */
export const defaultBrowserLaunchOptions = <puppeteer.LaunchOptions>{
  headless: process.env.DEBUG ? false : undefined,
  slowMo: process.env.DEBUG ? 50 : undefined,
};

/**
 * Load and scrape data from a CRT Notice page given it's URL.
 *
 * Example:
 *
 *    const notice = await getNotice(
 *      'https://canalrivertrust.org.uk/notices/18561-river-severn-carrington-road-bridge'
 *    );
 */
export async function getNotice(
  url: string,
  browserLaunchOptions = defaultBrowserLaunchOptions
): Promise<CRTNotice> {
  if (!url) {
    throw new Error("Missing Notice URL");
  }

  const browser = await puppeteer.launch(browserLaunchOptions);

  const page = await browser.newPage();
  await page.goto(url);

  const notice: CRTNotice = await page.evaluate(() => {
    const notice = <CRTNotice>{
      title: (document.getElementsByClassName(
        "text-header-headline"
      )[0] as HTMLElement).innerText,
      href: window.location.href,
    };

    for (const panel of Array.from(
      document.getElementsByClassName("panel-contact")
    )) {
      const panelHeading = (panel.getElementsByClassName(
        "heading"
      )[0] as HTMLElement).innerText;
      const panelHeadingLower = panelHeading.toLowerCase();

      notice[panelHeadingLower] = {};

      switch (panelHeadingLower) {
        case "detail":
        case "location":
          for (const para of Array.from(panel.getElementsByTagName("p"))) {
            let boldText = (para.children[0] as HTMLElement).innerText.trim();

            // Remove ending ':'.
            boldText = boldText.substring(0, boldText.length - 1);

            const bodyText = para.innerText.substr(boldText.length).trim();

            notice[panelHeadingLower][boldText] = bodyText;
          }

          break;

        case "updates":
        case "description":
          break;
      }
    }

    return notice;
  });

  notice.id = new URL(notice.href).pathname.split("/")[2].split("-")[0];

  await browser.close();

  return notice;
}

/**
 * Gather a list of all notice summaries from CRT Notices.
 *
 * Example:
 *
 *     (await getNotices()).forEach(notice => {
 *       console.log(`${notice.name} - ${notice.href}`)
 *     });
 *
 * Returns:
 *
 *     [
 *       {
 *         endAt: null
 *         endDate: null,
 *         headline: "Boston Lock",
 *         noticeType: 7,
 *         path: "/notices/14494-boston-lock",
 *         startAt: null,
 *         startDate: "2018-11-01T00:00:00",
 *         towpathClosed: false
 *       }
 *     ]
 *
 */
export async function getNotices(
  browserLaunchOptions = defaultBrowserLaunchOptions
): Promise<Array<CRTNoticeSummary>> {
  const browser = await puppeteer.launch(browserLaunchOptions);

  const page = await browser.newPage();
  await page.goto(NOTICES_URL);

  const notices = (
    await page.evaluate(() => {
      return window.crt.component[6].data;
    })
  ).map((notice: CRTNoticeSummary) => {
    notice.href = new URL(notice.path, NOTICES_URL).href;

    return notice;
  });

  await browser.close();

  return notices;
}
