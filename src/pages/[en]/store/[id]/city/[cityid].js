import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";

// next js
import { useRouter } from "next/router";
import NavBar from "../../../../../components/NavBar";
import AboutCityComponent from "../../../../../components/AboutCityComponent";
import TopBarComponent from "../../../../../components/TopBarComponent";
import CategoryHeader from "../../../../../components/CategoryHeader";
// context
import { StoreContext, CartContext } from "../../../../../context/appContext";
import axios from "../../../../../utils/axios";
import endpoints from "../../../../../constant/endPoints";
import useWindowSize, { maxWidth } from "../../../../../hooks/useWindowSize";

import getLang, {
  getLangServerSide,
  useLang,
} from "../../../../../utils/locale";

const Index = ({ apiRes, isAPIFiled, ...props }) => {
  const [hideRoom, setHideRoom] = useState();
  const [cartCont, updateCartCont] = useContext(CartContext);
  const [store, updateStore] = useContext(StoreContext);
  const [colorSchema, setColorSchema] = useState();
  const [colorLoaded, setColorLoaded] = useState(false);

  const [isRoomNumber, setRoomNumber] = useState(null);

  //state
  const [state, setState] = useState(isAPIFiled ? [] : apiRes.categories);
  const [selectedList, setSelectedList] = useState(
    isAPIFiled ? "" : state[0]?.name
  );

  const router = useRouter();
  //LANGUAGE
  // const lang = useLang();
  const lang = props.lang;
  const setRtl = props.setRtl;
  const size = useWindowSize();

  useEffect(() => {
    getHideRoom();
  }, []);
  const getHideRoom = () => {
    const localRoom = localStorage.getItem("hideRoom");
    // console.log("THIS IS ORDER HISTORY HIDE VALUE", localRoom);
    setHideRoom(localRoom === "true");
  };

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

  // CDM
  useEffect(() => {
    // CART sync logic
    let cartLocalStr = localStorage.getItem("cart");
    if (cartLocalStr && !isAPIFiled) {
      let serializedCartObj = JSON.parse(cartLocalStr);

      // now check if the service id is same
      if (serializedCartObj?.serviceID) {
        // syncig cart logic.
        let updateState = [...apiRes.categories];
        for (let c = 0; c < updateState.length; c++) {
          let updatedCate = { ...updateState[c] };
          for (let p = 0; p < updatedCate?.products.length; p++) {
            let tempUpdateProd = {
              ...updateState[c].products[p],
            };

            let productInCart = serializedCartObj.products.find(
              (p) => p.uuid == tempUpdateProd.uuid
            );
            if (productInCart != undefined) {
              tempUpdateProd.inCart = productInCart.total;

              // updating obj into array
              updateState[c].products[p] = tempUpdateProd;
            }
          }
        }

        // state update
        setState(updateState);
        updateCartCont(serializedCartObj);
      }
    } // not in cart if

    // Getting RoomNo
    let getLocalRoomNo = localStorage.getItem("RoomNumber");
    if (getLocalRoomNo == null) {
      setRoomNumber(router.query.roomNo);
      localStorage.setItem("RoomNumber", router.query.roomNo);
    }
    // console.log("this is state room no ", isRoomNumber);
    // console.log("Room number from query", router.query.roomNo);

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

    return () => {};
  }, []);

  //   console.log("THIS IS NEW ABOUT PAGE", props.storeIdParam);
  return (
    <>
      <Head>
        <title>{store?.name}</title>

        <meta
          property="og:image"
          content={store?.logo != null ? store?.logo?.previewUrl : ""}
        />
        <meta name="description" content={"About City Page"} />
        <meta property="og:title" content={store?.name} />
      </Head>
      <div>
        {colorLoaded && (
          <div
            style={{ backgroundColor: colorSchema.backgroundColor }}
            className={`w-screen h-full min-h-screen items-center flex flex-col flex-1  `}
          >
            <NavBar
              lang={lang}
              setRtl={setRtl}
              leftIconVissible={true}
              leftIcon="back"
              hotelLogo={store?.logo !== null ? store?.logo?.previewUrl : ""}
              roomNo={router.query.roomNo}
              itemInCart={cartCont?.products?.length}
              handleBackBtn={() => {
                const query = {
                  roomNo: router.query.roomNo,
                };
                if (hideRoom) {
                  query.hideRefCodeFromUser = false;
                  router.push({
                    pathname: `/${lang}/store/detail/${store.uuid}`,
                    query: {
                      roomNo: router.query.roomNo,
                      hideRefCodeFromUser: hideRoom,
                    },
                  });
                } else {
                  router.push({
                    pathname: `/${lang}/store/detail/${store.uuid}`,
                    query: {
                      roomNo: router.query.roomNo,
                    },
                  });
                }
              }}
            />
            {isAPIFiled ? (
              <div
                dir={setRtl}
                className={`w-screen h-screen flex flex-1 justify-center items-center  pt-[75px] `}
              >
                <p className="font-raleway ">
                  Something went wrong. Please try again later{" "}
                </p>
              </div>
            ) : (
              <div
                dir={setRtl}
                style={{
                  backgroundColor: colorSchema.backgroundColor,
                  maxWidth: maxWidth,
                }}
                className={` w-full  h-fit pt-[75px]  `}
              >
                <div className="flex items-center justify-center mt-[10px] ">
                  <TopBarComponent
                    lang={lang}
                    setRtl={setRtl}
                    data={state}
                    selected={selectedList}
                    setSelected={setSelectedList}
                  />
                </div>

                <div className="pb-5 flex flex-col justify-center items-center  ">
                  {state.length > 0 ? (
                    <>
                      {state.map((singleCate, categoryInd) => {
                        return (
                          <div key={categoryInd}>
                            {singleCate?.products.length > 0 && (
                              <div
                                id={singleCate.name}
                                className="flex flex-col  justify-center items-center   mt-5"
                              >
                                <CategoryHeader
                                  lang={lang}
                                  setRtl={setRtl}
                                  title={
                                    lang == "ar"
                                      ? singleCate?.nameArabic
                                      : singleCate.name
                                  }
                                />

                                {singleCate.products.map((item, prodInd) => (
                                  // console.log(item)
                                  <div
                                    key={`${item.id}-${prodInd}`}
                                    className=" max-w-[780px] w-screen  mt-1 flex items-center justify-center  "
                                    id={`${item.id}-${prodInd}`}
                                  >
                                    <AboutCityComponent
                                      lang={lang}
                                      setRtl={setRtl}
                                      key={prodInd}
                                      item={item}
                                      className={"w-[90%] max-w-[780px]"}
                                      onClick={() => {
                                        // console.log("item", item);
                                        // setscrollToID(`${item.id}-${prodInd}`);
                                        // setDetailsModal(item);
                                        router.push({
                                          pathname: `/${lang}/store/${props.storeIdParam}/city/${props.cityIdParam}/place/${item.id}`,
                                          query: {
                                            // cityID: router.query.cityID,
                                            roomNo: router.query.roomNo,
                                            // storeID: router.query.storeID,
                                            // id: item.id,
                                          },
                                        });
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="mt-64 flex justify-center items-center">
                      <p className="font-raleway  ">
                        No Item found for this categories
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Index;

export async function getServerSideProps(context) {
  let lang = getLangServerSide(context).locale;
  let setRtl = getLangServerSide(context).rtl;
  //   console.log("this is new page COntext", context);

  // validations
  if (!context.params.cityid || !context.params.id) {
    return {
      notFound: true,
    };
  }

  // var declaeration
  let getCityData = {};
  let isAPIFiled = false;
  let storeIdParam = context.params.id;
  let cityIdParam = context.params.cityid;

  try {
    let cityAPICall = await axios.get(
      `${endpoints.GET_STORE_BY_ID}/${context.params.id}/city/${context.params.cityid}/places`,
      {
        headers: {
          locale: lang,
        },
      }
    );
    let tempGetCityData = cityAPICall.data.data;
    // console.log("THIS IS PLACES RESPONCE", cityAPICall.data.data);
    // UPDATING response adding require properties
    let addingRequiredObj = {
      ...tempGetCityData,
      categories: tempGetCityData?.categories.map((singelCate) => {
        return {
          displayOrder: singelCate.displayOrder,
          id: singelCate.id,
          name: singelCate.name,
          nameArabic: singelCate?.nameLocale
            ? singelCate?.nameLocale
            : singelCate.name,

          products: singelCate.places.map((singlePlace, index) => {
            // console.log("Places===> ", singelCate.places);
            return {
              id: singlePlace?.id,
              name: singlePlace?.title,
              nameArabic: singlePlace?.titleLocale
                ? singlePlace?.titleLocale
                : singlePlace?.title,
              summary: singlePlace?.summary,
              summaryArabic: singlePlace?.summaryLocale
                ? singlePlace?.summaryLocale
                : singlePlace?.summary,
              logo: singlePlace?.logo,
              // description: singlePlace?.description,
            };
          }),
        };
      }),
    };
    // console.log("addingRequiredObj ===>", JSON.stringify(addingRequiredObj));
    getCityData = addingRequiredObj;
  } catch (err) {
    isAPIFiled = true;
  }
  return {
    props: {
      apiRes: getCityData,
      isAPIFiled: isAPIFiled,
      storeIdParam: storeIdParam,
      cityIdParam: cityIdParam,
      lang,
      setRtl,
    },
  };
}
