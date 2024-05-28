import React from "react";
import Image from "next/image";
import useWindowSize from "../hooks/useWindowSize";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

// props details
// item => name,price,unitOfPrice => (e.g per price, per kg),image,inCart, => no of items in cart if 0 then no border if more than 0 we will have border and number on bottom
// className => more specification for the container such as container width default is 48%
// onClick => handling onClick event

const ItemComponent = ({
  item,
  className,
  onClick,
  lang,
  setRtl,
  ...props
}) => {
  // const lang = useLang();

  const store =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("store"))
      : { serviceID: "", products: [] };

  const size = useWindowSize();
  //GETTING COLOR
  const colorSchema = {
    backgroundColor: store?.backgroundColor ? store.backgroundColor : "#FCFCFF",
    fontColor: store?.fontColor ? store.fontColor : "#4F4F4F",
    borderColor: store?.borderColor ? store.borderColor : "#1B153D",
  };

  return (
    <div className={`w-[50%] p-0.5  ${className}`} onClick={onClick}>
      <div
        className="p-[2px]  "
        style={{
          backgroundColor: item.inCart > 0 ? colorSchema.borderColor : null,
          borderRadius: "1.0625rem",
        }}
      >
        <div
          id="item-component"
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          style={{
            borderRadius: "1 rem",
          }}
          className={`flex flex-col rounded-[15px]  bg-white  px-2 py-1.5 text-[15px] tracking-[-0.269929px] leading-[18px] shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)]  `}
        >
          <div
            id="id-component-image"
            className="relative rounded-[14.66px] "
            style={{ height: size.width * 0.27 }}
          >
            <img
              className="absolute h-full w-full object-cover rounded-[14.66px] "
              src={
                item?.images?.[0] != null ? item?.images?.[0]?.previewUrl : ""
              }
            />
          </div>
          <div className={`flex flex-col w-[100%] h-[70px] justify-between  `}>
            <div className=" flex justify-between">
              <div
                style={{ color: colorSchema.fontColor }}
                id="item-component-name"
                className={` mt-3 self-start min-w-[55%] max-w-[200px] text-[14.5px] font-[500] leading-[17.65px] tracking-[-0.27 px] text-start ${
                  lang == "ar"
                    ? "font-cairo  leading-[20px]"
                    : "font-raleway  leading-[17.65px] "
                } text-[#333333]`}
              >
                <p className="line-clamp-2">
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
                id="item-component-price"
                style={{ color: colorSchema.fontColor }}
                className={` flex flex-col justify-start text-end mt-[13px] ml-[3px] text-[13.04px] w-[130%] lg:w-[150px] font-[500] ${
                  lang == "ar" ? "font-cairo" : "font-raleway"
                }   h-[100%] truncate  `}
              >
                {item?.inventories[0]?.currency} {item?.inventories[0]?.price}{" "}
                {item?.inventories[0]?.maxPrice ? (
                  <p className="line-through font-raleway text-[13.04px]">
                    {item?.inventories[0]?.currency}{" "}
                    {item?.inventories[0]?.maxPrice}
                  </p>
                ) : (
                  <></>
                )}
                {item?.unitOfPrice && <sup>{item.unitOfPrice}</sup>}
              </div>
            </div>

            <div className=" flex items-end justify-end relative bottom-1.5 mt-1  ">
              {item.inCart > 0 && (
                <div
                  style={{ backgroundColor: colorSchema.borderColor }}
                  className={` h-[26px] w-[26px] rounded-full  text-white text-[14px] flex items-center justify-center font-raleway  `}
                >
                  {item.inCart}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemComponent;

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
