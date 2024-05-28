import { getCookie } from "cookies-next";

import { useEffect, useState } from "react";

// eslint-disable-next-line import/no-anonymous-default-export
export default function getLang() {
  const lang = getCookie("lang");
  //   console.log("lang", lang);
  return {
    locale: lang || "en",
    rtl: lang === "ar" ? "rtl" : "",
  };
}

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useLang = () => {
  const [lang, setLang] = useState({
    locale: "en",
    rtl: "",
  });
  useEffect(() => {
    setLang(getLang());
  }, []);
  return lang;
};

export const getLangServerSide = (context) => {
  // let browserLanguage = context.req.headers["accept-language"].split(",")[0];
  // let userSetLang = context?.req?.cookies?.lang;
  let localeFromURl = context?.params.en;

  // const isVisitted = !context?.req?.cookies?.isVisitted;

  // if (isVisitted) {
  //   context.res.setHeader(
  //     "Set-Cookie",
  //     `isVisitted Max-Age=${60 * 60 * 24 * 30}; Path=/;`
  //   );
  // }

  // console.log(
  //   "THIS IS CHECKING VALUE IF WEB OPENING FIRST TIME OR NOT ===>>",
  //   isVisitted
  // );

  // console.log("THIS IS BROWSER LANGUAGE ====>>>>>", browserLanguage);

  // let setrtl;
  // let lang;

  // if (isVisitted) {
  //   if (browserLanguage.startsWith("ar")) {
  //     lang = "ar";
  //     setrtl = "rtl";
  //   } else {
  //     lang = "en";
  //     setrtl = "";
  //   }
  // } else if (localeFromURl == "ar") {
  //   setrtl = "rtl";
  //   lang = "ar";
  // } else {
  //   setrtl = "";
  //   lang = "en";
  // }

  return {
    locale: localeFromURl,
    // rtl: lang === "ar" ? "rtl" : "",
    rtl: localeFromURl == "ar" ? "rtl" : "",
    // isVisitted: isVisitted,
  };
};
