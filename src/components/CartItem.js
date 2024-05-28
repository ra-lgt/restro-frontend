import Image from "next/image";
import React, { lazy, useEffect } from "react";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

const CartItem = ({
  val,
  index,
  handleRemoveProd,
  handleRemoveProduct,
  handleAddProduct,
  resources,
  lang,
  setRtl,
  ...props
}) => {
  // const lang = useLang();
  // console.log(">>>>>>>", val);
  return (
    <>
      <div>
        {val?.inventories.map((singleInven, invIndex) => (
          <div
            className="flex flex-col w-[100%] items-center pl-4 pr-4 pb-2"
            key={invIndex}
          >
            <div
              id="cart-product-component"
              className="bg-white  w-[90%] rounded-[18.46px] items-center justify-center pt-1 pb-3  shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)]  "
            >
              <div
                key={index}
                className="flex w-[100%] justify-between mt-2 items-center px-4"
              >
                <div className="flex  items-center w-full font-bold">
                  <img className="w-[30px] h-[30px]" src={val.imageUrl} />
                  <div
                    className={`mx-2  max-w-[80%] overflow-hidden ${
                      lang == "ar" ? "font-cairo" : "font-raleway"
                    }`}
                  >
                    <div className="text-sm line-clamp-1">{val.name}</div>
                    <div
                      className={`text-xs text-gray-500 w-fit ${
                        lang == "ar" ? "font-cairo" : "font-raleway"
                      } font-[400] line-clamp-1`}
                    >
                      {/* {singleInven.title} */}
                      {
                        resources[
                          `OPTION_${singleInven.title
                            ?.toUpperCase()
                            ?.replace(" ", "_")}`
                        ]
                      }
                    </div>
                  </div>
                </div>

                <div className="" onClick={() => handleRemoveProd(val.uuid)}>
                  <img src={"/crossIcon.svg"} className="w-[12px] h-[12px]" />
                </div>
              </div>

              <div className=" flex w-[100%] items-center justify-center mt-3 text-[14px] font-[500]  ">
                <div className="w-[90%] flex justify-between ">
                  <p
                    className={`w-[30%] ${
                      lang == "ar" ? "font-cairo" : "font-raleway"
                    }`}
                  >
                    {" "}
                    {singleInven.currency} {singleInven.price}
                  </p>
                  <div className="flex items-center justify-between w-[25%] font-raleway ">
                    <div
                      className="flex items-center justify-between"
                      onClick={() => handleRemoveProduct(index, invIndex)}
                    >
                      <img height={15} width={15} src={"/minusIcon.svg"} />
                    </div>
                    <div className=" w-10 items-center justify-center text-center font-raleway text-[16px]">
                      {singleInven.inCart}
                    </div>
                    <div
                      className="flex items-center justify-between"
                      onClick={() => handleAddProduct(index, invIndex)}
                    >
                      <img
                        className="h-[15px] w-[15px]"
                        src={"/plusIcon.svg"}
                      />
                    </div>
                  </div>
                  <p
                    className={`w-[25%] ${
                      lang == "ar" ? "font-cairo" : "font-raleway"
                    } text-right`}
                  >
                    {" "}
                    {singleInven.currency}{" "}
                    {(singleInven.price * singleInven.inCart).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CartItem;
