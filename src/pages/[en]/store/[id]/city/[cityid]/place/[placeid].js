import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
// local

import {
  StoreContext,
  CartContext,
} from "../../../../../../../context/appContext";
import endpoints from "../../../../../../../constant/endPoints";

// next js
import { useRouter } from "next/router";
import NavBar from "../../../../../../../components/NavBar";

import useWindowSize, {
  maxWidth,
} from "../../../../../../../hooks/useWindowSize";

import axios from "../../../../../../../utils/axios";
import getLang, {
  getLangServerSide,
  useLang,
} from "../../../../../../../utils/locale";
import Map from "../../../../../../../components/Map/Map";
import { handleChangeResObj } from "../../../../../../../utils/utilFunctions";

const CityDetailPage = ({ cityDetail, isAPIFiled, ...props }) => {
  const [store, updateStore] = useContext(StoreContext);
  const [colorSchema, setColorSchema] = useState();
  const [colorLoaded, setColorLoaded] = useState(false);
  const [hideRoom, setHideRoom] = useState();
  const [userPosition, setUserPosition] = useState({ lat: 0, lng: 0 });

  const router = useRouter();
  const size = useWindowSize();
  //LANGUAGE
  // const lang = useLang();
  const lang = props.lang;
  const setRtl = props.setRtl;

  const data =
    cityDetail?.data?.description != null ? cityDetail?.data?.description : "";

  const htmlText = data.replace(
    /!\[(.*?)\]\((.*?)\.png\)/g,
    '<img alt="$1" src="$2.png" class="py-4 rounded-[18px] font-raleway h-[40%] w-[40%] "/>'
  );

  //  setting colors
  useEffect(() => {
    getHideRoom();
    setColorSchema({
      backgroundColor: store?.backgroundColor
        ? store.backgroundColor
        : "#FCFCFF",
      fontColor: store?.fontColor ? store.fontColor : "#4F4F4F",
      borderColor: store?.borderColor ? store.borderColor : "#1B153D",
    });
    setColorLoaded(true);

    let getLocalStore = localStorage.getItem("store");
    if (getLocalStore == null) {
      axios
        .get(`${endpoints.GET_STORE_BY_ID}/${props.storeIdParam}`)
        .then((res) => {
          updateStore(res.data.data);
          console.log(res);
        })
        .catch((er) => {
          console.log(er);
        });
    }
  }, []);

  const getHideRoom = () => {
    const localRoom = localStorage.getItem("hideRoom");
    setHideRoom(localRoom === "true");
  };
  const title = cityDetail?.data?.titleLocale || cityDetail?.data?.title;

  //KM WORK START FORM HERE

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);
  const getDistanceFromLatLonInKm = (
    sourceLat,
    sourceLon,
    centerLat,
    centerLon
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(centerLat - sourceLat);
    const dLon = deg2rad(centerLon - sourceLon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(sourceLat)) *
        Math.cos(deg2rad(centerLat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Distance in km
    const result = R * c;
    const finalResult = result.toFixed(2);
    return finalResult;
  };

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const locationsWithDistance = cityDetail?.data?.locations?.map((location) => {
    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);
    const distanceTest = getDistanceFromLatLonInKm(
      userPosition.lat,
      userPosition.lng,
      latitude,
      longitude
    );
    return { location, distanceTest };
  });
  locationsWithDistance?.sort((a, b) => a.distanceTest - b.distanceTest);
  // console.log("THIS IS PLACE DATA", cityDetail.data);
  // console.log("THIS IS PLACE DATA", cityDetail.data.attributes.title);
  return (
    <>
      <Head>
        <title>{store?.name}</title>

        <meta
          property="og:image"
          content={store?.logo != null ? store?.logo?.previewUrl : ""}
        />
        <meta name="description" content={"City Detail Page"} />
        <meta property="og:title" content={store?.name} />
      </Head>
      <div>
        {colorLoaded && (
          <div
            style={{ backgroundColor: colorSchema.backgroundColor }}
            className="w-screen h-full min-h-screen flex justify-center flex-1 overflow-auto"
          >
            <NavBar
              lang={lang}
              setRtl={setRtl}
              leftIconVissible={true}
              leftIcon="back"
              hotelLogo={store?.logo !== null ? store?.logo?.previewUrl : ""}
              roomNo={router.query.roomNo}
              handleBackBtn={() => {
                const query = {
                  roomNo: router.query.roomNo,
                };
                if (hideRoom) {
                  query.hideRefCodeFromUser = false;
                  router.push({
                    pathname: `/${lang}/store/${props.storeIdParam}/city/${props.cityIdParam}`,
                    query: {
                      roomNo: router.query.roomNo,
                      hideRefCodeFromUser: hideRoom,
                      // cityID: router.query.cityID,
                      // storeID: router.query.storeID,
                    },
                  });
                } else {
                  router.push({
                    pathname: `/${lang}/store/${props.storeIdParam}/city/${props.cityIdParam}`,
                    query: {
                      // cityID: router.query.cityID,
                      roomNo: router.query.roomNo,
                      // storeID: router.query.storeID,
                    },
                  });
                }
              }}
            />

            {/* ======>>>> NAVEBAR ENDED HERE  <<<========= */}
            {isAPIFiled == false ? (
              <div className="w-screen flex flex-col items-center ">
                <div
                  style={{
                    height: size.width * 0.35,
                    borderRadius: "1rem",
                  }}
                  className="relative object-contain rounded-[14.66px] w-[85%] max-w-[650px] mt-20"
                >
                  <img
                    alt="city"
                    className="absolute h-full w-full object-cover rounded-[14.66px]  "
                    src={cityDetail?.data?.logo?.previewUrl}
                  />
                </div>
                <div
                  dir={setRtl}
                  className={`mt-4 items-center w-[85%]  ${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } max-w-[650px] text-[#333333] font-[700] text-[16.76px]`}
                >
                  {lang == "ar" && cityDetail?.data.titleLocale !== null
                    ? cityDetail?.data?.titleLocale
                    : cityDetail?.data?.titleLocale
                    ? cityDetail?.data?.titleLocale
                    : cityDetail?.data?.title}
                </div>

                {/* <div className="mt-2 items-center w-[85%] font-raleway max-w-[650px] text-[#333333] font-[500] text-[14px]">
               {text}
             </div> */}
                <div
                  className={`mt-2 items-center w-[85%] ${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  }  max-w-[650px] text-[#333333] font-[500] text-[14px]`}
                >
                  {lang == "ar" && cityDetail?.data?.descriptionLocale ? (
                    <div dir={setRtl}>
                      {" "}
                      {cityDetail?.data?.descriptionLocale}
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: htmlText }}></div>
                  )}
                </div>

                <div
                  className={`mt-4 items-center w-[85%] ${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } max-w-[650px] text-[#333333] font-[500] text-[14px] mb-5`}
                >
                  {lang == "ar" && cityDetail?.data.summaryLocale !== null
                    ? cityDetail?.data?.summaryLocale
                    : cityDetail?.data?.summaryLocale
                    ? cityDetail?.data?.summaryLocale
                    : cityDetail?.data?.summary}
                </div>
                {/* RENDERING MAP  */}
                <div>
                  {cityDetail?.data?.locations && (
                    <div
                      className={`max-w-[650px] justify-center flex flex-col  `}
                    >
                      <div
                        dir={setRtl}
                        className={`  mt-4 items-center w-[85%]  ${
                          lang == "ar" ? "font-cairo" : "font-raleway"
                        }  max-w-[650px] text-[#333333] font-[700] text-[16px]  flex justify-between scroll-auto`}
                      >
                        {props.resources?.GEO_LOCATION}
                      </div>
                      <div dir={setRtl} className="mb-24">
                        {locationsWithDistance.map(({ location }, index) => (
                          <div
                            key={index}
                            className="max-w-[650px] mt-3 "
                            style={{
                              width: size.width < 650 ? size.width * 0.85 : 650,
                              borderRadius: "18.75px",
                              overflow: "hidden",
                              // height: size.width < 650 ? size.width * 0.85 : 650,
                            }}
                          >
                            <Map
                              lang={lang}
                              setRtl={setRtl}
                              position={{
                                lat: Number(location.latitude),
                                lng: Number(location.longitude),
                              }}
                              BranchName={
                                lang == "ar"
                                  ? location.name.ar
                                  : location.name.en
                              }
                              addressData={
                                lang == "ar"
                                  ? location.address.ar
                                  : location.address.en
                              }
                              distanceTest={getDistanceFromLatLonInKm(
                                userPosition.lat,
                                userPosition.lng,
                                Number(location.latitude),
                                Number(location.longitude)
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-64 flex justify-center items-center">
                <p className="font-raleway  ">Somethig Went Wrong</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CityDetailPage;

export async function getServerSideProps(context) {
  // console.log("THIS IS PLACE ID ======>", context.params.placeid);
  let lang = getLangServerSide(context).locale;
  let setRtl = getLangServerSide(context).rtl;
  // console.log("THIS IS LANG===========>", lang);
  let props;
  let isAPIFiled = false;
  let storeIdParam = context.params.id;
  let cityIdParam = context.params.cityid;
  let resources;

  try {
    // props = await axios.get(
    //   `${endPoints.BASE_URL}/api/places/${context.query?.id}?populate=*`,
    //   {
    //     headers: {
    //       loacle: lang,
    //     },
    //   }
    // );

    //resources api call
    resources = await axios.get(`${endpoints.GET_RESOURCES}/locale/${lang}`);

    resources = handleChangeResObj(resources.data);

    //New Api call
    props = await axios.get(
      `${endpoints.GET_STORE_BY_ID}/${context.params.id}/city/${context.params.cityid}/places/${context.params.placeid}`,
      {
        headers: {
          locale: lang,
        },
      }
    );

    // console.log("this is city detail api data", props.data);
  } catch (er) {
    isAPIFiled = true;
    // replicating the object structure from the api
    props = { data: { data: [] } };
  }

  return {
    props: {
      resources,
      cityDetail: props.data,
      isAPIFiled: isAPIFiled,
      storeIdParam: storeIdParam,
      cityIdParam: cityIdParam,
      lang,
      setRtl,
    },
  };
}
