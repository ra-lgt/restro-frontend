import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";

//local imports
import NavBar from "../../../../../../../components/NavBar";
import {
  CartContext,
  StoreContext,
} from "../../../../../../../context/appContext";
import { useRouter } from "next/router";

import { handleChangeResObj } from "../../../../../../../utils/utilFunctions";
import axios from "../../../../../../../utils/axios";
import endpoints from "../../../../../../../constant/endPoints";
import AlertModal from "../../../../../../../components/AlertModal";
import Loader from "../../../../../../../components/Loader";
import ContactModal from "../../../../../../../components/ContactModal";
import IconRadio from "../../../../../../../components/IconRadio";
import MessageModal from "../../../../../../../components/MessageModal";
//Language Imports
import getLang, {
  getLangServerSide,
  useLang,
} from "../../../../../../../utils/locale";
import RequestComponent from "../../../../../../../components/RequestComponent";

const AddonPage = ({ request = resquestStructure, ...props }) => {
  const [colorSchema, setColorSchema] = useState();
  const [colorLoaded, setColorLoaded] = useState(false);
  const [store, updateStore] = useContext(StoreContext);
  const [cartCont, updateCartCont] = useContext(CartContext);

  const [isRoomNumber, setRoomNumber] = useState();
  const [hideRoom, setHideRoom] = useState();
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [productIndex, setProductIndex] = useState(0);
  const [load, setLoad] = useState(false);

  const [message, setMessage] = useState({ showModal: false });
  const [detail, setDetail] = useState("");
  const [errors, setErrors] = useState({});
  const [messageModal, setMessageModal] = useState({
    isOpen: false,
    headingTxt: "",
    alertMessage: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const router = useRouter();
  // const lang = useLang();
  const lang = props.lang;
  const setRtl = props.setRtl;
  //console.log(router.query);

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

  //GET LOCATION FUNCTION
  const getLocation = (callBack) => {
    navigator.geolocation.getCurrentPosition(
      (res) => {
        //console.log(res.coords.latitude);
        // console.log(res.coords.longitude);
        callBack({
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
        });
      },
      (er) => {
        setLoad(false);
        setShowPopupModal(false);
        setMessage({
          headingTxt: props?.resources?.location_denied,
          alertMessage: props?.resources?.location_denied_detail,
          showModal: true,
          handleUserChoice: () => {
            setMessage({ showModal: false });
          },
        });
      }
    );
  };
  //handle change function
  const handleChange = (e) => {
    // console.log(e.target.value);
    setDetail(e.target.value);
  };
  //Creating Request History
  const requestPlaced = (res) => {
    const product = request.categories?.[0]?.products?.[productIndex];

    let requestHistory = localStorage.getItem("RequestHistoryByStore");

    if (requestHistory) {
      requestHistory = JSON.parse(requestHistory);
    }

    const dbPayload = {
      requestNumber: res.data.data.orderNumber,

      orderDate: formatDate(new Date()),

      orderTime: new Date().toLocaleTimeString(),
      requestNotes: detail,

      currency: product.inventories[0].currency,
      productName: product?.name,
      ProductImage: product.images != null ? product.images[0].previewUrl : "",
    };

    if (requestHistory?.[props.storeIdParam]) {
      requestHistory[props.storeIdParam].push(dbPayload);
    } else {
      requestHistory = {
        [props.storeIdParam]: [dbPayload],
      };
    }

    localStorage.setItem(
      "RequestHistoryByStore",
      JSON.stringify(requestHistory)
    );
  };

  //PAGE API CALL
  const handleSubmit = () => {
    if (!localStorage.getItem("contactDetail")) {
      setShowPopupModal(true);
    } else {
      setButtonDisabled(true);

      // alert("detail submit");
      let contactDetailString = localStorage.getItem("contactDetail");
      var localContactDetail = JSON.parse(contactDetailString);
      setLoad(true);
      getLocation((userLocation) => {
        let payload = getPayload(
          localContactDetail.clientEmail,
          localContactDetail.cellNumber,
          localContactDetail.countryCode,
          userLocation
        );
        // console.log("page api payload", payload);

        axios
          .post(`${endpoints.ORDER}`, payload)
          .then((res) => {
            // console.log("RESPONCE DATA====>", res.data);

            if (res?.data?.errors?.length > 0) {
              setMessage({
                headingTxt: "Order Not Placed",
                alertMessage: res.data.errors[0].errorMessage,
                showModal: true,
                handleUserChoice: () => {
                  setMessage({ showModal: false });
                },
              });

              setLoad(false);
              setShowPopupModal(false);
            } else {
              requestPlaced(res);

              router.push({
                pathname: `/${lang}/store/${props.storeIdParam}/confirm-order`,
                query: {
                  orderNo: res.data.data.orderNumber,
                  request: request.name,
                },
              });
            }
          })
          .catch((err) => {
            // console.log("ERROR ========>", err);
          })
          .finally(() => {
            setLoad(false);
            setShowPopupModal(false);
            setButtonDisabled(false);
          });
      });
    }
  };

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart"));
    updateCartCont(cartData);
  }, []);

  // ADD TO CART API CALL
  const addToCart = () => {
    const product = request.categories?.[0]?.products?.[productIndex];
    const payload = {
      imageUrl: product.images != null ? product.images[0].previewUrl : "",
      //  SKU: product.SKU,
      id: product.id,
      uuid: product.uuid,
      name: product.name,
      total: 1,
      inventories: [
        {
          price: product.inventories[0].price,
          currency: product.inventories[0].currency,
          inventoryID: product.inventories[0].id,
          title: product.inventories[0]?.option?.title,
          inCart: 1,
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
    }
    // if cart is not empty
    else {
      const productIndexInCart = cartData.products.findIndex(
        (item) => item.id === product.id
      );
      // if product is already in cart
      if (productIndexInCart !== -1) {
        cartData.products[productIndexInCart] = payload;
      }
      // if product is not in cart
      else {
        cartData.products.push(payload);
      }

      updateCartCont(cartData);
      localStorage.setItem("cart", JSON.stringify(cartData));
    }
  };

  const getPayload = (email, number, code, userLocation) => ({
    data: {
      email: email,
      phone: number ? code + number : null,
      totalAmount: 0,
      currency: "USD",
      notes: detail,
      storeId: props.storeIdParam,
      serviceId: props.serviceId,
      paymentMethod: null,
      inventories: [
        {
          id: request?.categories[0]?.products?.[productIndex]?.inventories?.[0]
            ?.id,
          quantity: 1,
        },
      ],
      additionalData: {
        roomNo: Number(isRoomNumber),
        referenceCode: Number(isRoomNumber),
        geoLatitude: userLocation.latitude,
        geoLongitude: userLocation.longitude,
        mode: "request",
      },
    },
  });

  // POPUP API CALL
  const handleConfirm = (email, number, code, codeName) => {
    setLoad(true);
    setButtonDisabled(true);
    handleContactDetail(email, number, code, codeName);
    getLocation((userLocation) => {
      let payload = getPayload(email, number, code, userLocation);
      //  console.log("THis is  popUP payload", payload);

      axios
        .post(`${endpoints.ORDER}`, payload)
        .then((res) => {
          // console.log("RESPONCE DATA====>", res.data);

          if (res?.data?.errors?.length > 0) {
            setMessage({
              headingTxt: "Order Not Placed",
              alertMessage: res.data.errors[0].errorMessage,
              showModal: true,
              handleUserChoice: () => {
                setMessage({ showModal: false });
              },
            });

            setLoad(false);
            setShowPopupModal(false);
          } else {
            requestPlaced(res);
            setLoad(false);
            setShowPopupModal(false);

            router.push({
              pathname: `/${lang}/store/${props.storeIdParam}/confirm-order`,
              query: {
                orderNo: res.data.data.orderNumber,
                request: request.name,
              },
            });
          }
        })
        .catch((err) => {
          //console.log("ERROR ========>", err);
          setShowPopupModal(false);
          setButtonDisabled(false);
        });
    });
  };

  const handleContactDetail = (email, number, code, codeName) => {
    let contactDetail = {
      countryCode: code,
      cellNumber: number,
      clientEmail: email,
      countryName: codeName,
    };
    const contactDetailString = JSON.stringify(contactDetail);
    localStorage.setItem("contactDetail", contactDetailString);
  };

  //DISPLAY DATE
  const formatDate = (date) => {
    const d = new Date(date);
    return `${getMonth(d.getMonth())} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const getMonth = (i) => {
    switch (i) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
    }
  };

  // console.log("this is request ", request);
  return (
    <>
      <Head>
        <title>{store?.name}</title>

        <meta
          property="og:image"
          content={store?.logo != null ? store?.logo?.previewUrl : ""}
        />
        <meta name="description" content={"Request Page"} />
        <meta property="og:title" content={store?.name} />
      </Head>
      {colorLoaded && (
        <>
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
          {load == true ? <Loader loader={true} /> : null}
          <div
            style={{ backgroundColor: colorSchema.backgroundColor }}
            className="flex flex-1 flex-col h-screen w-screen max-w-[650] items-center scrollbar-hide"
          >
            <AlertModal
              resource={props.resources}
              {...message}
              lang={lang}
              setRtl={setRtl}
            />

            <NavBar
              lang={lang}
              setRtl={setRtl}
              leftIconVissible={true}
              leftIcon="back"
              hotelLogo={store?.logo !== null ? store?.logo?.previewUrl : ""}
              // itemInCart={cartCont?.products?.length}
              rightIcon="cart"
              itemInCart={cartCont?.products?.length}
              roomNo={isRoomNumber}
              handleCartClick={() =>
                router.replace({
                  pathname: `/${lang}/store/${props.storeIdParam}/service/${props.serviceId}/cart`,
                  query: {
                    roomNo: router.query.roomNo,
                    request: props.requestId,
                  },
                })
              }
              handleBackBtn={() => {
                const query = {
                  roomNo: router.query.roomNo,
                };
                if (hideRoom) {
                  query.hideRefCodeFromUser = false;
                }
                router.push({
                  pathname: `/${lang}/store/detail/${props.storeIdParam}`,
                  query: query,
                });
              }}
            />

            <div
              dir={setRtl}
              className={`flex  text-[16px] flex-wrap  max-w-[650px] w-[80%] mt-24 ${
                lang == "ar" ? "font-cairo" : "font-raleway"
              }`}
            >
              <p>{props.resources?.YOU_HAVE_REQ} </p>
              <p className="mx-1 font-[600]">
                {
                  (request.name =
                    lang === "ar" && request.nameLocale
                      ? request.nameLocale
                      : request.nameLocale
                      ? request.nameLocale
                      : request.name)
                }
              </p>
              <p>{props.resources?.SERVICE}</p>
            </div>
            {/* <div className=" max-w-[650px]  w-[80%] mt-2">
              <IconRadio IconRadio="/back.png" />
            </div> */}
            {/*Inventory*/}

            {request?.categories?.[0]?.products && (
              <div
                dir={setRtl}
                className="flex flex-wrap w-full justify-between items-center mb-2 px-6 mt-4 max-w-[700px] scrollbar-hide"
              >
                {request?.categories?.[0]?.products.map((val, ind) => {
                  return (
                    <>
                      <RequestComponent
                        lang={lang}
                        setRtl={setRtl}
                        key={ind}
                        item={val}
                        inventory={val?.inventories?.[0]}
                        className="w-[49%] mt-2 "
                        selected={productIndex === ind}
                        onChange={(userChoice) => {
                          if (userChoice) {
                            setProductIndex(ind);
                          }
                        }}
                      />
                    </>
                  );
                })}

                {/* {request?.categories?.[0]?.products?.map((item, index) => (
                  <IconRadio
                    lang={lang}
                    setRtl={setRtl}
                    key={index}
                    product={item}
                    inventory={item?.inventories?.[0]}
                    radioText={
                      (item.name =
                        lang === "ar" && item.nameLocale
                          ? item.nameLocale
                          : item.nameLocale
                          ? item.nameLocale
                          : item.name)
                    }
                    radioIcon={
                      item?.images != null ? item?.images[0]?.previewUrl : ""
                    }
                    selected={productIndex === index}
                    onChange={(userChoice) => {
                      if (userChoice) {
                        setProductIndex(index);
                      }
                    }}
                  />
                ))} */}
              </div>
            )}

            <div
              dir={setRtl}
              className={`flex  text-[16px]  font-[600]   flex-col max-w-[650px] mt-5 w-[80%] ${
                lang == "ar" ? "font-cairo mr-2" : "font-raleway ml-2 "
              }`}
            >
              {props.resources?.ADD_DETAIL}
            </div>
            <div
              dir={setRtl}
              className="max-w-[650px] mt-2 w-[85%] bg-[#FFFFFF] rounded-[12.59px] flex shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)]"
            >
              <textarea
                id="detail"
                style={{ color: colorSchema.borderColor }}
                className={`bg-[#FFFFFF] text-[17.63px] font-[500] mt-3  w-[85%] ${
                  lang === "ar" ? "font-cairo mr-4" : "font-raleway"
                } ml-4 items-center outline-none w-full leading-[20.7px] resize-none py-2 scrollbar-hide`}
                rows={12}
                value={detail}
                placeholder={props.resources?.ENTER_DETAIL_HERE}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div
              dir={setRtl}
              className="flex  max-w-[650px]  justify-start mt-1 w-[80%]"
            >
              {detail == "" ? (
                <p className="text-red-500  ">{errors.detail}</p>
              ) : (
                <></>
              )}
            </div>
            {/* BUTTON */}
            <div className="w-screen flex flex-col justify-center items-center mt-10">
              <button
                disabled={buttonDisabled}
                id="continue-shopping-button"
                onClick={() => {
                  if (!detail) {
                    setErrors((prev) => ({
                      ...prev,
                      detail: props.resources?.PLEASE_ENTER_DETAIL,
                    }));
                  } else {
                    if (
                      request.categories?.[0]?.products?.[productIndex]
                        ?.inventories?.[0]?.disableCheckout
                    ) {
                      handleSubmit();
                    } else {
                      addToCart();
                    }
                  }
                }}
                className="mb-10 cursor-pointer w-[256px] h-[59px] rounded-[20px] bg-[#98B7FF]  flex justify-center items-center shadow-[0_20px_36px_0px_rgba(23,20,57,0.06)]  "
              >
                <div
                  style={{ color: colorSchema.borderColor }}
                  className={`${
                    lang == "ar" ? " font-cairo" : " font-raleway"
                  } font-[600] text-[${
                    colorSchema.borderColor
                  }] text-[16px] font-bold`}
                >
                  {request.categories?.[0]?.products?.[productIndex]
                    ?.inventories?.[0]?.disableCheckout
                    ? props.resources?.SUBMIT
                    : props?.resources?.ADD_TO_CART}
                </div>
              </button>
            </div>
          </div>
          {showPopupModal && (
            <ContactModal
              lang={lang}
              setRtl={setRtl}
              handleCross={() => setShowPopupModal(false)}
              resources={props.resources}
              onsubmit={handleConfirm}
            />
          )}
        </>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  let lang = getLangServerSide(context).locale;
  let setRtl = getLangServerSide(context).rtl;
  let storeIdParam = context.params?.id;
  let serviceId = context?.params?.serviceid;
  let requestId = context?.params?.request;
  //console.log("THiS IS storeIdParam ===============>", context);
  let getResourceAPI = {};
  let isAPIFiled = false;
  let request;
  try {
    let resourceAPI = await axios.get(
      `${endpoints.GET_RESOURCES}/locale/${lang}`
    );

    if (resourceAPI.status == 200) {
      getResourceAPI = handleChangeResObj(resourceAPI.data);
    }

    request = await axios.get(
      `${endpoints.GET_STORE_BY_ID}/${storeIdParam}/services/${serviceId}/categories`,
      {
        headers: {
          locale: lang,
        },
      }
    );
    // console.log("THIS IS PRODUCT DATA====>", request.data.data);
    request = request.data.data;

    // console.log(
    //   "Resources of addons page ============== ====>",
    //   getResourceAPI
    // );
  } catch (err) {
    isAPIFiled = true;
  }

  return {
    props: {
      storeIdParam: storeIdParam,
      serviceId: serviceId,
      resources: getResourceAPI,
      isAPIFiled: isAPIFiled,
      requestId: requestId,
      request,
      lang,
      setRtl,
    },
  };
}

export default AddonPage;

const resquestStructure = {
  name: "House Keeping",
  uuid: "8568de11-2f6e-489f-8a38-49c6d5b602b3",
  key: "house-keeping",
  serviceType: "Request",
  id: 83,
  categories: [
    {
      name: "House Keeping",
      id: 114,
      localizations: [],
      products: [
        {
          name: "Clean my room",
          uuid: "a4de2823-b3e1-4c2b-b414-2506bfce88e9",
          description: "",
          summary: "",
          showAsDetailPage: false,
          id: 326,
          localizations: [],
          images: [
            {
              url: "https://s3.eu-west-1.amazonaws.com/wellmoe-product-dev.oyah.io/b06eee73_dc1f_4a5e_bb56_22f244964608_a72cdc6eec.jpeg",
              previewUrl:
                "https://wellmoe-product-dev.oyah.io/b06eee73_dc1f_4a5e_bb56_22f244964608_a72cdc6eec.jpeg",
            },
          ],
          coverImage: null,
          categories: [
            {
              id: 114,
            },
          ],
          inventories: [
            {
              price: 0,
              maxPrice: null,
              currency: "USD",
              quantity: 0,
              openQuantity: true,
              disableCheckout: true,
              unit: null,
              id: 1025,
              option: null,
              option_group: null,
            },
          ],
        },
        {
          name: "Mineral Water",
          uuid: "974c89af-3d0f-4e2b-a715-d67db8bda145",
          description: "",
          summary: "",
          showAsDetailPage: false,
          id: 325,
          localizations: [],
          images: [
            {
              url: "https://s3.eu-west-1.amazonaws.com/wellmoe-product-dev.oyah.io/90769560_fecd_4965_a8bf_cb1c33bb5ecb_1481820dc3.webp",
              previewUrl:
                "https://wellmoe-product-dev.oyah.io/90769560_fecd_4965_a8bf_cb1c33bb5ecb_1481820dc3.webp",
            },
          ],
          coverImage: null,
          categories: [
            {
              id: 114,
            },
          ],
          inventories: [
            {
              price: 0,
              maxPrice: null,
              currency: "USD",
              quantity: 0,
              openQuantity: true,
              disableCheckout: true,
              unit: null,
              id: 1024,
              option: null,
              option_group: null,
            },
          ],
        },
      ],
    },
  ],
};
