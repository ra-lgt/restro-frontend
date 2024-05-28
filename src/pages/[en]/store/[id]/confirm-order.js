import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";

//local imports
import NavBar from "../../../../components/NavBar";
import { useRouter } from "next/router";
import axios from "../../../../utils/axios";

import endpoints from "../../../../constant/endPoints";

import { handleChangeResObj } from "../../../../utils/utilFunctions";
import { StoreContext, CartContext } from "../../../../context/appContext";
//Language Imports

import getLang, { getLangServerSide, useLang } from "../../../../utils/locale";

const Index = (props) => {
  //LANGUAGE
  // const lang = useLang();
  const lang = props.lang;
  const setRtl = props.setRtl;
  // var
  const [colorSchema, setColorSchema] = useState();
  const [colorLoaded, setColorLoaded] = useState(false);
  const [isRoomNumber, setRoomNumber] = useState();
  const [hideRoom, setHideRoom] = useState();
  const [cartCont, updateCartCont] = useContext(CartContext);
  const [store, updateStore] = useContext(StoreContext);

  const router = useRouter();
  const orderNo = router.query.orderNo;

  //  setting colors
  useEffect(() => {
    setColorSchema({
      backgroundColor: store?.backgroundColor
        ? store.backgroundColor
        : "#FCFCFF",
      fontColor: store?.fontColor ? store.fontColor : "#4F4F4F",
      borderColor: store?.borderColor ? store.borderColor : "#1B153D",
    });
    setColorLoaded(true);
  }, []);

  // get roomnumber from localstorage
  useEffect(() => {
    getHideRoom();
    const roomNumber = localStorage.getItem("RoomNumber");
    if (roomNumber) {
      setRoomNumber(roomNumber);
    }

    let getLocalStore = localStorage.getItem("store");
    if (getLocalStore == null) {
      axios
        .get(`${endpoints.GET_STORE_BY_ID}/${props.storeIdParam}`)
        .then((res) => {
          updateStore(res.data.data);
          // console.log(res);
        })
        .catch((er) => {
          // console.log(er);
        });
    }
  }, []);

  const getHideRoom = () => {
    const localRoom = localStorage.getItem("hideRoom");
    // console.log("this is boolean value on confirm order page ", localRoom);
    setHideRoom(localRoom === "true");
  };

  //Empty Cart Item
  const handleEmptyCart = () => {
    updateCartCont({ serviceID: "", products: [] });
  };

  //order and request message control
  const request = router.query.request;
  const requestMessageKey = `REQUEST_SUCCESS_MESSAGE_${request
    ?.toUpperCase()
    ?.replace(" ", "_")}`;

  const message =
    request && props.resources?.[requestMessageKey]
      ? props.resources[requestMessageKey]
      : request && !props.resources?.[requestMessageKey]
      ? props.resources.REQ_GENERAL_MESSAGE
      : props.resources?.WE_ARE_PREPARING;

  // console.log("this is confirm order page=====>", router.query.request);
  return (
    <>
      <Head>
        <title>{store?.name}</title>

        <meta
          property="og:image"
          content={store?.logo != null ? store?.logo?.previewUrl : ""}
        />
        <meta name="description" content={"Confirm-Order Page"} />
        <meta property="og:title" content={store?.name} />
      </Head>{" "}
      {colorLoaded && (
        <div
          style={{ backgroundColor: colorSchema.backgroundColor }}
          className={`w-screen flex flex-col items-center`}
        >
          <NavBar
            lang={lang}
            dir={setRtl}
            leftIconVissible={false}
            leftIcon="back"
            hotelLogo={store?.logo !== null ? store?.logo?.previewUrl : ""}
            rightIcon="roomNo"
            roomNo={isRoomNumber}
            // handleBackBtn={() => router.back()}
          />
          <div
            style={{ backgroundColor: colorSchema.backgroundColor }}
            className={`h-screen w-screen `}
          >
            <div className="h-8"></div>
            <div className="flex w-screen justify-center items-center mt-[143px] ">
              <img src="/checked.svg" className="h-[56px] w-[56px]" />
            </div>

            <div
              id="order-no"
              className={`flex items-center justify-center  mt-6 text-[20px] ${
                lang == "ar" ? "flex-row-reverse " : ""
              }`}
            >
              <p
                className={`  ${
                  lang == "ar" ? "ml-2 font-cairo" : "mr-2 font-raleway"
                }`}
              >
                {router.query?.request
                  ? props?.resources?.REQ_NO
                  : props?.resources?.order_no}
              </p>
              <p
                className={`font-bold ${
                  lang == "ar" ? " font-cairo" : " font-raleway"
                }`}
              >
                {" "}
                {orderNo}
              </p>
            </div>

            <div className="w-screen flex justify-center items-center   mt-[20px]">
              <p
                style={{ color: colorSchema.borderColor }}
                className={`${
                  lang == "ar" ? " font-cairo" : " font-raleway"
                } text-[26px] font-[500] leading-[30px]  h-[30px] tracking-[-0.24 px] `}
              >
                {router.query.request
                  ? props.resources?.THANKS_REQUEST
                  : props.resources?.about}
              </p>
            </div>

            <div className="w-screen flex justify-center items-center   mt-[12px]">
              <p
                style={{ color: colorSchema.fontColor }}
                className={`${
                  lang == "ar" ? " font-cairo" : " font-raleway"
                } text-[18px] font-[500] leading-[26px] w-[316px] tracking-[-0.24 px] text-center`}
              >
                {/* {router.query.request
                  ? props.resources?.[
                      `REQUEST_MESSAGE_${router.query.request
                        ?.toUpperCase()
                        ?.replace("+", "_")}`
                    ]
                  : props.resources?.WE_ARE_PREPARING} */}
                {message}
              </p>
            </div>

            <div className="w-screen flex flex-col justify-center items-center mt-[24px]">
              <div
                id="continue-shopping-button"
                className=" cursor-pointer w-[256px] h-[59px] rounded-[20px] bg-[#FFFFFF]  flex justify-center items-center shadow-[0_20px_36px_0px_rgba(23,20,57,0.06)]  "
                onClick={() => {
                  router.query.request ? null : handleEmptyCart();
                  const query = {
                    roomNo: router.query.roomNo,
                  };
                  if (hideRoom) {
                    query.hideRefCodeFromUser = false;
                    router.push({
                      pathname: `/${lang}/store/detail/${store.uuid}`,
                      query: {
                        roomNo: isRoomNumber,
                        hideRefCodeFromUser: hideRoom,
                      },
                    });
                  } else {
                    router.push({
                      pathname: `/${lang}/store/detail/${store.uuid}`,
                      query: {
                        roomNo: isRoomNumber,
                      },
                    });
                  }
                }}
              >
                <div
                  style={{ color: colorSchema.borderColor }}
                  className={`${
                    lang == "ar" ? " font-cairo" : " font-raleway"
                  } font-[600] text-[${colorSchema.borderColor}] text-[16px]`}
                >
                  {props?.resources?.CONTINUE_SHOP}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  let lang = getLangServerSide(context).locale;
  let setRtl = getLangServerSide(context).rtl;
  // var declaeration

  let getResourceAPI = {};
  let isAPIFiled = false;
  let storeIdParam = context.params?.id;
  // console.log("THIS IS CONFIRM ORDER", storeIdParam);
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

  return {
    props: {
      resources: getResourceAPI,
      isAPIFiled: isAPIFiled,
      storeIdParam: storeIdParam,
      lang,
      setRtl,
    },
  };
}

// export async function getServerSideProps(context) {
//   console.log("THIS IS NEW CONFIRM ORDER", context);
//   return {
//     props: {},
//   };
// }
export default Index;
