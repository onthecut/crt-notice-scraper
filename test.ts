import * as test from "tape";
import { CRTNoticeSummary, getNotice, getNotices } from ".";

let notices: Array<CRTNoticeSummary>;

test("getNotices", async (t) => {
  notices = await getNotices();

  t.ok(Array.isArray(notices));
  t.ok(notices.length > 0);

  for (const key of [
    "path",
    "headline",
    "startDate",
    "endDate",
    "startAt",
    "endAt",
    "noticeType",
    "towpathClosed",
    "encoded",
    "href",
  ]) {
    t.ok(key in notices[0]);
  }

  t.end();
});

test("getNotice", async (t) => {
  const elements = [
    "title",
    "href",
    "detail",
    "location",
    "updates",
    "description",
    "id",
  ];

  for (let noticeSummary of notices) {
    let a = await getNotice(noticeSummary.href);
    let hasAllElements = true;

    for (let element of elements) {
      if (element in a == false) {
        hasAllElements = false;
      }
    }

    if (hasAllElements) {
      return t.end();
    }
  }
});
