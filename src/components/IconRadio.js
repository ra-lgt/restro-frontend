import React, { useEffect, useState } from "react";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

//PROPS

const IconRadio = ({
  product,
  inventory,
  radioText = "text",
  className = "",
  selected = false,
  onChange = (e = true || false) => {},
  radioIcon,
  lang,
  setRtl,
  ...props
}) => {
  // const lang = useLang();

  return (
    <>
      <div
        className={`flex items-center cursor-pointer ${className} w-[100%] mb-1 `}
        onClick={() => onChange(!selected)}
      >
        <div
          className={`h-5 w-5  ${
            lang == "ar" ? "ml-2" : "mr-2"
          } rounded-full  flex items-center justify-center bg-[#1B153D]`}
        >
          <div className="h-4 w-4 rounded-full bg-white flex items-center justify-center ">
            {selected && <div className="h-3 w-3 rounded-full bg-[#1B153D]" />}
          </div>
        </div>
        {product?.images && (
          <div>
            <img src={radioIcon} height={25} width={25} />
          </div>
        )}
        <div
          className={`${
            lang == "ar" ? "font-cairo" : "font-raleway"
          } font-[500] text-[16px] text-[#1B153D]  w-[60%]  ml-2`}
        >
          {radioText}
        </div>
        {!inventory?.disableCheckout && (
          <div className=" font-raleway font-[500] text-[16px] text-[#4F4F4F] ">
            {`${inventory.currency} ${inventory.price}`}
            {inventory?.unit && (
              <>
                (<sup>/{inventory?.unit}</sup>)
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default IconRadio;
