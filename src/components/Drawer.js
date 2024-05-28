import React, { useState, useEffect } from "react";
import Image from "next/image";
// next js
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import ContactModal from "./ContactModal";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

const Drawer = ({
  showDrawer,
  handleNavigation,
  handleClose,
  resourceApi,
  isArabic,
  handleContactNavigation,
  handleRequestHistoryNavigation,
  lang,
  setRtl,
  store,
  ...props
}) => {
  const router = useRouter();
  const currentLang = router.query.en;
  const [hideRoom, setHideRoom] = useState();
  useEffect(() => {
    getHideRoom();
  }, []);

  const getHideRoom = () => {
    const localRoom = localStorage.getItem("hideRoom");
    setHideRoom(localRoom === "true");
  };
  return (
    <>
      {showDrawer ? (
        <div dir={setRtl}>
          <div
            tabIndex={-1}
            className={`fixed z-40 h-screen p-4 overflow-y-auto  -translate-x bg-white  w-80 dark:bg-white  transition-transform  top-0  duration-700 ${
              lang == "ar" ? " right-0" : " left-0"
            }`}
          >
            <h5
              id="drawer-label"
              className={` inline-flex items-center mb-4 text-base font-semibold text-gray-500 font-raleway cursor-pointer`}
            >
              <img
                alt="close button"
                src="/more.png"
                className={`h-[16px] w-[16px] ${
                  lang == "ar" ? "rotate-180 " : ""
                }`}
              />
              <p
                className={`  text-black ${
                  lang == "ar" ? "mr-2 font-cairo" : "ml-2 font-raleway"
                } `}
              >
                {" "}
                {resourceApi?.menu}
              </p>
            </h5>
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className={`flex items-center justify-center w-[30px] h-[30px] opacity-[0.8] p-1.5 absolute top-2.5  ${
                lang == "ar"
                  ? "left-2.5 ml-[16px] float-left"
                  : "right-2.5 mr-[16px] float-right"
              } bg-[#D9D9D9]  rounded-md  mt-1 shadow hover:bg-[#D9D9D9] hover:shadow focus:bg-[#F2F2F2] focus:shadow focus:outline-none focus:ring-0 active:bg-[#F2F2F2] active:shadow-lg transition duration-150 ease-in-out`}
              onClick={handleClose}
            >
              <img
                alt="close button"
                src="/close.svg"
                className="h-[16px] w-[16px] "
              />
            </button>

            <div className="py-4 overflow-y-auto ">
              <ul className="">
                <div
                  onClick={handleNavigation}
                  href="#"
                  className="flex items-center py-2 text-base font-raleway text-gray-900 rounded-lg  hover:bg-gray-100   "
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-500 transition duration-75   "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <div
                    className={`  text-black ${
                      lang == "ar" ? "mr-3 font-cairo" : "ml-3 font-raleway"
                    } cursor-pointer `}
                  >
                    {resourceApi?.order_history}
                  </div>
                </div>

                {isArabic && (
                  <div
                    // onClick={() => {
                    //   setCookie("lang", lang === "ar" ? "en" : "ar", {
                    //     path: "/",
                    //     maxAge: 3600 * 24 * 30,
                    //   });
                    //   router.reload();
                    // }}

                    onClick={() => {
                      let setlang;
                      if (currentLang == "ar") {
                        setlang = "en";
                      } else {
                        setlang = "ar";
                      }
                      const query = {
                        roomNo: router.query.roomNo,
                      };
                      if (hideRoom) {
                        query.hideRefCodeFromUser = false;
                        router
                          .replace({
                            pathname: `/${setlang}/store/detail/${store.uuid}`,
                            query: {
                              roomNo: router.query.roomNo,
                              hideRefCodeFromUser: hideRoom,
                            },
                          })
                          .then(() => {
                            router.reload();
                          });
                      } else {
                        router
                          .replace({
                            pathname: `/${setlang}/store/detail/${store.uuid}`,
                            query: {
                              roomNo: router.query.roomNo,
                            },
                          })
                          .then(() => {
                            router.reload();
                          });
                      }
                    }}
                    href="#"
                    className="flex items-center py-2 text-base font-raleway text-gray-900 rounded-lg  hover:bg-gray-100 "
                  >
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-500 transition duration-75   "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                    </svg>
                    <div
                      className={`  text-black ${
                        lang == "ar" ? "mr-3 font-cairo" : "ml-3 font-raleway"
                      } cursor-pointer`}
                    >
                      {resourceApi?.change_language}
                    </div>
                  </div>
                )}

                <div
                  onClick={
                    handleContactNavigation
                    // setShowPopupModal(true);
                  }
                  href="#"
                  className="flex items-center py-2 text-base font-raleway text-gray-900 rounded-lg  hover:bg-gray-100 "
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-500 transition duration-75   "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <div
                    className={`  text-black ${
                      lang == "ar" ? "mr-3 font-cairo" : "ml-3 font-raleway"
                    } cursor-pointer`}
                  >
                    {resourceApi?.ADD_CONTACT_DETAILS}
                  </div>
                </div>
                <div
                  onClick={handleRequestHistoryNavigation}
                  href="#"
                  className="flex items-center py-2 text-base font-raleway text-gray-900 rounded-lg  hover:bg-gray-100 "
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-500 transition duration-75   "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <div
                    className={`  text-black ${
                      lang == "ar" ? "mr-3 font-cairo" : "ml-3 font-raleway"
                    } cursor-pointer`}
                  >
                    {resourceApi?.REQ_HISTORY}
                  </div>
                </div>
              </ul>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
        </div>
      ) : null}
    </>
  );
};

export default Drawer;

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
