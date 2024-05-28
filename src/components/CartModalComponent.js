import React, { useState, useEffect } from "react";
import Image from "next/image";

import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

// local
import RadioButton from "./RadioButton";
import { maxWidth } from "../hooks/useWindowSize";
import ImageDisplayComponent from "./ImageDisplayComponent";

//Props Details
//item => name, price, image, info

const CartModalComponent = ({
  item,
  showModal,
  handleClose,
  resources,
  handleAdd,
  lang,
  setRtl,
  ...props
}) => {
  // console.log("[CartModalComponent] ===>", item);
  // console.log("[CartModalComponent] ===>", item.inCart);
  const [noOfItems, setNoOfItems] = useState(1);
  const [selectedArr, setselectedArr] = useState([]);
  const [selectedOptionInd, setselectedOptionInd] = useState(0);
  const [displayImageModal, setDisplayImageModal] = useState(false);
  // const lang = useLang();

  const increaseNoOfItems = () => {
    setNoOfItems(noOfItems + 1);
  };
  const decreaseNoOfItems = () => {
    if (noOfItems > 1) setNoOfItems(noOfItems - 1);
  };

  const handleChangeOption = (userChoice, index) => {
    if (index != setselectedOptionInd) {
      let tempArr = [];
      for (let i = 0; i < selectedArr.length; i++) {
        let isSelected = i === index ? true : false;
        tempArr.push(isSelected);
      }
      setselectedArr(tempArr);
      setselectedOptionInd(index);
    }
  };

  useEffect(() => {
    let tempArr = [];
    // filling the selectedArr
    for (let i = 0; i < item.inventories.length; i++) {
      let isSelected = i === 0 ? true : false;
      tempArr.push(isSelected);
    }
    //updating the state
    setselectedArr(tempArr);

    return () => {
      //console.log("CWU");
      setNoOfItems(1);
      setselectedArr([]);
      setselectedOptionInd(0);
    };
  }, [item]);

  const colorSchema = {
    backgroundColor: "#FCFCFF",
    fontColor: "#4F4F4F",
    borderColor: "#1B153D",
  };

  return (
    <>
      {showModal ? (
        <>
          {displayImageModal && (
            <ImageDisplayComponent
              handleCloseImage={() => setDisplayImageModal(false)}
              showDrawer={displayImageModal}
              image={
                item?.coverImage?.url != null
                  ? item?.coverImage?.previewUrl
                  : item?.images[0]?.url
              }
              // handleNavigation={() => console.log("THis is working fine")}
            />
          )}
          <div
            dir={setRtl}
            className={`justify-center items-end flex fixed inset-0 h-full  ${
              displayImageModal == true ? "z-10 " : "z-40 "
            } `}
          >
            {/*content*/}
            <div
              id="modal"
              style={{ maxWidth: maxWidth }}
              className="h-[75%]  rounded-tl-2xl rounded-tr-2xl shadow-lg flex flex-col w-full bg-white lg:w-[790px]"
            >
              <div
                onClick={() => setDisplayImageModal(true)}
                id="modal-image"
                className={`w-full h-[35%] rounded-tl-2xl rounded-tr-2xl backdrop ${
                  item?.coverImage?.previewUrl ? "bg-cover" : "bg-contain"
                } item  bg-no-repeat bg-center`}
                style={{
                  backgroundImage: `url('${
                    // item?.images[0] != null ? item?.images[0]?.url : ""
                    item?.coverImage?.url != null
                      ? item?.coverImage?.previewUrl
                      : item?.images[0]?.url
                  }')`,
                  // backgroundRepeat: "no-repeat",
                  // backgroundPosition: "center",
                  // backgroundSize: "100%",
                }}
              >
                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className={`flex items-center justify-center w-[30px] h-[30px] opacity-[0.8]  bg-[#D9D9D9]  ${
                    lang == "ar"
                      ? "float-left ml-[16px] "
                      : "float-right mr-[16px]"
                  } rounded-md mr-[16px] mt-[16px] shadow hover:bg-[#D9D9D9] hover:shadow focus:bg-[#F2F2F2] focus:shadow focus:outline-none focus:ring-0 active:bg-[#F2F2F2] active:shadow-lg transition duration-150 ease-in-out`}
                  onClick={handleClose}
                >
                  <img
                    alt="close button"
                    src="/crossIcon.svg"
                    className="h-[16px] w-[16px] "
                  />
                </button>
              </div>

              {/*name and price*/}
              <div
                id="modal-heading"
                className="flex w-[85%] items-center self-center justify-between mt-[23px] "
              >
                <div
                  className={` ${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  } font-[600] text-[22px] w-[230px] lg:w-[450px] text-[#333333] line-clamp-2`}
                >
                  <p>
                    {
                      (item.name =
                        lang === "ar" && item.nameLocale
                          ? item.nameLocale
                          : item.nameLocale
                          ? item.nameLocale
                          : item.name)
                    }
                  </p>
                </div>
                <div
                  id="modal-price"
                  className={`${
                    lang == "ar" ? "font-cairo" : "font-raleway"
                  }  font-bold text-[18px] text-[#4F4F4F]`}
                >
                  <p>
                    {item?.inventories[selectedOptionInd]?.currency}{" "}
                    {item?.inventories[selectedOptionInd]?.price}
                  </p>
                </div>
              </div>
              {/* info */}
              <div
                id="modal-description"
                className={`w-[85%] ${
                  item.inventories.length > 1 ? "h-[18%]" : "h-[28%]"
                } h-[18%] text-[16px] items-center self-center justify-center mt-2  ${
                  lang == "ar" ? "font-cairo" : "font-inter"
                } leading-[19.36px]  overflow-auto scrollbar-hide `}
              >
                <p className="  w-[85%] text-[#9095a6]">
                  {" "}
                  {/* {lang == "ar" && item.descriptionLocale !== null
                    ? item.description
                    : item.descriptionLocale} */}
                  {
                    (item.summary =
                      lang === "ar" && item.summaryLocale
                        ? item.summaryLocale
                        : item.summaryLocale
                        ? item.summaryLocale
                        : item.summary)
                  }
                </p>
                {/* <p className="  w-[85%] text-[#9095a6]">{item.summary}</p> */}
              </div>

              {/* option
              CONDITION: only show if have length > 1
              */}

              {item?.inventories.length > 1 && (
                <div
                  id="modal-radio-button"
                  className={`w-[85%]  ${
                    item?.inventories.length > 1 ? "h-[15%]" : null
                  }h-[15%]  items-center self-center justify-center mt-2  overflow-y-auto scrollbar-hide 
                  `}
                >
                  {item?.inventories.map((inven, index) => (
                    <RadioButton
                      key={index}
                      inventory={inven}
                      radioText={
                        resources[
                          `OPTION_${inven?.option?.title
                            ?.toUpperCase()
                            ?.replace(" ", "_")}`
                        ]
                      }
                      selected={selectedArr[index]}
                      setSelected={(userChoice) =>
                        handleChangeOption(userChoice, index)
                      }
                    />
                  ))}
                </div>
              )}

              {/*option ends*/}

              {/*footer Buttons*/}
              <div className="w-[95%] items-center self-center flex justify-around mt-5">
                <div className="w-[30%]  flex justify-around items-center">
                  <div
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="items-center bg-[#F2F2F2] rounded-[16.16px] w-[36.37px]  h-[38.57px] p-0.5 justify-center flex  shadow hover:bg-[#D9D9D9] hover:shadow focus:bg-[#F2F2F2] focus:shadow focus:outline-none focus:ring-0 active:bg-[#F2F2F2] active:shadow-lg transition duration-150 ease-in-out"
                    onClick={decreaseNoOfItems}
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
                    onClick={increaseNoOfItems}
                  >
                    <div
                      className={`cursor-default items-center self-center font-raleway text-[33.06px] font-bold text-[${colorSchema.borderColor}]`}
                    >
                      +
                    </div>
                  </div>
                </div>

                <button
                  id="button"
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className={`items-center rounded-[20px] w-[173px] lg:w-[300px] h-[61px] bg-[#98B7FF] shadow-md hover:bg-[#A2BEFF] hover:shadow-lg focus:bg-[#98B7FF] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#98B7FF] active:shadow-lg transition duration-150 ease-in-out`}
                  onClick={() => {
                    handleAdd(noOfItems, selectedOptionInd);
                  }}
                >
                  <p
                    className={` text-[${colorSchema.borderColor}] ${
                      lang == "ar" ? "font-cairo" : "font-raleway"
                    } font-[600] items-center text-center p-2  text-[18px]`}
                  >
                    {/* {resources?.ADD_TO_CART
                      ? resources?.ADD_TO_CART
                      : "Add to cart"} */}
                    {lang == "ar" ? "أضف إلى السلة " : "Add to cart"}
                  </p>
                </button>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default CartModalComponent;
