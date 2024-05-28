import React, { useEffect, useState } from "react";

//Language Imports

import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

//Props
// selected for select category
// setSelected is for set selected item
//data is for list of items render

const TopBarComponent = ({
  selected,
  setSelected,
  data,
  lang,
  setRtl,
  ...props
}) => {
  //LANGUAGE
  // const lang = useLang();

  useEffect(() => {
    if (selected == data[0]?.name) {
    } else {
      const yOffset = -90;
      const element = document.getElementById(selected);
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      if (element !== null) {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [selected]);

  // logic to reset the selected categrou
  // when => jab user wapis upper tak scroll kr le
  const handleScroll = (event) => {
    if (data.length > 0) {
      const element = document.getElementById(
        `${data[0]?.id}-${data[0]?.displayOrder}`
      );
      if (element != null) {
        if (window.scrollY < element.offsetTop) {
          setSelected(data[0]?.name);
        }
      }
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        id="topBar-component"
        className="max-w-[85%] flex overflow-y-scroll scrollbar-hide "
      >
        {data.map((category, key) => {
          return (
            <div key={key}>
              {category?.products.length > 0 && (
                <div
                  className="font-raleway table mr-[20px] truncate  "
                  onClick={() => setSelected(category?.name)}
                  id={`${category?.id}-${category?.displayOrder}`}
                >
                  <div
                    className={` ${
                      lang == "ar" ? "font-cairo" : "font-raleway"
                    } leading-[24px] cursor-default   ${
                      selected == category?.name
                        ? "text-[#333333] font-[600]"
                        : "text-[#9095a6a6] font-[500]"
                    } text-[16px]`}
                  >
                    {lang == "ar" && category?.nameArabic == null
                      ? category?.name
                      : category?.nameArabic}
                  </div>
                  {selected == category?.name && (
                    <div className="h-[2px] rounded-full w-[50%] bg-black" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TopBarComponent;

export async function getServerSideProps(context) {
  let lang = getLangServerSide(context).locale;
  let setRtl = getLangServerSide(context).rtl;

  return {
    props: {
      lang,
      setRtl,
    },
  };
}
