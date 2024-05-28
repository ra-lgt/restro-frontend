import React, { useState } from "react";

// next js
import { useRouter } from "next/router";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

const ImageDisplayComponent = ({
  showDrawer,
  image,
  handleCloseImage,
  lang,
  setRtl,
  ...props
}) => {
  const router = useRouter();
  // const lang = useLang();

  return (
    <>
      {showDrawer ? (
        <div className="fixed h-screen bg-black  w-screen z-40  flex items-center justify-center max-w-[850px] overflow-auto scrollbar-hide  ">
          <button
            className={` fixed flex items-center justify-center w-[30px] h-[30px] opacity-[0.8] p-1.5 z-50  top-5 ${
              lang == "ar" ? "left-2" : "right-2"
            } right-2 bg-[#D9D9D9] float-right rounded-md mr-[16px] mt-1 shadow hover:bg-[#D9D9D9] hover:shadow focus:bg-[#F2F2F2] focus:shadow focus:outline-none focus:ring-0 active:bg-[#F2F2F2] active:shadow-lg transition duration-150 ease-in-out`}
            onClick={handleCloseImage}
          >
            <img
              alt="close button"
              src="/crossIcon.svg"
              className="h-[20px] w-[20px]  "
            />
          </button>
          <div className="relative bottom-24 overflow-auto">
            <img
              alt="product image"
              src={image}
              className="w-[100%] h-[100%]  "
            />
          </div>
          <div className=" fixed inset-0 -z-10 bg-black "></div>
        </div>
      ) : null}
    </>
  );
};

export default ImageDisplayComponent;
