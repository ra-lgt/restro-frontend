import { useState, useEffect, useContext } from "react";
import Head from "next/head";
// next js
import { useRouter } from "next/router";
import axios from "../../../utils/axios";
import endpoints from "../../../constant/endPoints";

// local
import NavBar from "../../../components/NavBar";
import CategoryComponent from "../../../components/CategoryComponent";
import Drawer from "../../../components/Drawer";
// context
import { StoreContext } from "../../../context/appContext";
import { handleChangeResObj } from "../../../utils/utilFunctions";
import { maxWidth } from "../../../hooks/useWindowSize";

//Language Imports

import getLang, { getLangServerSide, useLang } from "../../../utils/locale";

export default function Home(props) {
  // variables
  const router = useRouter();
  const [store, updateStore] = useContext(StoreContext);

  const [colorSchema, setColorSchema] = useState();
  const [colorLoaded, setColorLoaded] = useState(false);
  const [isDrawerModalOpen, setDrawerModalOpen] = useState(false);
  const [isRoomNumber, setRoomNumber] = useState();
  const [showRoom, setShowRoom] = useState();
  const [hideRoom, setHideRoom] = useState();

  //LANGUAGE
  // const lang = useLang();
  const lang = props.lang;
  const setRtl = props.setRtl;
  //state
  const [storeState, setStoreState] = useState(
    props?.getStoreByIDRes ? props.getStoreByIDRes : null
  );
  // console.log(router);
  //CDM
  useEffect(() => {
    //console.log("this is store data ===>", props.getStoreByIDRes);

    //update store profile
    if (props.getStoreByIDRes && !props.isAPIFiled) {
      let tempStore = JSON.parse(JSON.stringify(props.getStoreByIDRes)); // making a copy
      delete tempStore.services; //deleting services array
      // updating our context
      updateStore(tempStore);
    }
  }, []);

  //  setting colors
  useEffect(() => {
    setColorSchema({
      backgroundColor: props.getStoreByIDRes?.backgroundColor
        ? props.getStoreByIDRes.backgroundColor
        : "#FCFCFF",
      fontColor: props.getStoreByIDRes?.fontColor
        ? props.getStoreByIDRes.fontColor
        : "#4F4F4F",
      borderColor: props.getStoreByIDRes?.borderColor
        ? props.getStoreByIDRes.borderColor
        : "#1B153D",
    });
    setColorLoaded(true);
  }, []);

  // Setting Room number in local Storage
  function MyComponent() {
    const roomNo = router.query.roomNo;
    if (typeof window !== "undefined") {
      //console.log("==============>", roomNo);
      localStorage.setItem("RoomNumber", roomNo);
    }
  }

  useEffect(() => {
    getHideRoom();
    getBoolean();
    MyComponent();

    const roomNumber = localStorage.getItem("RoomNumber");
    if (roomNumber) {
      setRoomNumber(roomNumber);
    }
  }, []);
  // console.log("STORE STATE====>", storeState);

  const getBoolean = () => {
    const showRoomNO = router.query?.hideRefCodeFromUser ? true : false;
    if (typeof window !== "undefined") {
      //console.log("==============>", roomNo);
      localStorage.setItem("hideRoom", showRoomNO);
      setShowRoom(showRoomNO);
    }
  };

  //checking is arabic is true in api
  const languageCodes = store?.languages?.map((item) => item.shortCodeISO);
  const isArabic = Array.isArray(languageCodes) && languageCodes.includes("AR");
  // console.log("store service", showRoom);

  //hide room number
  const getHideRoom = () => {
    const localRoom = localStorage.getItem("hideRoom");
    setHideRoom(localRoom === "true");
  };
  //maping services for meta data
  const serviceNames = storeState?.services.map((service) => service.name);
  const serviceNamesString = serviceNames.join(", ");

  return (
    <>
      <Head>
        <title>{storeState?.name}</title>
        <meta
          property="og:image"
          content={storeState?.logo != null ? storeState?.logo?.previewUrl : ""}
        />
        <meta name="description" content={serviceNamesString} />
        <meta property="og:title" content={storeState?.name} />
      </Head>
      {/* <Loader loader={false} /> */}
      {!props.isAPIFiled ? (
        colorLoaded && (
          <div
            style={{ backgroundColor: colorSchema.backgroundColor }}
            className={`flex flex-col h-full w-screen items-center min-h-screen `}
          >
            <div className="w-screen items-center justify-center max-w-[800px]">
              <NavBar
                lang={lang}
                setRtl={setRtl}
                leftIconVissible={true}
                roomNo={isRoomNumber}
                // hideRoom={showRoom}
                hotelLogo={
                  storeState?.logo != null ? storeState?.logo?.previewUrl : ""
                }
                handleBackBtn={() => setDrawerModalOpen(true)}
              />
            </div>
            {/* <p>{showRoomNO}</p> */}
            {/* drawer modal start here */}
            {isDrawerModalOpen && (
              <Drawer
                lang={lang}
                setRtl={setRtl}
                handleClose={() => setDrawerModalOpen(false)}
                showDrawer={isDrawerModalOpen}
                resourceApi={props?.resources}
                isArabic={isArabic}
                handleContactNavigation={() =>
                  router.push({
                    pathname: `/${lang}/store/${props.storeIdParam}/contact-detail`,
                    query: {
                      roomNo: router.query.roomNo,
                    },
                  })
                }
                handleNavigation={() =>
                  router.push({
                    pathname: `/${lang}/store/${props.storeIdParam}/order-history`,
                    query: {
                      // storeID: router.query.id,
                      roomNo: router.query.roomNo,
                    },
                  })
                }
                handleRequestHistoryNavigation={() =>
                  router.push({
                    pathname: `/${lang}/store/${props.storeIdParam}/request-history`,
                    query: {
                      roomNo: router.query.roomNo,
                    },
                  })
                }
              />
            )}
            {/* drawer modal ENd here */}
            <div
              style={{ backgroundColor: colorSchema.backgroundColor }}
              className={` w-full h-fit flex-col mb-5 items-center   `}
            >
              <div className="w-screen h-12"></div>

              <div
                id="text"
                className="mt-[15px] w-[100%] flex  items-center justify-center "
              >
                <div
                  dir={setRtl}
                  style={{ color: colorSchema.borderColor }}
                  className={` ${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } font-[600] text-[33px] leading-[40px] mt-[10px] mr-[25px] ml-[25px]`}
                >
                  {props?.getStoreByIDRes?.welcomeHeading
                    ? props?.getStoreByIDRes?.welcomeHeading
                    : props?.resources?.EVERYTHING}
                </div>
              </div>

              {/* <div
                className="h-10 w-10 bg-red-500 "
                onClick={() => {
                  setCookie("lang", lang === "ar" ? "en" : "ar", {
                    path: "/",
                    maxAge: 3600 * 24 * 365,
                  });
                  router.reload();
                }}
              ></div> */}
              <div className="w-screen flex flex-col items-center justify-center">
                {/*  mapping services */}
                <div
                  style={{ maxWidth: maxWidth }}
                  className={`w-screen items-start  flex flex-wrap ${
                    lang == "ar" ? "justify-between" : "justify-between"
                  }  mt-[10px] pb-2 px-4 `}
                >
                  {storeState != null ? (
                    storeState.services.map((category, index) => {
                      {
                        return (
                          <CategoryComponent
                            lang={lang}
                            setRtl={setRtl}
                            key={index}
                            item={category}
                            className={
                              category?.viewType === "Grid"
                                ? "w-[49%]"
                                : "w-[100%]"
                            }
                            onClick={() => {
                              category.serviceType !== "Request"
                                ? router.push({
                                    pathname: `/${lang}/store/${props.storeIdParam}/service/${category.uuid}`,
                                    query: {
                                      // storeID: router.query.id,
                                      // serviceID: category.uuid,
                                      roomNo: isRoomNumber,
                                      hideRefCodeFromUser: hideRoom
                                        ? false
                                        : true,
                                    },
                                  })
                                : router.push({
                                    pathname: `/${lang}/store/${props.storeIdParam}/service/${category.uuid}/request/${category.id}`,
                                    query: {
                                      roomNo: isRoomNumber,
                                    },
                                  });
                            }}
                          />
                        );
                      }
                    })
                  ) : (
                    <div className="flex items-center justify-center w-screen mt-[150px] ">
                      <p className="font-raleway text-[20px] ">
                        Data is not available for this store
                      </p>
                    </div>
                  )}
                </div>
                {/*  mapping services end */}

                {/* mapping cities  */}

                {storeState?.city != null && (
                  <CategoryComponent
                    lang={lang}
                    setRtl={setRtl}
                    item={{
                      ...storeState?.city,
                      name: props?.resources?.ABOUT_CITY,
                      summary:
                        lang == "ar"
                          ? storeState?.city?.descriptionLocale
                          : storeState?.city?.description,
                    }}
                    className={"w-[90%] max-w-[780px]"}
                    onClick={() => {
                      router.push({
                        pathname: `/${lang}/store/${props.storeIdParam}/city/${storeState?.city?.id}`,
                        query: {
                          // storeID: router.query.id,
                          // cityID: storeState?.city?.id,
                          roomNo: isRoomNumber,
                        },
                      });
                    }}
                  />
                )}

                {/* mapping cities  end */}
              </div>
            </div>
          </div>
        )
      ) : (
        <div
          className={`flex items-center justify-center w-screen mt-[200px] ${
            lang == "ar" ? "font-cairo" : "font-raleway"
          }`}
        >
          <p className="font-raleway text-[20px] ">
            {props?.resources?.SOMETHING_WENT_WRONG}
          </p>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  // console.log("lang =>", getLangServerSide(context));
  // console.log("THIS IS ID PAGE CONTEX", context?.params?.id);
  let storeIdParam = context?.params?.id;
  let lang = getLangServerSide(context).locale;
  // console.log("language", lang);
  let setRtl = getLangServerSide(context).rtl;
  // console.log("THIS IS LANG ========>", lang);
  // console.log("context ===>", context.query);
  //   console.log("context ===>", context.query?.id, context.query?.roomNo);
  // validations
  if (!context.query?.id) {
    return {
      notFound: true,
    };
  }
  // var declaeration
  let getStoreByIdRes;
  let getResourceAPI = {};
  let isAPIFiled = false;
  // let loading = true;
  try {
    getStoreByIdRes = await axios.get(
      `${endpoints.GET_STORE_BY_ID}/${context.query.id}`,
      {
        headers: {
          locale: lang,
        },
      }
    );
    let resourceAPI = await axios.get(
      `${endpoints.GET_RESOURCES}/locale/${lang}`
    );
    // console.log("===========>", getStoreByIdRes.status);
    // console.log("resources response : ", resourceAPI.data);
    // now checking if successfull
    if (resourceAPI.status == 200) {
      // loading = false;
      // converting [{Key:"X",value:"abc"}] to {X:"abc"}
      getResourceAPI = handleChangeResObj(resourceAPI.data);
    }
    // console.log("getStoreById ====>", getStoreByIdRes.data);
    //console.log("Resouces ====>", getResourceAPI);
  } catch (err) {
    // console.log("err =>", err.response);
    isAPIFiled = true;
    // loading = false;
  }

  // api call
  return {
    props: {
      getStoreByIDRes: getStoreByIdRes?.data?.data,
      resources: getResourceAPI,
      isAPIFiled: isAPIFiled,
      storeIdParam: storeIdParam,
      lang,
      setRtl,
      // loading: loading,
    },
  };
}
