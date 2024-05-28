import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import NavBar from "../../../../../../../components/NavBar";
import { useRouter } from "next/router";
import useWindowSize from "../../../../../../../hooks/useWindowSize";
import endpoints from "../../../../../../../constant/endPoints";
import RadioButton from "../../../../../../../components/RadioButton";
import ImageDisplayComponent from "../../../../../../../components/ImageDisplayComponent";

import { useLang, getLangServerSide } from "../../../../../../../utils/locale";
import {
  CartContext,
  StoreContext,
} from "../../../../../../../context/appContext";
import axios from "../../../../../../../utils/axios";
import Map from "../../../../../../../components/Map/Map";
import MessageModal from "../../../../../../../components/MessageModal";
import { handleChangeResObj } from "../../../../../../../utils/utilFunctions";

const Product = ({ product = productStructure, isAPIFailed, ...props }) => {
  const [store, updateStore] = useContext(StoreContext);
  const [cartCont, updateCartCont] = useContext(CartContext);
  const [displayImageModal, setDisplayImageModal] = useState(false);

  const [colorSchema, setColorSchema] = useState({
    backgroundColor: "#FCFCFF",
    fontColor: "#4F4F4F",
    borderColor: "#1B153D",
  });
  const [messageModal, setMessageModal] = useState({
    isOpen: false,
    headingTxt: "",
    alertMessage: "",
  });
  const [colorLoaded, setColorLoaded] = useState(false);
  const [hideRoom, setHideRoom] = useState();

  const router = useRouter();
  const size = useWindowSize();
  // const lang = useLang();
  const lang = props.lang;
  const setRtl = props.setRtl;
  const serviceFee = router?.query?.serviceFee;

  // data
  const [inventoryIndex, setInventoryIndex] = useState(0);
  const [noOfItems, setNoOfItems] = useState(1);
  const [userPosition, setUserPosition] = useState({ lat: 0, lng: 0 });
  //  setting colors
  useEffect(() => {
    getHideRoom();
    let getLocalStore = localStorage.getItem("store");
    if (getLocalStore == null) {
      axios
        .get(`${endpoints.GET_STORE_BY_ID}/${props.storeId}`)
        .then((res) => {
          updateStore(res.data.data);
          // console.log(res);
        })
        .catch((er) => {
          // console.log(er);
        });
    }

    setColorSchema({
      backgroundColor: store?.backgroundColor
        ? store.backgroundColor
        : "#FCFCFF",
      fontColor: store?.fontColor ? store.fontColor : "#4F4F4F",
      borderColor: store?.borderColor ? store.borderColor : "#1B153D",
    });

    setColorLoaded(true);
  }, []);

  // console.log("THIS IS PRODUCT PAGE STORE =============>", store);

  const getHideRoom = () => {
    const localRoom = localStorage.getItem("hideRoom");
    if (localRoom) {
      setHideRoom(localRoom === "true");
    } else {
      localStorage.setItem("hideRoom", router.query.hideRefCodeFromUser);
      setHideRoom(localRoom === "true");
    }
  };

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart"));
    updateCartCont(cartData);
  }, []);

  const addToCart = () => {
    const payload = {
      imageUrl: product.images[0].previewUrl,
      //  SKU: product.SKU,
      id: product.id,
      uuid: product.uuid,
      name: product.name,
      total: noOfItems,
      serviceFee: Number(serviceFee),
      inventories: [
        {
          price: product.inventories[inventoryIndex].price,
          currency: product.inventories[inventoryIndex].currency,
          inventoryID: product.inventories[inventoryIndex].id,
          title: product.inventories[inventoryIndex]?.option?.title,
          inCart: noOfItems,
        },
      ],
    };

    const cartData = JSON.parse(localStorage.getItem("cart"));
    // console.log("cart :", cartData);
    // if cart is empty
    if (cartData?.serviceId == null) {
      localStorage.setItem(
        "cart",
        JSON.stringify({
          serviceId: props.serviceId,
          products: [],
        })
      );
      const cartData = JSON.parse(localStorage.getItem("cart"));
      cartData.products.push(payload);

      updateCartCont(cartData);

      localStorage.setItem("cart", JSON.stringify(cartData));
    } else if (cartData?.serviceId !== props?.serviceId) {
      setMessageModal({
        isOpen: true,
        headingTxt: props.resources?.START_NEW_BASKET,
        alertMessage: props.resources?.A_NEW_ORDER_WILL,
      });
    } else if (
      cartData?.products.length != 0 &&
      cartData?.products[0]?.uuid !== product?.uuid
    ) {
      setMessageModal({
        isOpen: true,
        headingTxt: props.resources?.START_NEW_BASKET,
        alertMessage: props.resources?.A_NEW_ORDER_WILL,
      });
    }
    // if cart is not empty
    else {
      const productIndexInCart = cartData.products.findIndex(
        (item) => item.id === product.id
      );
      // if product is already in cart
      if (productIndexInCart !== -1) {
        cartData.products[productIndexInCart].total += noOfItems;
        cartData.products[productIndexInCart].inventories[0].inCart +=
          noOfItems;

        updateCartCont(cartData);
        localStorage.setItem("cart", JSON.stringify(cartData));
      }
      // if product is not in cart
      else {
        cartData.products.push(payload);
      }

      updateCartCont(cartData);
      localStorage.setItem("cart", JSON.stringify(cartData));
    }
    // console.log(payload);
  };

  const goBack = () => {
    const query = {
      roomNo: router.query.roomNo,
    };
    if (hideRoom) {
      query.hideRefCodeFromUser = false;
    }
    router.replace({
      pathname: `/${lang}/store/${props.storeId}/service/${props.serviceId}`,
      query: query,
    });
  };

  let discount =
    ((product.inventories[inventoryIndex].maxPrice -
      product.inventories[inventoryIndex].price) /
      product.inventories[inventoryIndex].maxPrice) *
    100;

  discount = Math.round(discount);

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

  const locationsWithDistance = product?.locations?.map((location) => {
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

  //Adding total product to show in cart icon
  function calculateTotal(cartArray) {
    if (!Array.isArray(cartArray)) {
      // console.error("cartArray is not an array.");
      return 0;
    }

    let totalSum = 0;
    for (const product of cartArray) {
      if (product && typeof product === "object" && "total" in product) {
        totalSum += product.total;
      }
    }
    return totalSum;
  }

  return (
    <>
      <Head>
        <title>{store?.name}</title>

        <meta
          property="og:image"
          content={store?.logo != null ? store?.logo?.previewUrl : ""}
        />
        <meta name="description" content={"Product Page"} />
        <meta property="og:title" content={store?.name} />
      </Head>
      <MessageModal
        lang={lang}
        setRtl={setRtl}
        showModal={messageModal.isOpen}
        headingTxt={messageModal.headingTxt}
        alertMessage={messageModal.alertMessage}
        resource={props?.resources}
        handleUserChoice={(userChoice) => {
          if (userChoice) {
            localStorage.setItem(
              "cart",
              JSON.stringify({
                serviceId: props.serviceId,
                products: [],
              })
            );
            addToCart();
          }
          // closing modal
          setMessageModal({
            isOpen: false,
            headingTxt: "",
            alertMessage: "",
          });
        }}
      />

      {displayImageModal && (
        <div dir={setRtl} className="flex justify-center ">
          <ImageDisplayComponent
            lang={lang}
            setRtl={setRtl}
            handleCloseImage={() => setDisplayImageModal(false)}
            showDrawer={displayImageModal}
            image={product.images?.[0].previewUrl}
            // handleNavigation={() => console.log("THis is working fine")}
          />
        </div>
      )}
      {colorLoaded && (
        <div
          style={{ backgroundColor: colorSchema.backgroundColor }}
          className="w-screen h-full min-h-screen flex justify-center flex-1 scroll-auto"
        >
          <NavBar
            lang={lang}
            setRtl={setRtl}
            leftIconVissible={true}
            leftIcon="back"
            hotelLogo={store?.logo !== null ? store?.logo?.previewUrl : ""}
            rightIcon="cart"
            handleCartClick={() =>
              router.replace({
                pathname: `/${lang}/store/${props.storeId}/service/${props.serviceId}/cart`,
                query: {
                  // storeID: props.storeIdParam,
                  // serviceID: props.serviceIdParam,
                  roomNo: router.query.roomNo,
                },
              })
            }
            // itemInCart={cartCont?.products?.length}
            itemInCart={calculateTotal(cartCont?.products)}
            handleBackBtn={() => {
              const query = {
                roomNo: router.query.roomNo,
              };
              if (hideRoom) {
                query.hideRefCodeFromUser = false;
              }
              router.push({
                pathname: `/${lang}/store/${props.storeId}/service/${props.serviceId}`,
                query: query,
              });
            }}
          />
          {!isAPIFailed ? (
            <div className="h-screen flex flex-col items-center w-screen pb-5">
              <div className="flex-1 w-full  scrollbar-hide ">
                <div className="flex flex-col items-center ">
                  {/*Image and name*/}
                  <div
                    onClick={() => setDisplayImageModal(true)}
                    style={{
                      height: size.width * 0.35,
                      borderRadius: "1rem",
                    }}
                    className="relative object-contain rounded-[14.66px] w-[85%] max-w-[650px] mt-20"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="absolute h-full w-full object-cover rounded-[14.66px]  "
                      src={product.images?.[0].previewUrl}
                      alt="product image"
                    />
                  </div>
                  <div
                    dir={setRtl}
                    className="mt-4  gap-5 w-[85%] font-raleway max-w-[650px] text-[#333333] font-[700] text-[16.76px] flex justify-between "
                  >
                    <div className="flex flex-col w-screen ">
                      <div
                        className={`${
                          lang == "ar" ? "font-cairo" : "font-raleway"
                        }  w-[100%] text-[20px]  `}
                      >
                        {/* {lang != "en" && product?.nameLocale
                        ? product?.nameLocale
                        : product.name} */}

                        {
                          (product.name =
                            lang === "ar" && product.nameLocale
                              ? product.nameLocale
                              : product.nameLocale
                              ? product.nameLocale
                              : product.name)
                        }
                      </div>
                      <div
                        id="modal-price"
                        className="w-[100%] mt-2 max-w-[650px] font-raleway font-bold text-[19px] text-[#4F4F4F]  text-start  "
                      >
                        <div className="flex  justify-start  items-start ">
                          {product?.inventories[inventoryIndex]?.maxPrice ? (
                            <div
                              className={`flex   ${
                                lang == "ar" ? "items-end " : "items-start"
                              }   justify-start   `}
                            >
                              <div className="flex ">
                                <p className=" ">
                                  {
                                    product?.inventories[inventoryIndex]
                                      ?.currency
                                  }{" "}
                                  {product?.inventories[inventoryIndex]?.price}
                                </p>
                                <div
                                  className={`${
                                    lang == "ar"
                                      ? "flex flex-row-reverse"
                                      : "flex"
                                  } `}
                                >
                                  <p className=" line-through ml-2  ">
                                    {
                                      product?.inventories[inventoryIndex]
                                        ?.currency
                                    }{" "}
                                    {
                                      product?.inventories[inventoryIndex]
                                        ?.maxPrice
                                    }
                                  </p>
                                </div>
                              </div>

                              <div className="items-start">
                                <p
                                  className={` text-[19px] text-red-500  ${
                                    lang == "ar" ? "ml-2" : "ml-2"
                                  }`}
                                >
                                  {discount} % {props?.resources?.OFF}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className=" ">
                              {product?.inventories[inventoryIndex]?.currency}{" "}
                              {product?.inventories[inventoryIndex]?.price}
                            </p>
                          )}
                          {/* {product?.inventories[inventoryIndex]?.price} */}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*Inventory*/}
                  {product?.inventories.length > 1 && (
                    <div
                      dir={setRtl}
                      id="modal-radio-button"
                      className={`w-[85%]  ${
                        product?.inventories.length > 1 ? "h-[15%]" : null
                      }h-[15%]  items-center self-center justify-center mt-2  overflow-y-auto scrollbar-hide max-w-[650px]`}
                    >
                      {product?.inventories.map((item, index) => (
                        <RadioButton
                          lang={lang}
                          setRtl={setRtl}
                          key={index}
                          inventory={item}
                          radioText={
                            props.resources[
                              `OPTION_${item?.option?.title
                                ?.toUpperCase()
                                ?.replace(" ", "_")}`
                            ]
                          }
                          selected={
                            product?.inventories[inventoryIndex]?.id === item.id
                          }
                          setSelected={(userChoice) => {
                            if (userChoice) {
                              setInventoryIndex(index);
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/*More Info*/}
                  {((lang != "en" && product.summaryLocale) ||
                    product.summary) && (
                    <>
                      {/* <div
                        dir={setRtl}
                        className="mt-4 items-center w-[85%] font-raleway max-w-[650px] text-[#333333] font-[700] text-[16px] flex justify-between"
                      >
                        Summary
                      </div> */}
                      <div
                        dir={setRtl}
                        className={`items-center w-[85%] ${
                          lang == "ar" ? "font-cairo" : "font-raleway"
                        }  max-w-[650px] text-[#333333] font-[500] text-[14px] text-justify mt-2 `}
                      >
                        {lang != "en" && product.summaryLocale
                          ? product.summaryLocale
                          : product.summary}
                      </div>
                    </>
                  )}

                  {((lang != "en" && product.descriptionLocale) ||
                    product.description) && (
                    <>
                      <div
                        dir={setRtl}
                        className={`mt-4 items-center w-[85%] ${
                          lang == "ar" ? "font-cairo" : "font-raleway"
                        } max-w-[650px] text-[#333333] font-[700] text-[16px] flex justify-between `}
                      >
                        {props.resources.DESCRIPTION}
                      </div>

                      <div
                        dir={setRtl}
                        className={`items-center w-[85%] ${
                          lang == "ar" ? "font-cairo" : "font-raleway"
                        }  max-w-[650px] text-[#333333] font-[500] text-[14px] mt-2 `}
                      >
                        <div
                          style={{ wordWrap: "break-word" }}
                          className="w-[85%] "
                          dangerouslySetInnerHTML={{
                            __html:
                              lang != "en" && product.descriptionLocale
                                ? product.descriptionLocale
                                : product.description,
                          }}
                        />
                      </div>
                    </>
                  )}

                  {/* {product?.latitude && product?.longitude && ( */}
                  <>
                    {product?.locations && (
                      <>
                        {product?.locations.length >= 1 && (
                          <div
                            dir={setRtl}
                            className={`  mt-4 items-center w-[85%] ${
                              lang == "ar" ? "font-cairo" : "font-raleway"
                            }  max-w-[650px] text-[#333333] font-[700] text-[16px] flex justify-between scroll-auto`}
                          >
                            {props.resources.GEO_LOCATION}
                          </div>
                        )}
                        <div dir={setRtl} className="mb-24">
                          {locationsWithDistance.map(({ location }, index) => (
                            <div
                              key={index}
                              className="max-w-[650px] mt-3 "
                              style={{
                                width:
                                  size.width < 650 ? size.width * 0.85 : 650,
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
                      </>
                    )}

                    {/* <div
                      className="max-w-[650px]  mt-2"
                      style={{
                        width: size.width < 650 ? size.width * 0.85 : 650,
                        height: size.width < 650 ? size.width * 0.85 : 650,
                      }}
                    >
                      <Map
                        position={{
                          // lat: product.latitude,
                          // lng: product.longitude,
                          lat: 21.4925,
                          lng: 39.17757,
                        }}
                        BranchAddress={"Branch A"}
                      />
                    </div> */}
                  </>
                  {/* )} */}
                </div>
              </div>

              {/*Footer*/}
              {product.inventories[0]?.quantity === 0 &&
              product.inventories[0]?.openQuantity === false ? (
                <>
                  <div className="w-[95%] items-center self-center flex justify-around  max-w-[650px] pb-3 pt-4 fixed bottom-0 bg-[#FCFCFF]">
                    <div className="w-[95%]  flex justify-around items-center">
                      <div
                        id="button"
                        style={{ borderRadius: "20px" }}
                        className={`items-center flex justify-center  w-[173px] lg:w-[300px] h-[61px] bg-[#98B7FF] shadow-md hover:bg-[#A2BEFF] hover:shadow-lg focus:bg-[#98B7FF] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#98B7FF] active:shadow-lg transition duration-150 ease-in-out`}
                      >
                        <p
                          className={` text-[${colorSchema.borderColor}] ${
                            lang == "ar" ? "font-cairo" : "font-raleway"
                          } font-[600] items-center text-center p-2  text-[18px]`}
                        >
                          {props.resources?.SOLD_OUT}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-[95%] items-center self-center flex justify-around  max-w-[650px] pb-3 pt-4 fixed bottom-0 bg-[#FCFCFF]">
                  <div className="w-[95%]  flex justify-around items-center">
                    <div
                      type="button"
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                      className="items-center bg-[#F2F2F2] rounded-[16.16px] w-[36.37px]  h-[38.57px] p-0.5 justify-center flex  shadow hover:bg-[#D9D9D9] hover:shadow focus:bg-[#F2F2F2] focus:shadow focus:outline-none focus:ring-0 active:bg-[#F2F2F2] active:shadow-lg transition duration-150 ease-in-out"
                      onClick={() => {
                        setNoOfItems((item) => (item === 1 ? 1 : item - 1));
                      }}
                    >
                      <div className="cursor-default items-center self-center font-raleway text-[33.06px] font-bold text-[#828282] ">
                        -
                      </div>
                    </div>
                    <p className="text-[#1B153D] w-[50px] text-center font-raleway text-[17.63px] font-[700]">
                      {noOfItems}
                    </p>
                    <div
                      type="button"
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                      className="items-center bg-[#E0E0E0] rounded-[16.16px] w-[36.37px]  h-[38.57px] p-0.5 justify-center flex shadow hover:bg-[#ededed] hover:shadow focus:bg-[#E0E0E0] focus:shadow focus:outline-none focus:ring-0 active:bg-[#E0E0E0] active:shadow-lg transition duration-150 ease-in-out"
                      onClick={() => {
                        setNoOfItems((item) => item + 1);
                      }}
                    >
                      <div
                        className={`cursor-default items-center self-center font-raleway text-[33.06px] font-bold text-[${colorSchema.borderColor}]`}
                      >
                        +
                      </div>
                    </div>
                    <div
                      id="button"
                      style={{ borderRadius: "20px" }}
                      className={`items-center flex justify-center  w-[173px] lg:w-[300px] h-[61px] bg-[#98B7FF] shadow-md hover:bg-[#A2BEFF] hover:shadow-lg focus:bg-[#98B7FF] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#98B7FF] active:shadow-lg transition duration-150 ease-in-out cursor-pointer`}
                      onClick={addToCart}
                    >
                      <p
                        className={` text-[${colorSchema.borderColor}] ${
                          lang == "ar" ? "font-cairo" : "font-raleway"
                        } font-[600] items-center text-center p-2  text-[18px]`}
                      >
                        {props.resources?.ADD_TO_CART ?? "Add to Cart"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-64 flex justify-center items-center">
              <p className="font-raleway  ">Something Went Wrong</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Product;

export const getServerSideProps = async (context) => {
  const storeId = context?.params?.id;
  const serviceId = context?.params.serviceid;
  const productId = context?.params.productId;
  let lang = getLangServerSide(context).locale;
  let setRtl = getLangServerSide(context).rtl;
  let product;
  let resources;

  try {
    resources = await axios.get(`${endpoints.GET_RESOURCES}/locale/${lang}`);

    resources = handleChangeResObj(resources.data);

    product = await axios.get(
      `${endpoints.GET_STORE_BY_ID}/${storeId}/services/${serviceId}/products/${productId}`,
      {
        headers: {
          locale: lang,
        },
      }
    );
    //console.log("THIS IS PRODUCT DATA====>", product.data.data);
    product = product.data.data;
  } catch (e) {
    // console.log("error :", e);
    product = false;
  }

  return {
    props: {
      storeId,
      serviceId,
      product,
      resources,
      isAPIFailed: !product,
      lang,
      setRtl,
    },
  };
};

// const productStructure = {
//   name: "Chicken Burger",
//   uuid: "030b7e38-5753-4f8e-813a-7d619b98b3de",
//   summary: "",
//   description:
//     "<p>In a medium bowl, add ground chicken, breadcrumbs, mayonnaise, onions, parsley, garlic, paprika, salt and pepper. Use your hands to combine all the ingredients together until blended, but don't over mix. Preheat grill to medium-high heat and oil the grates. Form the mixture into 4-6 equal patties.</p>",
//   showAsDetailPage: null,
//   latitude: 24.8607343,
//   longitude: 67.0011364,
//   id: 79,
//   localizations: [],
//   images: [
//     {
//       url: "https://s3.eu-west-1.amazonaws.com/wellmoe-product-dev.oyah.io/Crispy_Chicken_Burger_square_FS_4518_018cbe5ef7.jpg",
//       previewUrl:
//         "https://wellmoe-product-dev.oyah.io/Crispy_Chicken_Burger_square_FS_4518_018cbe5ef7.jpg",
//     },
//   ],
//   coverImage: null,
//   inventories: [
//     {
//       price: 5,
//       maxPrice: null,
//       currency: "USD",
//       quantity: 100,
//       unit: null,
//       id: 996,
//       option: {
//         id: 1,
//         title: "Small",
//         active: true,
//       },
//       option_group: {
//         id: 1,
//         title: "Size",
//         active: false,
//       },
//     },
//     {
//       price: 10,
//       maxPrice: null,
//       currency: "USD",
//       quantity: 97,
//       unit: "Piece",
//       id: 245,
//       option: null,
//       option_group: null,
//     },
//   ],
// };

// const locationStructure = [
//   {
//     name: { en: "karachi" },
//     address: { en: "THIS IS MY OLD HOUSE LOCATED IN KARACHI" },

//     latitude: 24.8878,
//     longitude: 67.188,
//   },
//   {
//     name: { en: "kashmir" },
//     address: { en: "THIS IS MY OLD HOUSE LOCATED IN kashmir" },

//     latitude: 31.341622,
//     longitude: 74.366078,
//   },

//   {
//     name: { en: "Hyd" },
//     address: { en: "THIS IS MY NEW HOUSE LOCATED IN hyd" },

//     latitude: 25.396,
//     longitude: 68.3578,
//   },
// ];
