import React from "react";
import Image from "next/image";
import useWindowSize from "../hooks/useWindowSize";
import getLang, { getLangServerSide, useLang } from "../utils/locale";

const RequestComponent = ({
  item,
  className,
  onClick,
  lang,
  setRtl,
  inventory,
  selected = false,
  onChange = (e = true || false) => {},
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
    <div
      className={`w-[49%] p-0.5  ${className} relative scrollbar-hide`}
      onClick={() => onChange(!selected)}
    >
      <div
        className="p-[2px] "
        style={{
          backgroundColor: selected ? colorSchema.borderColor : null,
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
          className={`flex flex-col rounded-[15px] ${
            selected ? "bg-[#e8e7eb]" : "bg-white"
          }   px-2 py-1.5 text-[15px] tracking-[-0.269929px] leading-[18px] shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)]  `}
        >
          <div
            id="id-component-image"
            className="relative rounded-[14.66px] "
            style={{ height: size.width * 0.27 }}
          >
            <div
              style={{ color: colorSchema.fontColor }}
              id="item-component-name"
              className={`  mt-3 self-start min-w-[55%] max-w-[120px] text-[14px] font-[600] leading-[17.65px] tracking-[-0.27 px] text-start ${
                lang == "ar"
                  ? "font-cairo  leading-[20px] mr-2"
                  : "font-raleway  leading-[17.65px]  ml-2 "
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
            <img
              className="absolute object-contain h-full w-full   "
              src={
                item?.images?.[0] != null ? item?.images?.[0]?.previewUrl : ""
              }
            />
          </div>
          <div className={`flex flex-col w-[100%] h-[50px] justify-between  `}>
            <div className=" flex justify-between">
              {/* <div
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
              </div> */}
              <div>
                {!inventory?.disableCheckout && (
                  <div
                    className={`${
                      lang == "ar" ? "font-cairo mr-2" : "font-raleway ml-2"
                    }  font-raleway font-[600] text-[14px] text-[#4F4F4F] mt-6 `}
                  >
                    {`${inventory.currency} ${inventory.price}`}
                    {inventory?.unit && (
                      <>
                        (<sup>/{inventory?.unit}</sup>)
                      </>
                    )}
                  </div>
                )}
              </div>

              <div
                className={`h-5 w-5  ${
                  lang == "ar" ? "ml-2 left-3 " : "mr-2 right-3 "
                } rounded-full  flex items-center justify-center  mt-3 absolute top-2  `}
              >
                {/* <div className="rounded-full bg-white flex items-center justify-center ">
                  {selected && (
                    // <div className="h-3 w-3 rounded-full bg-[#1B153D]" />
                    <img className="h-5 w-5" src="/tickIcon.png" />
                  )}
                </div> */}
              </div>

              {/* <div
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
              </div> */}
            </div>

            {/* <div className=" flex items-end justify-end relative bottom-1.5 mt-1  ">
              {item.inCart > 0 && (
                <div
                  style={{ backgroundColor: colorSchema.borderColor }}
                  className={` h-[26px] w-[26px] rounded-full  text-white text-[14px] flex items-center justify-center font-raleway  `}
                >
                  {item.inCart}
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestComponent;
