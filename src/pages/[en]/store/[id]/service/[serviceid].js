import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";

// next js
import { useRouter } from "next/router";

// third party
import axios from "../../../../../utils/axios";
import endpoints from "../../../../../constant/endPoints";

// context
import { StoreContext, CartContext } from "../../../../../context/appContext";

// local
import NavBar from "../../../../../components/NavBar";
import SearchComponent from "../../../../../components/SearchComponent";
import ItemComponent from "../../../../../components/ItemComponent";
import TopBarComponent from "../../../../../components/TopBarComponent";
import CategoryHeader from "../../../../../components/CategoryHeader";
import CartModalComponent from "../../../../../components/CartModalComponent";
import MessageModal from "../../../../../components/MessageModal";
// import Loader from "../components/Loader";

import { handleChangeResObj } from "../../../../../utils/utilFunctions";
import { maxWidth } from "../../../../../hooks/useWindowSize";

//Language Imports
import getLang, {
  getLangServerSide,
  useLang,
} from "../../../../../utils/locale";
import AlertModal from "../../../../../components/AlertModal";
let timer; // debouncing

const Index = ({ apiRes, isAPIFiled, ...props }) => {
  // variable
  const [colorSchema, setColorSchema] = useState();
  const [colorLoaded, setColorLoaded] = useState(false);
  const router = useRouter();
  const [store, updateStore] = useContext(StoreContext);
  const [cartCont, updateCartCont] = useContext(CartContext);
  const [isRoomNumber, setRoomNumber] = useState(null);

  //state
  // console.log("res data :", apiRes.categories);
  const [state, setState] = useState(isAPIFiled ? [] : apiRes.categories);
  const [selectedList, setSelectedList] = useState(
    isAPIFiled ? "" : state[0]?.name
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedOptInd, setselectedOptInd] = useState({});
  const [inputVal, setInputVal] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [filterArr, setfilterArr] = useState([]);
  const [selectProdInd, setselectProdInd] = useState({
    categoryInd: 0,
    prodInd: 0,
  });
  const [messageModal, setmessageModal] = useState({
    isOpen: false,
    headingTxt: "",
    alertMessage: "",
  });
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    headingTxt: "",
    alertMessage: "",
  });
  const [hideRoom, setHideRoom] = useState();

  //LANGUAGE
  // const lang = useLang();
  const lang = props.lang;
  const setRtl = props.setRtl;

  //Srceen fixed when modal is open
  const [screenController, setScreenController] = useState(false);

  /***************** LOGIC ********************** */

  // [when]: function fire when we type something in search box
  //[Result]: create new array and show it to the user
  const handleSearch = (e) => {
    e.preventDefault();
    clearInterval(timer);
    timer = setTimeout(() => {
      if (e.target.value.length > 0 && e.target.value.trim() != "") {
        let tempCategory = [];
        let tempProducts = [];
        let isAddFlag = false;

        for (let category of state) {
          // resetting
          isAddFlag = false;
          tempProducts = [];
          for (let product of category.products) {
            let tempSearxh = e.target.value.replace(
              /[/\-\\^$*+?.()|[\]{}]/g,
              "\\$&"
            );
            var re = new RegExp(tempSearxh, "gi");
            let isValid = product.name.match(re);

            if (isValid != null) {
              isAddFlag = true;
              tempProducts.push(product);
            }
          }
          // measn add that category it has that products
          if (isAddFlag) {
            let tempSingleCate = {
              ...category,
              products: tempProducts,
            };
            tempCategory.push(tempSingleCate);
          }
        }

        setIsSearch(true);
        setfilterArr(tempCategory);
      } else {
        setIsSearch(false);
        setfilterArr([]);
      }
    }, 500);

    setInputVal(e.target.value);
  };

  //console.log("This is selected items in modal  ===>", selectedItem);

  const checkInventory = (item, inventoryIndex, noOfItems) => {
    const inventory = item.inventories[inventoryIndex];
    if (inventory.openQuantity) {
      return true;
    }

    // console.log("item", item, inventoryIndex, noOfItems);

    const isAvailable = inventory?.quantity >= noOfItems;

    if (!isAvailable) {
      setAlertModal({
        isOpen: true,
        headingTxt: props.resources?.SOLD_OUT,
        alertMessage: props.resources?.ITEM_SOLD_OUT,
      });
      setIsModalOpen(false);
    }

    return isAvailable;
  };

  // [when]: function fire when we click on add button in model
  // [Result]: if products belong to the existing service in the cart call handleAddProductToCart else open modal
  const handleCheckService = (noOfItems, selectedOptionInd) => {
    let tempSelectedItem;

    // copying things
    tempSelectedItem = { ...selectedItem };

    // updating the selected item quanitity
    tempSelectedItem.inCart = noOfItems;

    // check for other service product in cart
    let cartLocalStr = localStorage.getItem("cart");
    //console.log("THis is cart local storage", cartLocalStr);

    if (cartLocalStr && !isAPIFiled) {
      let serializedCartObj = JSON.parse(cartLocalStr);

      // now check if the service id is same
      if (serializedCartObj?.serviceId == apiRes.uuid) {
        handleAddProductToCart(noOfItems, false, selectedOptionInd);
        setIsModalOpen(false);
      } else {
        setIsModalOpen(false);
        setSelectedItem(tempSelectedItem);
        setselectedOptInd(selectedOptionInd);
        setmessageModal({
          isOpen: true,
          headingTxt: props.resources?.START_NEW_BASKET,
          alertMessage: props.resources?.A_NEW_ORDER_WILL,
        });
      }
    } else {
      setIsModalOpen(false);
      handleAddProductToCart(noOfItems, false, selectedOptionInd);
    }
    setScreenController(false);
  };

  // console.log("THIS IS SERVICE apiRes ==========>", apiRes);

  // [when]: if the same service direct call from  => handleCheckService , else from MessageModal model
  //[Result]: update the state and local storage
  const handleAddProductToCart = (
    noOfItems,
    isClearCart = false,
    selectedOptIndArg
  ) => {
    // variable
    let tempCartCont;
    let tempStateArr;
    let tempSelectedItem;

    // making a copy of state array
    tempCartCont = { ...cartCont };
    tempSelectedItem = { ...selectedItem };
    // updating the selected item quanitity
    tempSelectedItem.inCart = isClearCart
      ? noOfItems
      : tempSelectedItem.inCart + noOfItems; // flow

    // creating new cart
    if (isClearCart) {
      tempCartCont.products = [];
      tempCartCont.serviceId = "";
    }

    // Now syncing items
    tempStateArr = state.map((category) => {
      return {
        ...category,
        products: category.products.map((product) => {
          return {
            ...product,
            inCart:
              product.uuid === tempSelectedItem.uuid
                ? tempSelectedItem.inCart
                : product.inCart,
          };
        }),
      };
    });

    //----------------------------- updating our cart -------------//
    let inventoryInd = -1;
    if (tempCartCont.products == undefined) {
      tempCartCont.products = [];
    }
    let isExitInCartInd = tempCartCont?.products?.findIndex(
      (i) => i.uuid == tempSelectedItem.uuid
    );

    if (isExitInCartInd != -1) {
      inventoryInd = tempCartCont.products[
        isExitInCartInd
      ].inventories.findIndex(
        (i) =>
          i.inventoryID == tempSelectedItem.inventories[selectedOptIndArg].id
      );
    }

    // Exits yani update
    if (isExitInCartInd != -1 && inventoryInd != -1) {
      // update the obj
      tempCartCont.products[isExitInCartInd].total = tempSelectedItem.inCart;
      tempCartCont.products[isExitInCartInd].inventories[inventoryInd].inCart +=
        noOfItems;
    } else if (isExitInCartInd != -1) {
      tempCartCont.products[isExitInCartInd].total = tempSelectedItem.inCart;
      tempCartCont.products[isExitInCartInd].inventories.push({
        price: tempSelectedItem.inventories[selectedOptIndArg].price,
        currency: tempSelectedItem.inventories[selectedOptIndArg].currency,
        inventoryID: tempSelectedItem.inventories[selectedOptIndArg].id,
        title: tempSelectedItem.inventories[selectedOptIndArg]?.option?.title,
        inCart: noOfItems,
      });
    } else {
      // console.log("adding to cart :", tempSelectedItem);
      // first time product just pusing it into array

      tempCartCont.products.push({
        imageUrl: tempSelectedItem.images[0].previewUrl,
        SKU: tempSelectedItem.SKU,
        id: tempSelectedItem.id,
        uuid: tempSelectedItem.uuid,
        name: tempSelectedItem.name,
        total: tempSelectedItem.inCart,
        serviceFee: apiRes?.serviceFee,
        inventories: [
          {
            price: tempSelectedItem.inventories[selectedOptIndArg].price,
            currency: tempSelectedItem.inventories[selectedOptIndArg].currency,
            inventoryID: tempSelectedItem.inventories[selectedOptIndArg].id,
            title:
              tempSelectedItem.inventories[selectedOptIndArg]?.option?.title,
            inCart: noOfItems,
          },
        ],
      });
      // setting service ID
      tempCartCont.serviceId = apiRes.uuid;
    }

    // update context
    updateCartCont(tempCartCont);
    // update state
    setState(tempStateArr);

    /**[IMP] Logic
     *  basically product search kr ke add kr ne pe issue a rha tha use fix kra he
     */

    setIsSearch(false);
    setInputVal("");
  };

  // CDM
  useEffect(() => {
    // CART sync logic
    let cartLocalStr = localStorage.getItem("cart");
    if (cartLocalStr && !isAPIFiled) {
      let serializedCartObj = JSON.parse(cartLocalStr);

      // now check if the service id is same
      if (serializedCartObj?.serviceId) {
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
          // console.log(res);
        })
        .catch((er) => {
          // console.log(er);
        });
    }
    return () => {};
  }, []);

  let loopArr = isSearch ? filterArr : state;

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
  }, []);

  //console.log("PRODUCTS", loopArr);
  useEffect(() => {
    //STOPPING SCROLL WHEN MODAL IS OPEN
    if (isModalOpen == true) {
      document.body.style.overflow = "hidden";
    } else if (isModalOpen == false) {
      document.body.style.overflow = "scroll";
    }
  }, [isModalOpen]);

  // Getting value of hide Room state
  const getHideRoom = () => {
    const localRoom = localStorage.getItem("hideRoom");
    if (localRoom) {
      setHideRoom(localRoom === "true");
    } else {
      localStorage.setItem("hideRoom", router.query.hideRefCodeFromUser);
      setHideRoom(localRoom === "true");
    }
  };

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
  // console.log("THIS IS CATEGORIES", loopArr);
  // console.log("<====== haha", cartCont?.products);
  return (
    <>
      <Head>
        <title>{store?.name}</title>

        <meta
          property="og:image"
          content={store?.logo != null ? store?.logo?.previewUrl : ""}
        />
        <meta name="description" content={"Service Page"} />
        <meta property="og:title" content={store?.name} />
      </Head>
      <div>
        <MessageModal
          lang={lang}
          setRtl={setRtl}
          showModal={messageModal.isOpen}
          headingTxt={messageModal.headingTxt}
          alertMessage={messageModal.alertMessage}
          resource={props?.resources}
          handleUserChoice={(userChoice) => {
            if (userChoice) {
              handleAddProductToCart(selectedItem.inCart, true, selectedOptInd);
            }

            setmessageModal({
              isOpen: false,
              headingTxt: "",
              alertMessage: "",
            });
          }}
        />
        <AlertModal
          lang={lang}
          setRtl={setRtl}
          showModal={alertModal.isOpen}
          headingTxt={alertModal.headingTxt}
          alertMessage={alertModal.alertMessage}
          resource={props?.resources}
          handleUserChoice={() => setAlertModal(false)}
        />
        {colorLoaded && (
          <div
            style={{ backgroundColor: colorSchema.backgroundColor }}
            className={`w-screen h-full min-h-screen items-center flex flex-col ${
              screenController == true ? "" : ""
            }  `}
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
                  pathname: `/${lang}/store/${props.storeIdParam}/service/${props.serviceIdParam}/cart`,
                  query: {
                    // storeID: props.storeIdParam,
                    // serviceID: props.serviceIdParam,
                    roomNo: router.query.roomNo,
                  },
                })
              }
              // itemInCart={cartCont?.products}
              itemInCart={calculateTotal(cartCont?.products)}
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
            {/* API failed   */}

            {isAPIFiled ? (
              <div
                dir={setRtl}
                className="w-screen h-screen flex justify-center items-center  pt-[75px]"
              >
                <p className="font-raleway ">
                  Something went wrong. Please try again later{" "}
                </p>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: colorSchema.backgroundColor,
                  maxWidth: maxWidth,
                }}
                className={` w-full  h-fit pt-[75px] `}
              >
                {isModalOpen && (
                  <CartModalComponent
                    lang={lang}
                    setRtl={setRtl}
                    item={selectedItem}
                    showModal={isModalOpen}
                    handleClose={() => {
                      setIsModalOpen(false);
                      setScreenController(false);
                    }}
                    handleAdd={(noOfItems, selectedItemIndex) => {
                      if (
                        !checkInventory(
                          selectedItem,
                          selectedItemIndex,
                          noOfItems
                        )
                      )
                        return;
                      handleCheckService(noOfItems, selectedItemIndex);
                    }}
                    resources={props?.resources}
                  />
                )}

                <div
                  dir={setRtl}
                  className="w-full flex items-center justify-center "
                >
                  <SearchComponent
                    lang={lang}
                    setRtl={setRtl}
                    inputVal={inputVal}
                    placeholder={props?.resources?.SEARCH_PRODUCTS}
                    handleChange={handleSearch}
                  />
                </div>

                <div
                  dir={setRtl}
                  className="flex items-center justify-center mt-[24px] "
                >
                  <TopBarComponent
                    lang={lang}
                    setRtl={setRtl}
                    data={loopArr}
                    selected={selectedList}
                    setSelected={setSelectedList}
                  />
                </div>

                <div dir={setRtl} className="pb-5">
                  {loopArr.length > 0 ? (
                    <>
                      {loopArr.map((singleCate, categoryInd) => {
                        return (
                          <div key={categoryInd}>
                            {singleCate.products.length > 0 && (
                              <div
                                id={singleCate.name}
                                className="flex flex-wrap w-full justify-between items-center mb-2 px-4 mt-6 "
                              >
                                <CategoryHeader
                                  lang={lang}
                                  setRtl={setRtl}
                                  title={
                                    lang == "ar"
                                      ? singleCate.nameArabic
                                      : singleCate.name
                                  }
                                />

                                {singleCate.products.map((item, prodInd) => (
                                  <ItemComponent
                                    lang={lang}
                                    setRtl={setRtl}
                                    key={prodInd}
                                    item={item}
                                    className="w-[48%] mt-2 "
                                    onClick={() => {
                                      if (item?.showAsDetailPage) {
                                        router.replace({
                                          pathname: `/${lang}/store/${props.storeIdParam}/service/${props.serviceIdParam}/product/${item.uuid}`,

                                          query: {
                                            roomNo: router.query.roomNo,
                                            hideRefCodeFromUser: hideRoom,
                                            ...(apiRes?.serviceFee && {
                                              serviceFee: apiRes.serviceFee,
                                            }),
                                          },
                                        });
                                      } else {
                                        setselectProdInd({
                                          categoryInd: categoryInd,
                                          prodInd: prodInd,
                                        });
                                        setSelectedItem(item);
                                        setIsModalOpen(true);
                                        setScreenController(true);
                                      }
                                    }}
                                  />
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

export async function getServerSideProps(context) {
  let lang = getLangServerSide(context).locale;
  let setRtl = getLangServerSide(context)?.rtl;

  // validations
  if (!context.params.id || !context.params.serviceid) {
    return {
      notFound: true,
    };
  }

  // var declaeration
  let resStoreBy_UID_Ser_ID;
  let getResourceAPI = {};
  let isAPIFiled = false;
  let APIRes = null;
  let storeIdParam = context.params?.id;
  let serviceIdParam = context.params?.serviceid;
  // let loading = true;

  try {
    // api call
    resStoreBy_UID_Ser_ID = await axios.get(
      `${endpoints.GET_STORE_BY_ID}/${context.params?.id}/services/${context.params?.serviceid}/categories`,
      {
        headers: {
          locale: lang,
        },
      }
    );

    // console.log("THIS IS SERVICE API RESPONCE", resStoreBy_UID_Ser_ID.data);
    let resourceAPI = await axios.get(
      `${endpoints.GET_RESOURCES}/locale/${lang}`
    );

    // now checking if successfull
    if (resourceAPI.status == 200) {
      // loading = false;
      // converting [{Key:"X",value:"abc"}] to {X:"abc"}
      getResourceAPI = handleChangeResObj(resourceAPI.data);
    }

    APIRes = resStoreBy_UID_Ser_ID.data.data;
    // console.log("[SERVICE] ===> [RES] ====>", APIRes);

    // [IF serviceID] galat ho to data:{} aese response a rha he. Is ko handle kr rha ho
    if (Object.keys(APIRes).length == 0) {
      // setting our check to true
    } else {
      // UPDATING response adding require properties
      let addingRequiredObj = {
        ...APIRes,
        categories: APIRes?.categories.map((singelCate) => {
          return {
            ...singelCate,
            nameArabic: singelCate?.nameLocale
              ? singelCate?.nameLocale
              : singelCate.name,

            products: singelCate.products.map((singleProd, index) => {
              return {
                ...singleProd,
                inCart: 0,
              };
            }),
          };
        }),
      };

      APIRes = addingRequiredObj;
      // console.log(
      //   "[server] => [AFTER UPDATE] => addingRequiredObj ===>",
      //   JSON.stringify(addingRequiredObj)
      // );
    }
  } catch (err) {
    //console.log("err =>", err);
    isAPIFiled = true;
    // loading = false;
  }

  return {
    props: {
      apiRes: APIRes,
      isAPIFiled: isAPIFiled,
      resources: getResourceAPI,
      storeIdParam: storeIdParam,
      serviceIdParam: serviceIdParam,
      lang,
      setRtl,
      // loading: loading,
    },
  };
}

export default Index;
