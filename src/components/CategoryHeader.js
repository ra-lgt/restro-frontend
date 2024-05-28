import React from "react";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

//Props details
// item => tittle

const CategoryHeader = ({ title, lang, setRtl, ...props }) => {
  // const lang = useLang();

  return (
    <div id="separator" className="w-[100%] self-center px-[64px]">
      <div className="flex items-center py-">
        {/* The left line */}
        <div className="flex-grow h-px bg-[#9095A6] opacity-[0.65]" />
        {/* Your text here */}
        <span
          className={`flex-shrink  text-[#9095a6a6] px-2  ${
            lang == "ar" ? "font-cairo" : "font-raleway"
          } font-[600] text-[16.76px] `}
        >
          {title}
        </span>
        {/* The right line */}
        <div className="flex-grow h-px bg-[#9095A6] opacity-[0.65]" />
      </div>
    </div>
  );
};

export default CategoryHeader;

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
