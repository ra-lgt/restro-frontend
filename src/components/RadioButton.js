import React, { useEffect, useState } from "react";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

//PROPS

const RadioButton = ({
  inventory,
  radioText = "text",
  className = "",
  selected = false,
  setSelected,
  lang,
  setRtl,
  ...props
}) => {
  // const lang = useLang();

  return (
    <>
      <div
        className={`flex items-center cursor-pointer ${className}  w-[100%]`}
        onClick={() => setSelected(!selected)}
      >
        <div
          className={`h-5 w-5  ${
            lang == "ar" ? "ml-5" : "mr-5"
          } rounded-full  flex items-center justify-center ${
            selected ? "bg-[#1B153D]" : "bg-[#1B153D]"
          }`}
        >
          <div className="h-4 w-4 rounded-full bg-white flex items-center justify-center ">
            {selected && <div className="h-3 w-3 rounded-full bg-[#1B153D]" />}
          </div>
        </div>
        <div
          className={`${
            lang == "ar" ? "font-cairo" : "font-raleway"
          } font-[500] text-[16px] text-[#1B153D]  w-[60%]  `}
        >
          {radioText}
        </div>
        {inventory?.unit != null && (
          <div className=" font-raleway font-[500] text-[16px] text-[#4F4F4F] ">
            (<sup>/{inventory?.unit}</sup>)
          </div>
        )}
      </div>
    </>
  );
};

export default RadioButton;
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
