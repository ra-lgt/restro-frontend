import React, { useState } from "react";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

const AlertModal = ({
  showModal,
  headingTxt,
  alertMessage,
  handleUserChoice,
  resource,
  lang,
  setRtl,
  ...props
}) => {
  // const lang = useLang();

  return (
    <>
      {showModal == true ? (
        <>
          <div className=" justify-center items-center flex fixed inset-0 z-40">
            <div
              id="alert-modal"
              style={{ backgroundColor: "white" }}
              className=" dark:bg-white w-[80%] rounded-2xl max-w-[580px] flex flex-col items-center justify-center  "
            >
              {/* Headin Text Section */}
              <div className="mt-5 text-center w-[80%]">
                <p
                  className={`${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } text-sm font-normal text-black-500 `}
                >
                  <b>{headingTxt}</b>
                </p>
              </div>

              {/* AlertMessage Section */}
              <div className="p-2 text-center w-full">
                <p
                  className={` ${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } text-sm font-normal text-black-500 `}
                >
                  {alertMessage}
                </p>
              </div>

              <div className=" w-[100%]  flex  items-center justify-around mt-1  border-t border-gray-300 dark:border-gray-300">
                <div className=" flex items-center justify-center w-[100%] p-4   border-gray-300 dark:border-gray-300">
                  <div
                    onClick={handleUserChoice}
                    className={` flex items-center justify-center w-[50%] p-1 ${
                      lang == "ar" ? "font-cairo" : "font-raleway "
                    } font-bold text-blue-600 cursor-pointer`}
                  >
                    {resource.OK}
                  </div>
                </div>
                {/* <div className=" flex items-center justify-center w-[50%] p-4 border-r  border-gray-300 dark:border-gray-700">
                  <div
                    onClick={() => handleUserChoice(false)}
                    className="font-raleway font-bold text-blue-600 "
                  >
                    Cancel
                  </div>
                </div>
                <div className=" flex items-center justify-center w-[50%] p-4 ">
                  <div
                    className="font-raleway font-bold text-blue-600"
                    onClick={() => handleUserChoice(true)}
                  >
                    Agree
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default AlertModal;
