import * as test from "tape";
import { getNotice, getNotices } from ".";

let firstNotice;

test("getNotices", async (t) => {
  const notices = await getNotices();

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

  firstNotice = notices[0];

  t.end();
});

test("getNotice", async (t) => {
  const notice = await getNotice(firstNotice.href);
  
  t.ok('title' in notice);
  t.ok('href' in notice);
  t.ok('detail' in notice);
  t.ok('location' in notice);
  t.ok('updates' in notice);
  t.ok('description' in notice);
  t.ok('id' in notice)
  t.end();
});
