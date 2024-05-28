import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
// next js
import { useRouter } from "next/router";

// context
import {
  ResourcesContext,
  StoreContext,
  CartContext,
} from "../../../../../../context/appContext";

// local
import NavBar from "../../../../../../components/NavBar";
import CategoryHeader from "../../../../../../components/CategoryHeader";
import axios from "../../../../../../utils/axios";
import endpoints from "../../../../../../constant/endPoints";
import AlertModal from "../../../../../../components/AlertModal";
import validation from "../../../../../../utils/validation";
import { handleChangeResObj } from "../../../../../../utils/utilFunctions";
import CartItem from "../../../../../../components/CartItem";
import { maxWidth } from "../../../../../../hooks/useWindowSize";
import Loader from "../../../../../../components/Loader";
import CountryModal from "../../../../../../components/CountryModal";
import { countryCode } from "../../../../../../constant/countryCode";
import Environment from "../../../../../../constant/endPoints";
import getLang, {
  getLangServerSide,
  useLang,
} from "../../../../../../utils/locale";

let timer;
// cart screen

const Index = ({
  paymentMethods,
  isAPIFiled,
  resources,
  ip,
  routeStoreID,
  ...props
}) => {
  // var
  const [colorSchema, setColorSchema] = useState();
  const [colorLoaded, setColorLoaded] = useState(false);
  const router = useRouter();
  const [load, setLoad] = useState(false);
  const [message, setMessage] = useState({ showModal: false });
  const [store, updateStore] = useContext(StoreContext);
  const [cartCont, updateCartCont] = useContext(CartContext);
  const [location, setlocation] = useState({});
  const [isRoomNumber, setRoomNumber] = useState();
  const [countryModal, setCountryModal] = useState(false);
  const [countryobj, setcountryobj] = useState({
    dial_code: "+966",
    code: "SA",
  });
  const [countryCodeArr, setcountryCodeArr] = useState(countryCode);
  const [countryCodeSearch, setcountryCodeSearch] = useState("");
  // state
  // const [number, setNumber] = useState("");
  // const [email, setEmail] = useState("");
  const [state, setState] = useState({ email: "", number: "" });
  const [selectPay, setSelectPay] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(20);

  //LANGUAGE
  // const lang = useLang();
  const lang = props.lang;
  const setRtl = props.setRtl;

  // console.log(
  //   "THIS IS CART SCREEN CARTCOUNT",
  //   cartCont?.products[0]?.serviceFee
  // );

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

  // total function
  const total = () => {
    let total = 0;

    cartCont?.products?.forEach((productObj) => {
      productObj?.inventories.forEach((invetoryObj) => {
        total += invetoryObj.inCart * invetoryObj.price;
      });
    });
    // Add the service fee amount to the total
    const serviceFee = cartCont?.products[0]?.serviceFee || 0;
    total += serviceFee;
    return total;
  };

  //getting userAgent to send in payload
  function userAgent() {
    return window.navigator.userAgent;
  }

  //VALIDATION FUNCTION
  const [errors, setErrors] = useState({
    email: "",
    number: "",
  });

  // validate
  const validate = () => {
    const errorsChecked = {
      email: validation(state.email, { type: "email", required: true }),
      // number: validation(state.number, {
      //   type: "phone",
      //   required: false,
      // }),
    };
    setErrors(errorsChecked);
    let foundErrors =
      Object.values(errorsChecked)?.filter((item) => item !== "")?.length > 0
        ? true
        : false;
    // will return true if no errors
    return !foundErrors;
  };
  // getting RoomNumber from local storage
  useEffect(() => {
    const roomNumber = localStorage.getItem("RoomNumber");
    if (roomNumber) {
      setRoomNumber(roomNumber);
    }
    // console.log("paymentMethods ===>", paymentMethods);
    if (paymentMethods.data) {
      let activePaymentCount = 0;
      let lastPaymenetID = 0;

      for (let tempPayMethod of paymentMethods?.data) {
        if (tempPayMethod?.attributes?.active) {
          activePaymentCount++;
          lastPaymenetID = tempPayMethod?.id;
        }
      }

      // now checking
      if (activePaymentCount == 1) {
        setSelectPay(lastPaymenetID);
      }
    }
  }, []);

  //handle change function
  const handleChange = (
    propertyName,
    change,
    validate = {
      type: "",
      payload: "",
      required: false,
    }
  ) => {
    if (validate?.type?.length > 0) {
      setErrors({
        ...errors,
        [propertyName]: validation(change.target.value, validate),
      });
    }
    // TODO: we will use this type property later for validating if the input is correct
    setState({ ...state, [propertyName]: change.target.value });
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

  const confirmOrderPlaced = () => {
    setLoad(true);
    if (cartCont.products.length == 0 && selectPay == 0) {
      setLoad(false);
      setMessage({
        headingTxt: resources?.add_items,
        alertMessage: resources?.add_item_continue,
        showModal: true,
        handleUserChoice: () => {
          setMessage({ showModal: false });
        },
      });
    } else if (cartCont.products.length == 0) {
      setLoad(false);
      setMessage({
        headingTxt: resources?.add_items,
        alertMessage: resources?.add_item_continue,
        showModal: true,
        handleUserChoice: () => {
          setMessage({ showModal: false });
        },
      });
    } else if (selectPay == 0) {
      setLoad(false);
      setMessage({
        headingTxt: resources?.SELECT_PAY_METHOD,
        alertMessage: resources?.select_payment_to_continue,
        showModal: true,
        handleUserChoice: () => {
          setMessage({ showModal: false });
        },
      });
    } else {
      getLocation((userLocation) => {
        let params = {
          data: {
            email: state.email,
            phone: (() => {
              if (state.number == "") {
                return null;
              } else {
                return countryobj.dial_code + state.number;
              }
            })(),
            totalAmount: total(),
            currency: cartCont.products[0].inventories[0].currency,
            notes: `roomNo:${isRoomNumber}`,
            storeId: store.uuid,
            serviceId: cartCont.serviceId,
            paymentMethod: selectPay,
            inventories: (() => {
              let inventory = [];
              cartCont?.products?.forEach((product) => {
                product.inventories.forEach((variant) => {
                  inventory.push({
                    id: variant.inventoryID,
                    quantity: variant.inCart,
                  });
                });
              });
              return inventory;
            })(),
            additionalData: {
              roomNo: Number(isRoomNumber),
              geoLatitute: userLocation.latitude,
              geoLongitude: userLocation.longitude,
              userAgent: userAgent(),
              ipAddress: ip,
            },
          },
        };
        // console.log("params", params);

        axios
          .post(`${endpoints.ORDER}`, params)
          .then((res) => {
            // console.log("RESPONCE DATA====>", res.data);

            if (res?.data?.errors?.length > 0) {
              const apiError = res?.data?.errors[0]?.errorCode;
              setMessage({
                headingTxt: resources?.ORDER_NOT_PLACED,
                // alertMessage: res.data.errors[0].errorMessage,
                alertMessage:
                  resources[
                    `API_ERROR_${apiError?.toUpperCase()?.replace(" ", "_")}`
                  ],
                showModal: true,
                handleUserChoice: () => {
                  setMessage({ showModal: false });
                },
              });

              setLoad(false);
            } else {
              setLoad(false);
              orderPlaced(res);
            }
          })
          .catch((err) => {
            //console.log("ERROR ========>", err);
          })
          .finally(() => {
            setLoad(false);
          });
      });
    }
  };

  //Payment method
  const _getPaymentMethodName = () => {
    for (let i = 0; i <= paymentMethods?.data?.length; i++) {
      if (paymentMethods?.data[i]?.id == selectPay) {
        let result = paymentMethods?.data[i]?.attributes?.name;
        return result;
      }
    }
  };

  //date
  const todayDate = () => {
    let now = new Date().toLocaleString().split(",")[0];

    return now;
  };
  const orderPlaced = (res) => {
    const orderHistort = localStorage.getItem("OrderHistoryByStore");
    let tempOrderHistory = {
      orderNumber: res.data.data.orderNumber,
      paymentMethod: _getPaymentMethodName(),
      orderDate: formatDate(new Date()),
      orderSatus: "Pending",
      orderTime: new Date().toLocaleTimeString(),
      totalItems: cartCont.products.length,
      grandTotal: total(),
      currency: cartCont.products[0].inventories[0].currency,
      products: cartCont.products,
      serviceCharge: cartCont?.products[0]?.serviceFee || 0,
    };
    if (orderHistort != null) {
      let serializedOrderHisObj = JSON.parse(orderHistort);

      // updating
      if (serializedOrderHisObj?.[store.uuid]) {
        serializedOrderHisObj[store.uuid].push(tempOrderHistory);
      } else {
        serializedOrderHisObj[store.uuid] = [tempOrderHistory];
      }
      // saving into local storage
      localStorage.setItem(
        "OrderHistoryByStore",
        JSON.stringify(serializedOrderHisObj)
      );
    } else {
      localStorage.setItem(
        "OrderHistoryByStore",
        JSON.stringify({
          [store.uuid]: [tempOrderHistory],
        })
      );
    }

    // updateCartCont({ serviceID: "", products: [] });
    router.push({
      pathname: `/${lang}/store/${props.storeIdParam}/confirm-order`,
      query: {
        orderNo: res.data.data.orderNumber,
      },
    });
  };

  useEffect(() => {
    let cartLocalStr = localStorage.getItem("cart");
    if (cartLocalStr) {
      let serializedCartObj = JSON.parse(cartLocalStr);
      updateCartCont(serializedCartObj);
    }

    //Incognito work
    let roomNumber = localStorage.getItem("RoomNumber");

    if (!roomNumber) {
      localStorage.setItem("RoomNumber", router.query.roomNo);
      // console.log("this is orderhistory roomNo", router.query.roomNo);
    }
    setRoomNumber(router.query.roomNo);

    //Incognito Store setting in local storage
    let getLocalStore = localStorage.getItem("store");

    if (!getLocalStore) {
      axios
        .get(`${endpoints.GET_STORE_BY_ID}/${routeStoreID}`)
        .then((res) => {
          updateStore(res.data.data);
        })
        .catch((er) => {
          // console.log(er);
        });
    }

    //Setting Number and email if exist in localStorage
    const contactDetailString = localStorage.getItem("contactDetail");
    if (contactDetailString) {
      const contactDetail = JSON.parse(contactDetailString);
      setState({
        email: contactDetail?.clientEmail || "",
        number: contactDetail?.cellNumber || "",
      });
      setcountryobj({
        dial_code: contactDetail?.countryCode || "+966",
        code: contactDetail?.countryName || "SA",
      });
    }
  }, []);

  //CROSS FUNCTIONALITY ADDED
  const handleRemoveProd = (itemUUID) => {
    let tempCartCont = { ...cartCont };

    let itemIndex = tempCartCont.products.findIndex((i) => i.uuid == itemUUID);
    tempCartCont.products.splice(itemIndex, 1);

    // now checking if the carts products are empty remove new object
    if (tempCartCont.products.length == 0) {
      updateCartCont({ serviceID: "", products: [] });
      localStorage.removeItem("cart");
    } else {
      // update both cart and local storage
      updateCartCont(tempCartCont);
      localStorage.setItem("cart", JSON.stringify(tempCartCont));
    }
  };

  //remove single product from cart
  const handleRemoveProduct = (productInd, InventoryInd) => {
    let tempCartContObj = { ...cartCont };
    let tempProductArr = [...tempCartContObj.products];
    let tempInentoryObj = tempProductArr[productInd].inventories[InventoryInd];
    tempInentoryObj.inCart -= 1;
    tempProductArr[productInd].total -= 1;

    // if inCart == 0 then remove the invetory
    if (tempInentoryObj.inCart <= 0) {
      tempProductArr[productInd].inventories.splice(InventoryInd, 1);
    }

    // if the inventories array is empty remove the product
    if (tempProductArr[productInd].inventories.length == 0) {
      tempProductArr.splice(productInd, 1);
    }

    // roll back
    tempCartContObj.products = tempProductArr;

    // update both cart and local storage
    updateCartCont(tempCartContObj);
    localStorage.setItem("cart", JSON.stringify(tempCartContObj));
  };
  //add single product from cart
  const handleAddProduct = (productInd, InventoryInd) => {
    let tempCartContObj = { ...cartCont };
    let tempProductArr = [...tempCartContObj.products];
    let tempInentoryObj = tempProductArr[productInd].inventories[InventoryInd];
    tempInentoryObj.inCart += 1;
    tempProductArr[productInd].total += 1;

    // roll back
    tempCartContObj.products = tempProductArr;

    // update both cart and local storage
    updateCartCont(tempCartContObj);
    localStorage.setItem("cart", JSON.stringify(tempCartContObj));
  };

  //GET LOCATION FUNCTION
  const getLocation = (callBack) => {
    navigator.geolocation.getCurrentPosition(
      (res) => {
        setlocation({
          lat: res.coords.latitude,
          long: res.coords.longitude,
        });
        //console.log(res.coords.latitude);
        // console.log(res.coords.longitude);
        callBack({
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
        });
      },
      (er) => {
        setLoad(false);
        setMessage({
          headingTxt: resources?.location_denied,
          alertMessage: resources?.location_denied_detail,
          showModal: true,
          handleUserChoice: () => {
            setMessage({ showModal: false });
          },
        });
      }
    );
  };

  const handleCountryCodeChange = (e) => {
    e.preventDefault();
    // console.log("input text ==>", e.target.value);
    setcountryCodeSearch(e.target.value);
    //clear time out if the user start typing befoe 1000
    clearTimeout(timer);
    timer = setTimeout(() => {
      const tempAr = [...countryCode];
      const filterArr = [];
      tempAr.forEach((item) => {
        //  console.log("forEach item===>", item.attributes);
        let tempName = item.name.toLowerCase();
        let tempCode = item.dial_code;
        if (
          String(item.name).includes(e.target.value) ||
          tempName.includes(e.target.value.toLowerCase()) ||
          tempCode.includes(e.target.value)
        ) {
          filterArr.push(item);
        }
      });
      // console.log("filter array ==>", filterArr);
      setcountryCodeArr(filterArr);
    }, 800);
  };

  //SAVING PHONE NUMBER AND EMAIL IN LOCAL STORAGE
  const handleContactDetail = () => {
    let contactDetail = {
      countryCode: countryobj.dial_code,
      cellNumber: state.number,
      clientEmail: state.email,
      countryName: countryobj.code,
    };
    const contactDetailString = JSON.stringify(contactDetail);
    localStorage.setItem("contactDetail", contactDetailString);
  };

  return (
    <>
      <Head>
        <title>{store?.name}</title>
        <meta
          property="og:image"
          content={store?.logo != null ? store?.logo?.previewUrl : ""}
        />
        <meta name="description" content={"Cart Page"} />
        <meta property="og:title" content={store?.name} />
      </Head>
      {load == true ? <Loader loader={true} /> : null}

      {colorLoaded && (
        <div
          style={{ backgroundColor: colorSchema.backgroundColor }}
          className={`flex flex-col items-center w-screen `}
        >
          <AlertModal
            resource={resources}
            {...message}
            lang={lang}
            setRtl={setRtl}
          />
          <NavBar
            lang={lang}
            setRtl={setRtl}
            leftIconVissible={true}
            leftIcon={"back"}
            rightIcon="roomNo"
            roomNo={isRoomNumber}
            handleBackBtn={() => {
              if (router.query?.request) {
                router.push({
                  pathname: `/${lang}/store/${props.storeIdParam}/service/${props.serviceIdParam}/request/${router.query?.request}`,
                  query: {
                    roomNo: router.query.roomNo,
                  },
                });
              } else {
                router.push({
                  pathname: `/${lang}/store/${props.storeIdParam}/service/${props.serviceIdParam}`,
                  query: {
                    roomNo: router.query.roomNo,
                  },
                });
              }
            }}
            hotelLogo={store?.logo !== null ? store?.logo?.previewUrl : ""}
          />
          <div
            style={{
              backgroundColor: colorSchema.backgroundColor,
              maxWidth: maxWidth,
            }}
            className={` h-fit min-h-screen w-full `}
          >
            <div
              style={{ backgroundColor: colorSchema.backgroundColor }}
              className={`w-full flex-1 px-[5%] flex flex-col mt-5 `}
            >
              <div className="h-16"></div>
              <CategoryHeader
                title={resources?.REVIEW_YOUR_ORDER}
                lang={lang}
                setRtl={setRtl}
              />
            </div>

            {/* ITEM DETAILS START HERE */}
            {cartCont.products.length > 0 ? (
              <div dir={setRtl} className="mt-2">
                {/*Displaying cart items*/}

                {cartCont?.products?.map((val, index) => (
                  <CartItem
                    lang={lang}
                    setRtl={setRtl}
                    val={val}
                    index={index}
                    key={index}
                    handleAddProduct={handleAddProduct}
                    handleRemoveProd={handleRemoveProd}
                    handleRemoveProduct={handleRemoveProduct}
                    resources={resources}
                  />
                ))}
              </div>
            ) : (
              <div
                dir={setRtl}
                className="flex w-full items-center justify-center "
              >
                <p
                  className={`${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } font-[500] text-red-500`}
                >
                  <b>{resources?.NO_ITEM_HAS_BEEN}</b>
                </p>
              </div>
            )}

            {/* ITEM DETAILS ENDS HERE */}

            {/* DIVIDER LINE START HERE */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-[75%] border-b-2 border-[#9095A6] flex items-center justify-center opacity-[0.65] mt-3 " />
            </div>
            {/* DIVIDER LINE END HERE */}

            <div
              dir={setRtl}
              className="flex items-center justify-center  w-full mt-4  "
            >
              <div className="flex w-[75%] lg:w-[85%]  justify-between leading-[20.44px]">
                <div className="flex-col">
                  {cartCont?.products[0]?.serviceFee && (
                    <p
                      className={`text-[16px] ${
                        lang == "ar" ? "font-cairo" : "font-raleway"
                      } text-[#333333] font-[500]`}
                    >
                      {resources?.SERVICE_FEE}
                    </p>
                  )}
                  <p
                    className={`text-[16px] ${
                      lang == "ar" ? "font-cairo" : "font-raleway"
                    } text-[#333333] font-[600]`}
                  >
                    {resources?.TOTAL_AMOUNT}
                  </p>
                </div>

                <div className="flex-col">
                  {cartCont?.products[0]?.serviceFee && (
                    <p
                      className={`${
                        lang == "ar" ? "font-cairo" : "font-raleway"
                      } text-[#333333] font-[500] `}
                    >
                      {cartCont?.products[0]?.inventories[0]?.currency}{" "}
                      {cartCont?.products[0]?.serviceFee}
                    </p>
                  )}
                  <p
                    className={`${
                      lang == "ar" ? "font-cairo" : "font-raleway"
                    } text-[#27AE60] font-[600] `}
                  >
                    {cartCont?.products[0]?.inventories[0]?.currency} {total()}
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{ backgroundColor: colorSchema.backgroundColor }}
              className={`w-full flex-1 px-[5%] flex flex-col mt-10`}
            >
              <CategoryHeader
                title={resources?.SELECT_PAY_METHOD}
                lang={lang}
                setRtl={setRtl}
              />
            </div>

            {/* PAYMENT METHOD SECTION START FROM HERE */}
            {paymentMethods?.data?.length > 0 ? (
              <div
                dir={setRtl}
                id="payment-method-selection"
                className="flex flex-col w-full items-center space-y-2 mt-8 mb-5"
              >
                {paymentMethods.data.map((item) =>
                  item?.attributes?.active ? (
                    <div
                      key={item.id}
                      className="h-[90px] w-[85%] rounded-[20.46px] items-center flex justify-center p-[2px] shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)] "
                      style={{
                        backgroundColor:
                          selectPay === item.id
                            ? colorSchema.borderColor
                            : null,
                      }}
                      onClick={() => {
                        setSelectPay(item.id);
                      }}
                    >
                      <div className="w-full h-full bg-white rounded-[18.46px] flex p-2 px-4 items-center ">
                        <img
                          src={
                            item?.attributes?.icon?.data?.attributes?.previewUrl
                          }
                          className="w-[37.78px] h-[37.78px] mr-4"
                        />

                        <div className="w-full">
                          <div
                            className={`w-full flex items-center justify-between `}
                          >
                            <p
                              className={`${
                                lang == "ar" ? "font-cairo" : "font-raleway"
                              } font-[600] text-[#333333] text-[17.63px] ${
                                lang == "ar" ? "text-right mr-5" : "text-left "
                              }  text-left  truncate`}
                            >
                              {item?.attributes?.name}
                            </p>
                            {selectPay == item.id ? (
                              <div
                                style={{
                                  backgroundColor: colorSchema.borderColor,
                                }}
                                className={`w-2 h-2 rounded-full `}
                              ></div>
                            ) : null}
                          </div>

                          <p
                            className={`text-[15px] ${
                              lang == "ar" ? "font-cairo" : "font-raleway"
                            } font-[500] text-[#828282] leading-[18.58px]  h-[37.78px] mt-[6.7] ${
                              lang == "ar" ? "text-right mr-5" : "text-left "
                            }  line-clamp-2 `}
                          >
                            {item?.attributes?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            ) : (
              <div
                dir={setRtl}
                className={`flex justify-center text-red-500 text-sm mt-1 ${
                  lang == "ar" ? "font-cairo" : "font-raleway"
                } font-raleway font-bold`}
              >
                {resources?.NO_PAYMENT_RELOAD}
              </div>
            )}
            {/* PAYMENT METHOD SECTION ENDS HERE */}

            <div
              style={{ backgroundColor: colorSchema.backgroundColor }}
              className={`w-full flex-1 px-[5%] flex flex-col mt-8`}
            >
              <CategoryHeader
                title={resources?.DELIVERY_DETAILS}
                lang={lang}
                setRtl={setRtl}
              />
            </div>

            {/* BOTTOM DETAIL SECTION  */}
            <div
              dir={setRtl}
              className={`${
                lang == "ar" ? "lg:pr-14 mr-2  ml-2" : "lg:pl-14  "
              }flex w-full  mt-5  px-7  leading-[17.74px] tracking-[-0.32 px] `}
            >
              <div className=" ">
                <p
                  style={{ color: "#1B153D" }}
                  className={`${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } text-[15.11px]  font-[600]`}
                >
                  {resources?.PHONE_NUMBER_INCLUDING}
                </p>
                <p
                  className={`${
                    lang == "ar" ? "font-cairo mt-1" : "font-raleway"
                  } text-[15.11px] text-[#BDBDBD] font-[500] `}
                >
                  {resources?.FOR_THE_DELIVERY}
                </p>
              </div>
            </div>

            {/* INPUT SECTION */}
            <div className="flex justify-center items-center w-full mt-2 cursor-pointer ">
              <div className="w-[85%]  h-[54.15px] rounded-[12.59px] bg-[#FFFFFF] items-center justify-start flex shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)] ">
                <div
                  onClick={() => setCountryModal(true)}
                  className="flex justify-center ml-2"
                >
                  <img
                    height={15}
                    width={30}
                    src={`/flags/${countryobj?.code.toLocaleLowerCase()}.png`}
                  />
                  <p className="font-raleway text-[17.63px] ml-2 ">
                    {countryobj?.dial_code}
                  </p>
                </div>

                {countryModal == true ? (
                  <CountryModal
                    showModal={true}
                    handleCross={() => {
                      setCountryModal(false);
                    }}
                    data={countryCodeArr}
                    handleOnclickCountry={(item) => {
                      setCountryModal(false);
                      setcountryobj(item);
                      setcountryCodeArr(countryCode);
                      setcountryCodeSearch("");
                      //console.log(item);
                    }}
                    searchValue={countryCodeSearch}
                    handleChange={handleCountryCodeChange}
                  />
                ) : null}

                <input
                  id="phone-number"
                  autoComplete="tel"
                  style={{ color: colorSchema.borderColor }}
                  placeholder={resources?.ENTER_PHONE_NO}
                  className={`bg-[#FFFFFF]  text-[17.63px] font-[500] ${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } ml-4 items-center outline-none  leading-[20.7px]`}
                  value={state.number}
                  onChange={(e) =>
                    handleChange("number", e, {
                      type: "phone",
                      required: false,
                    })
                  }
                  type="text"
                />
              </div>
            </div>
            <div
              dir={setRtl}
              className="flex w-full items-center justify-center  "
            >
              <div className="w-[85%] flex items-start">
                <p
                  className={`text-red-500 ${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } text-[15px] mt-1  `}
                >
                  {errors.number}
                </p>
              </div>
            </div>

            {/* INPUT SECTION */}

            {/* <div className="flex  w-full justify-center items-center mt-3 ">
        <div className="w-[328.67px]   h-[37px]">
          <p
            style={{ color: "#1B153D" }}
            className={`font-raleway text-[15.11px] font-[600]`}
          >
            {resources?.EMAIL_ADDRESS}
          </p>
          <p className="font-raleway text-[14px] text-[#BDBDBD] font-[400] ">
            {resources?.TO_RECEIVE_NOTI}
          </p>
        </div>
      </div> */}
            <div
              dir={setRtl}
              className={`${
                lang == "ar" ? "lg:pr-14 mr-2  ml-2" : "lg:pl-14  "
              } flex w-full  mt-5  px-7  leading-[17.74px] tracking-[-0.32 px] `}
            >
              <div className=" ">
                <p
                  style={{ color: "#1B153D" }}
                  className={`${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } text-[15px]  font-[600]`}
                >
                  {resources?.EMAIL_ADDRESS}
                </p>
                <p
                  className={`${
                    lang == "ar" ? "font-cairo mt-1" : "font-raleway"
                  } text-[15px] text-[#BDBDBD] font-[500] `}
                >
                  {resources?.TO_RECEIVE_NOTI}
                </p>
              </div>
            </div>

            {/* INPUT SECTION */}
            <div className="flex justify-center items-center  w-full mt-2">
              <div className="w-[85%]  h-[54.15px] rounded-[12.59px] bg-[#FFFFFF] items-center justify-start flex shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)] ">
                <input
                  id="email"
                  autoComplete="email"
                  style={{ color: colorSchema.borderColor }}
                  className={`bg-[#FFFFFF]  text-[17.63px] font-[500] ${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } ml-4 items-center outline-none w-[90%] leading-[20.7px]`}
                  value={state.email}
                  placeholder={resources?.EMAIL_ADDRESS}
                  onChange={(e) =>
                    handleChange("email", e, {
                      type: "email",
                    })
                  }
                />
              </div>
            </div>
            <div
              dir={setRtl}
              className="flex w-full items-center justify-center  "
            >
              <div className="w-[85%] flex items-start">
                <p
                  className={`text-red-500 ${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  }  text-[15px] mt-1 `}
                >
                  {errors.email}
                </p>
              </div>
            </div>
            {/* INPUT SECTION */}
            {/* BOTTOM DETAIL SECTION  */}

            {/* BUTTON SECTION START*/}
            <div className="flex items-center justify-center w-full  mt-10 cursor-pointer">
              <button
                style={{ outline: "none" }}
                disabled={load}
                id="confirm-order-button"
                className="w-[310px]  h-[59px] rounded-[20px] bg-[#98B7FF] flex justify-center items-center shadow-md  hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg duration-150 ease-in-out"
                onClick={() => {
                  if (validate()) {
                    setLoad(true);
                    handleContactDetail();
                    confirmOrderPlaced();
                  }
                }}
              >
                <button
                  className={`${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } text-[16px] font-[600] cursor-pointer `}
                >
                  {resources?.CONFIRM_ORDER}
                </button>
              </button>
            </div>

            <div className="h-14"></div>
          </div>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  let lang = getLangServerSide(context).locale;
  let setRtl = getLangServerSide(context).rtl;
  // console.log("Context : ", context);
  let props;
  let isAPIFiled = false;
  let getResourceAPI = {};
  let storeIdParam = context.params?.id;
  let serviceIdParam = context.params?.serviceid;

  //GETTING IP ADRESS
  const forwarded = context.req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(/, /)[0]
    : context.req.connection.remoteAddress;

  try {
    props = await axios.get(`${endpoints.PAYMENT}?locale=${lang}&populate=*`);
    let resourceAPI = await axios.get(
      `${endpoints.GET_RESOURCES}/locale/${lang}`
    );
    if (resourceAPI.status == 200) {
      // converting [{Key:"X",value:"abc"}] to {X:"abc"}
      getResourceAPI = handleChangeResObj(resourceAPI.data);
    }
  } catch (er) {
    isAPIFiled = true;
    // replicating the object structure from the api
    props = { data: { data: [] } };
  }

  // console.log("this is payment data ====>", props.data);
  return {
    props: {
      routeStoreID: context.params?.id,
      paymentMethods: props.data,
      isAPIFiled: isAPIFiled,
      resources: getResourceAPI,
      storeIdParam: storeIdParam,
      serviceIdParam: serviceIdParam,
      ip: ip,
      lang,
      setRtl,
    },
  };
}

// export async function getServerSideProps(context) {
//   console.log("THIS IS CART PAGE", context);
//   return {
//     props: {},
//   };
// }
export default Index;
