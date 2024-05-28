/*import React from "react";
import Image from "next/image";
import useWindowSize from "../hooks/useWindowSize";
//Language Imports

import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

// props details
// item => name,image,info
// className => more specification for the container such as container width default is 48% we can make it 96% for bigger containers
// onClick => handling onClick event

const AboutCityComponent = ({
  item,
  className,
  onClick,
  lang,
  setRtl,
  ...props
}) => {
  //LANGUAGE
  // const lang = useLang();

  const store =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("store"))
      : { serviceID: "", products: [] };

  const size = useWindowSize();
  //GETTING COLOR
  const colorSchema = {
    backgroundColor: store?.backgroundColor ? store.backgroundColor : "#FCFCFF",
    fontColor: store?.fontColor ? store.fontColor : "#4F4F4F",
    borderColor: store?.borderColor ? store.borderColor : "#1B153D",
  };

  return (
    <div className={` px-[2.5px] py-1 pb-1.5 ${className}`} onClick={onClick}>
      <div
        id="category-component"
        style={{ borderRadius: "1rem" }}
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className={`flex h-fit flex-col bg-[#FFFFFF] px-2 py-2 pb-5 shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)]  `}
      >
        <div
          style={{ height: size.width * 0.27, borderRadius: "1rem" }}
          className="relative rounded-[14.66px]  "
        >
          <img
            className="absolute h-full w-full object-cover rounded-[14.66px] "
            src={item.logo != null ? item?.logo?.previewUrl : ""}
          />
        </div>

        <p
          id="category-component-name"
          className={` font-[550] text-start ${
            lang == "ar" ? "font-cairo" : "font-raleway "
          } mt-4 text-[1.0375rem] text-[#333333] leading-[19.67px] truncate tracking-[-0.251339px]`}
        >
          {
            (item.name =
              lang === "ar" && item.nameArabic
                ? item.nameArabic
                : item.nameArabic
                ? item.nameArabic
                : item.name)
          }
        </p>
        <p
          id="category-component-description"
          className={` ${
            lang == "ar" ? "font-cairo" : "font-raleway"
          } text-[12.57px] h-[29px] text-[#828282] font-[500] self-start text-start mt-[7px] leading-[14.75px]  w-fit line-clamp-2 overflow-hidden mb-3`}
        >
          {
            (item.summary =
              lang === "ar" && item.summaryArabic
                ? item.summaryArabic
                : item.summaryArabic
                ? item.summaryArabic
                : item.summary)
          }
        </p>
      </div>
    </div>
  );
};

export default AboutCityComponent;

export async function getServerSideProps(context) {
  let lang = getLangServerSide(context).locale;
  let setRtl = getLangServerSide(context).rtl;

  return {
    props: {
      lang,
      setRtl,
    },
  };
}*/
