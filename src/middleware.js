import { NextResponse } from "next/server";
import logger from "./utils/logger";

import {
  generateNewUrl,
  getBrowserLang,
  getStoreUUID,
  checkIsLanguageAvailableInStore,
  getUrlLang,
} from "./utils/middlewareHelpers";

const IS_VISITED = "isVisited";
const DEFAULT_LANG = "en";

export async function middleware(request) {
  const isVisited = request.cookies.get(IS_VISITED);
  const storeUUID = getStoreUUID(request);
  // console.log(
  //   "\n\n\n\n\n========>>> pathname \n\n\n\n\n",
  //   request.nextUrl.pathname
  // );
  if (request.nextUrl.pathname.startsWith("/store")) {
    const lang = DEFAULT_LANG;
    return NextResponse.redirect(
      new URL(generateNewUrl(request.nextUrl, lang, false), request.url)
    );
  }
  // logger.log("middleware", { isVisited, storeUUID });

  if (isVisited === storeUUID) {
    return NextResponse.next();
  }

  // logger.log("middleware first time");

  const browserLanguage = getBrowserLang(request);
  const urlLanguage = getUrlLang(request);
  const isAvailableInStore = await checkIsLanguageAvailableInStore(
    browserLanguage,
    storeUUID
  );

  let response;
  if (isAvailableInStore && browserLanguage === urlLanguage) {
    response = NextResponse.next();
  } else {
    const lang = isAvailableInStore ? browserLanguage : DEFAULT_LANG;
    response = NextResponse.redirect(
      new URL(generateNewUrl(request.nextUrl, lang), request.url)
    );
  }

  // setting cookie
  response.cookies.set(IS_VISITED, storeUUID, {
    maxAge: 24 * 60 * 60 * 30 * 3, // 3 months
  });

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/en/store/:path*", "/ar/store/:path*", "/store/:path*"],
};
