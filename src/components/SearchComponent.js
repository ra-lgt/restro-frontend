import React, { useState } from "react";
import Image from "next/image";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

//props
// PlaceHolder = for Search box inner text

const SearchComponent = ({
  inputVal,
  placeholder = "Search Products.....",
  handleChange,
  lang,
  setRtl,
  ...props
}) => {
  // const lang = useLang();

  return (
    <div className="w-screen flex items-center justify-center">
      <div
        id="search-component"
        className="w-[360px] lg:w-[95%] h-[40px] bg-[#F2F2F2]  flex  rounded-[10px]  items-center  "
      >
        <div
          className={` items-center flex ${
            lang == "ar" ? " mr-[18px]" : "ml-[18px]"
          }`}
        >
          <img
            alt="Search"
            className="w-[20%] pl-2 h-[26px] w-[26px] object-contain "
            src={"/Search.png"}
          />
        </div>

        <div className="w-[80%] bg-[#F2F2F2]">
          <input
            id="search-text"
            className={` text-[#828282] bg-[#F2F2F2] text-[14px] ${
              lang == "ar" ? "font-cairo" : "font-raleway"
            } font-[500] ml-4 items-center outline-none w-full`}
            value={inputVal}
            placeholder={placeholder}
            onInput={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
