import apiEndPoints from "../constant/endPoints";
import logger from "./logger";
// helping functions
export const getBrowserLang = (request) => {
  const lang = request.headers.get("accept-language").split(",")[0];
  const DEFAULT_LANG = "en";
  const langs = ["en", "ar"];
  let isA = "";

  langs.forEach((item) => {
    if (lang.includes(item)) {
      isA = item;
      return;
    }
  });

  return isA ? isA : DEFAULT_LANG;
};

export const getUrlLang = (request) => {
  return request.nextUrl.pathname.substring(1).split("/")[0];
};

export const generateNewUrl = (nextUrl, lang, useUrlWithout = true) => {
  const queries = nextUrl.search;
  let withoutLangUrl = nextUrl.pathname.substring(1);
  if (useUrlWithout) {
    withoutLangUrl = nextUrl.pathname
      .substring(1)
      .split("/")
      .filter((_, i) => i !== 0)
      .join("/");
  }
  return `/${lang}/${withoutLangUrl}${queries}`;
};

export const getStoreUUID = (request) =>
  request?.nextUrl?.pathname?.split("/")?.[4];

export const checkIsLanguageAvailableInStore = async (lang, uuid) => {
  if (lang === "en") return true;
  let ok = false;

  try {
    const storeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}${apiEndPoints.GET_STORE_BY_ID}/${uuid}`
    );
    const languages = (await storeResponse.json())?.data?.languages || [];

    ok = languages?.some(
      (item) => item?.shortCodeISO?.toLowerCase() === lang?.toLowerCase()
    );

    logger.log("isAvailableInStore", { ok, languages, lang, uuid });
  } catch (e) {
    ok = false;
    logger.error("error in isAvailableInStore", e);
  }

  return ok;
};
