import React, { useState } from "react";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";
//PROPS DETAILS
//showModal ==> to open modal in respective screen
// headingTxt ===> modal Heading Text
//alertMessage ==> message to display in alert
// handleUserChoice ==> function to close the modal

const MessageModal = ({
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
          <div className="justify-center items-center flex fixed inset-0 z-40">
            <div className="dark:bg-white bg-white rounded-xl lg:w-[600px]  max-w-[500px] p-2  flex flex-col items-center justify-center">
              {/* Headin Text Section */}
              <div class="mt-5 text-center w-[80%]">
                <p
                  class={`${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  }  text-sm font-normal text-black-500 `}
                >
                  <b>{headingTxt}</b>
                </p>
              </div>

              {/* AlertMessage Section */}
              <div class="p-2 text-center w-full mx-2">
                <p
                  class={`${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  }  text-sm font-normal text-black-500 `}
                >
                  {alertMessage}
                </p>
              </div>

              <div class=" w-[100%]  flex  items-center justify-around mt-  border-t border-gray-300 dark:border-gray-300">
                <div
                  className={`${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } flex items-center justify-center w-[50%] p-4 border-r  border-gray-300 dark:border-gray-300`}
                >
                  <div
                    onClick={() => handleUserChoice(false)}
                    className=" font-bold text-blue-600  cursor-pointer"
                  >
                    {resource.CANCEL}
                  </div>
                </div>
                <div
                  className={`${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } flex items-center justify-center w-[50%] p-4 `}
                >
                  <div
                    className=" font-bold text-blue-600 cursor-pointer "
                    onClick={() => handleUserChoice(true)}
                  >
                    {resource.AGREE}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default MessageModal;
