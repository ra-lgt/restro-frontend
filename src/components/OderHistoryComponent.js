import React, { useState, useEffect } from "react";
import Image from "next/image";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

const OderHistoryComponent = ({
  data,
  setData,
  colorSchema,
  resources,
  lang,
  setRtl,
  ...props
}) => {
  // const lang = useLang();

  return (
    <>
      {data.length > 0 ? (
        <div
          style={{ backgroundColor: colorSchema.backgroundColor }}
          className=" w-screen mt-16 flex  flex-col  items-center   pb-5"
        >
          <div
            className={`flex items-center justify-center  ${
              lang == "ar" ? " font-cairo" : "font-raleway "
            } mt-5 font-[600] text-[20px]`}
          >
            {/* <p>{lang == "ar" ? "تاريخ الطلب" : "Order History"}</p> */}
            <p>{resources?.order_history}</p>
          </div>

          {data
            .slice(0)
            .reverse()
            .map((val, i) => {
              return (
                <div
                  key={i}
                  onClick={() => {
                    setData(
                      data.map((item) => {
                        if (item.orderNumber == val.orderNumber) {
                          return {
                            ...item,
                            isOpen: !val.isOpen,
                          };
                        } else {
                          return item;
                        }
                      })
                    );
                  }}
                  className={` ${
                    val?.isOpen ? "rounded-b-[18.46px]" : "rounded-[18.46px]"
                  }  shadow-lg bg-white mt-4 w-10/12 max-w-[650px] `}
                >
                  <div
                    dir={setRtl}
                    className={` flex bg-gray-500 justify-between border-b border-gray-100 px-4 py-2  rounded-tr-[18.46px] rounded-tl-[18.46px] `}
                  >
                    <div className="flex items-center justify-between w-full   ">
                      <div>
                        <span
                          className={`font-bold text-white text-sm  ${
                            lang == "ar" ? "ml-2 font-cairo " : "font-raleway "
                          }`}
                        >
                          {resources?.ORDER_NO}
                        </span>
                        <span className="font-bold text-white text-sm ml-1 font-raleway">
                          {val.orderNumber}
                        </span>
                      </div>

                      {val.isOpen ? (
                        <div className="flex items-center justify-center">
                          <img
                            className="w-[20px] h-[20px]"
                            src={"/dropUp.png"}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <img
                            className="w-[20px] h-[20px]"
                            src={"/down.png"}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    dir={setRtl}
                    className={` py-2 w-full lg:w-[600px] flex text-gray-600 ${
                      lang == "ar" ? "font-cairo" : "font-raleway"
                    } text-[14px]  `}
                  >
                    <div className="flex flex-col items-start px-4">
                      <p>{resources?.ORDER_DATE} :</p>
                      <p>{resources?.ORDER_TIME} :</p>
                      <p>{resources?.TOTAL_ITEMS} :</p>
                      <p>{resources?.PAY_METHOD} :</p>
                      <p>{resources?.SER_CHARGES} :</p>

                      <p className="font-[700]">{resources?.GRAND_TOTAL}</p>
                    </div>
                    <div className="w-10"></div>
                    <div className="flex flex-col ">
                      <p>{val.orderDate} </p>
                      <p className="">{val.orderTime}</p>
                      <p>{val.totalItems}</p>
                      <p className="">{val.paymentMethod}</p>
                      <div className="flex">
                        <p>{val.currency}</p>
                        <p className=" font-[700] ml-2">{val.serviceCharge}</p>
                      </div>

                      <div className="flex">
                        <p>{val.currency}</p>
                        <p className="font-[700] ml-2">{val.grandTotal}</p>
                      </div>
                    </div>
                  </div>
                  {/* Items details here  */}
                  {val.products.map((a, j) => {
                    return (
                      <>
                        {val.isOpen ? (
                          <div key={`${i}-${j}`}>
                            <div
                              dir={setRtl}
                              className="flex flex-col w-[100%] items-center pl-4 pr-4 pb-2 "
                            >
                              <div
                                id="cart-product-component"
                                className="bg-white w-[100%]  items-center justify-center pt-1 pb-3  "
                              >
                                <div className="flex w-[100%] justify-between mt-2 items-center px-4">
                                  <div className="flex  items-center w-full font-bold">
                                    <img
                                      className="w-[30px] h-[30px]"
                                      src={a.imageUrl}
                                    />
                                    <div className="mx-2  max-w-[80%] overflow-hidden">
                                      <div
                                        className={`text-sm line-clamp-1 ${
                                          lang == "ar"
                                            ? "font-cairo"
                                            : "font-raleway"
                                        }`}
                                      >
                                        {a.name}
                                      </div>
                                      {a.inventories.map((variant, k) => {
                                        return (
                                          <div
                                            key={`${i}-${j}-${k}`}
                                            className={`text-xs text-gray-500 w-fit ${
                                              lang == "ar"
                                                ? "font-cairo"
                                                : "font-raleway"
                                            } font-[400] line-clamp-1`}
                                          >
                                            {/* {variant.title} */}
                                            {
                                              resources[
                                                `OPTION_${variant.title
                                                  ?.toUpperCase()
                                                  ?.replace(" ", "_")}`
                                              ]
                                            }
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                                {a.inventories.map((b, l) => {
                                  return (
                                    <>
                                      <div
                                        key={`${i}-${j}-${l}`}
                                        className=" flex w-[100%] items-center justify-center mt-3 text-[14px] font-[500]  "
                                      >
                                        <div className="w-[90%] flex justify-between ">
                                          <p
                                            className={`w-[30%] ${
                                              lang == "ar"
                                                ? "font-cairo"
                                                : "font-raleway"
                                            }`}
                                          >
                                            {b.currency} {b.price}
                                          </p>
                                          <div className="flex items-center justify-center w-[25%] font-raleway ">
                                            <div className="  items-center justify-center text-center font-raleway text-[16px]">
                                              {a.total}
                                            </div>
                                          </div>
                                          <p
                                            className={`w-[25%] ${
                                              lang == "ar"
                                                ? "font-cairo"
                                                : "font-raleway"
                                            }  text-right`}
                                          >
                                            {b.currency} {b.price * b.inCart}
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </>
                    );
                  })}

                  {/* Items details End  */}
                </div>
              );
            })}
        </div>
      ) : (
        <div
          className={`w-screen h-screen flex items-center ${
            lang == "ar" ? "font-cairo" : "font-raleway"
          } justify-center`}
        >
          {resources?.you_have_no_order_history}
        </div>
      )}
    </>
  );
};

export default OderHistoryComponent;

export async function getServerSideProps(context) {
  let lang = getLangServerSide(context).locale;
  let setRtl = getLangServerSide(context).rtl;

  return {
    props: {
      lang,
      setRtl,
    },
  };
}
