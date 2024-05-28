import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";

import NavBar from "../../../../components/NavBar";
import { StoreContext } from "../../../../context/appContext";

// next js
import Router, { useRouter } from "next/router";

// third party
import axios from "../../../../utils/axios";
import endpoints from "../../../../constant/endPoints";
import { handleChangeResObj } from "../../../../utils/utilFunctions";
import getLang, { getLangServerSide, useLang } from "../../../../utils/locale";

const Index = ({ storeID, roomNo, ...props }) => {
  const [items, setItems] = useState([]);
  const [colorSchema, setColorSchema] = useState();
  const [colorLoaded, setColorLoaded] = useState(false);
  const [isRoomNumber, setRoomNumber] = useState(null);
  const [store, updateStore] = useContext(StoreContext);
  const [hideRoom, setHideRoom] = useState();
  const [maxWidth, setMaxWidth] = useState("150px");

  const router = useRouter();
  const lang = useLang();

  useEffect(() => {
    getHideRoom();
    const roomNumber = localStorage.getItem("RoomNumber");
    if (!roomNumber) {
      localStorage.setItem("RoomNumber", router.query.roomNo);
    }
    setRoomNumber(roomNo);
    setColorSchema({
      backgroundColor: store?.backgroundColor
        ? store.backgroundColor
        : "#FCFCFF",
      fontColor: store?.fontColor ? store.fontColor : "#4F4F4F",
      borderColor: store?.borderColor ? store.borderColor : "#1B153D",
    });
    setColorLoaded(true);

    let getLocalStore = localStorage.getItem("store");

    if (!getLocalStore) {
      axios
        .get(`${endpoints.GET_STORE_BY_ID}/${storeID}`)
        .then((res) => {
          updateStore(res.data.data);
        })
        .catch((er) => {
          //   console.log(er);
        });
    }
  }, []);

  useEffect(() => {
    const reqHistory = JSON.parse(
      localStorage.getItem("RequestHistoryByStore")
    );
    if (reqHistory && store?.uuid) {
      if (reqHistory?.[store?.uuid]) {
        setItems(reqHistory?.[store?.uuid]);
      }
    }
  }, [store]);

  const getHideRoom = () => {
    const localRoom = localStorage.getItem("hideRoom");
    // console.log("THIS IS ORDER HISTORY HIDE VALUE", localRoom);
    setHideRoom(localRoom === "true");
  };

  useEffect(() => {
    const handleResize = () => {
      const newMaxWidth = window.innerWidth >= 768 ? "280px" : "150px";
      setMaxWidth(newMaxWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const styles = {
    maxWidth: maxWidth,
    overflowWrap: "break-word",
    wordWrap: "break-word",
  };

  // console.log("THIS IS REQUEST HISTORY", items);

  return (
    <>
      <Head>
        <title>{store?.name}</title>

        <meta
          property="og:image"
          content={store?.logo != null ? store?.logo?.previewUrl : ""}
        />
        <meta name="description" content={"Request-History Page"} />
        <meta property="og:title" content={store?.name} />
      </Head>
      {colorLoaded && (
        <div
          style={{ backgroundColor: colorSchema.backgroundColor }}
          className="w-screen h-full  flex flex-col items-center  "
        >
          <NavBar
            leftIconVissible={true}
            leftIcon="back"
            hotelLogo={store?.logo !== null ? store?.logo?.previewUrl : ""}
            rightIcon="roomNo"
            roomNo={router.query.roomNo}
            handleBackBtn={() => {
              const query = {
                roomNo: router.query.roomNo,
              };
              if (hideRoom) {
                query.hideRefCodeFromUser = false;
                router.replace({
                  pathname: `/${lang.locale}/store/detail/${store.uuid}`,
                  query: {
                    roomNo: roomNo,
                    hideRefCodeFromUser: hideRoom,
                  },
                });
              } else {
                router.replace({
                  pathname: `/${lang.locale}/store/detail/${store.uuid}`,
                  query: {
                    roomNo: roomNo,
                  },
                });
              }
            }}
          />

          <div
            className={`flex items-center justify-center  ${
              lang.locale == "ar" ? " font-cairo" : "font-raleway "
            } mt-20 font-[600] text-[20px]`}
          >
            <p>{props?.resources?.REQ_HISTORY}</p>
          </div>

          {items.length > 0 ? (
            <div
              style={{ backgroundColor: colorSchema.backgroundColor }}
              className="mt-3 flex max-w-[650px] flex-col  items-center w-screen  pb-5"
            >
              {items
                .slice(0)
                .reverse()
                .map((val, ind) => (
                  <div
                    key={ind}
                    className={`
                        rounded-br-[18.46px] rounded-bl-[18.46px]
                       shadow-lg bg-white mt-4 w-10/12 max-w-[650px] `}
                  >
                    <div
                      dir={lang.rtl}
                      className={` flex bg-gray-500 justify-between border-b border-gray-100 px-4 py-2  rounded-tr-[18.46px] rounded-tl-[18.46px] `}
                    >
                      <div className="flex items-center justify-between w-full   ">
                        <div>
                          <span
                            className={`font-bold text-white text-sm  ${
                              lang.locale == "ar"
                                ? "ml-2 font-cairo "
                                : "font-raleway "
                            }`}
                          >
                            {props.resources?.REQ_NO} :
                          </span>
                          <span className="font-bold text-white text-sm ml-1 font-raleway">
                            {val.requestNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      dir={lang.rtl}
                      className={` py-2 px-2 w-full flex-col lg:w-[530px] flex  text-gray-600 ${
                        lang.locale == "ar" ? "font-cairo" : "font-raleway"
                      } text-[14px]  `}
                    >
                      <div
                        className={`flex ${
                          lang.locale == "ar" ? "mr-3" : "ml-3"
                        }  `}
                      >
                        <div className="flex flex-col font-[600]  min-w-[40%] ">
                          <p>{props.resources?.REQ_DATE} :</p>
                          <p>{props.resources?.REQ_TIME} :</p>
                          <p>{props.resources?.REQ_FOR} :</p>

                          <p>{props.resources?.REQ_NOTES} :</p>
                        </div>

                        <div
                          className={`flex flex-col  ${
                            lang.locale == "ar" ? "mr-4" : "ml-4"
                          }  `}
                        >
                          <p>{val.orderDate}</p>
                          <p className="">{val.orderTime}</p>
                          <p>{val.productName}</p>
                          <p
                            style={styles}
                            className=" w-[100%] lg:max-w-[280px] "
                          >
                            {val.requestNotes}
                          </p>
                        </div>
                      </div>

                      {/* <details
                        className={` ${
                          lang.locale == "ar" ? "mr-[115px]" : "ml-[130px]"
                        }`}
                       
                      >
                        {val.requestNotes}
                      </details> */}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div
              className={`w-screen h-screen flex items-center ${
                lang.locale == "ar" ? "font-cairo" : "font-raleway"
              } justify-center`}
            >
              {props.resources?.YOU_DONT_HAVE_REQ}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  let lang = getLangServerSide(context).locale;
  // var declaeration

  let getResourceAPI = {};
  let isAPIFiled = false;
  try {
    let resourceAPI = await axios.get(
      `${endpoints.GET_RESOURCES}/locale/${lang}`
    );

    if (resourceAPI.status == 200) {
      getResourceAPI = handleChangeResObj(resourceAPI.data);
    }

    // console.log("Resources ====>", getResourceAPI);
  } catch (err) {
    isAPIFiled = true;
  }

  // console.log(context.query.storeID);
  return {
    props: {
      resources: getResourceAPI,
      isAPIFiled: isAPIFiled,
      storeID: context.params.id,
      roomNo: context.query.roomNo,
    },
  };
}
export default Index;
