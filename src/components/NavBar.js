import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { maxWidth } from "../hooks/useWindowSize";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";

//Props Details
//item => hotelLogo, leftIcon , roomNo

const NavBar = ({
  leftIcon = "more",
  roomNo,
  rightIcon = "roomNo",
  hotelLogo,
  className,
  itemInCart = "0",
  handleBackBtn,
  leftIconVissible,
  handleCartClick,
  resource,
  lang,
  setRtl,
  ...props
}) => {
  const router = useRouter();
  const [isRoomNumber, setRoomNumber] = useState();
  const [hideRoom, setHideRoom] = useState();

  useEffect(() => {
    getHideRoom();
  }, []);
  const store =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("store"))
      : { serviceID: "", products: [] };

  //GETTING COLOR
  const colorSchema = {
    backgroundColor: store?.backgroundColor ? store.backgroundColor : "#FCFCFF",
    fontColor: store?.fontColor ? store.fontColor : "#4F4F4F",
    borderColor: store?.borderColor ? store.borderColor : "#1B153D",
  };

  // getting RoomNumber from local storage
  const getRoom = () => {
    if (typeof window !== "undefined") {
      const usrRoom = localStorage.getItem("RoomNumber");
      // console.log("getUsrData ===>", usrData);
      return usrRoom ? usrRoom : null;
    }
    return {};
  };
  const usrRoom = useState(getRoom)[0];
  // console.log("NaveBar=============>>>>", usrRoom);
  const getHideRoom = () => {
    const localRoom = localStorage.getItem("hideRoom");
    setHideRoom(localRoom === "true");
  };
  // console.log(hideRoom);
  return (
    <div
      dir={setRtl}
      style={{
        backgroundColor: colorSchema.backgroundColor,
        maxWidth: maxWidth,
      }}
      className={` h-[70px] w-[100%] flex items-center px-[30px] justify-between fixed z-10 self-auto cursor-pointer `}
    >
      {leftIconVissible ? (
        <div className="self-auto w-20 flex  ">
          <img
            className={`w-[25px] h-[${leftIcon == "back" ? 20 : 20}] ${
              lang == "ar" ? "rotate-180" : ""
            }`}
            alt="leftIcon"
            src={leftIcon == "back" ? "/back.png" : "/more.png"}
            onClick={handleBackBtn}
          />
        </div>
      ) : (
        <div className="self-auto w-20 flex "></div>
      )}
      <div
        id="logo"
        onClick={() => {
          const query = {
            roomNo: router.query.roomNo,
          };
          if (hideRoom) {
            query.hideRefCodeFromUser = false;
            router.push({
              pathname: `/${lang}/store/detail/${store.uuid}`,
              query: {
                roomNo: usrRoom,
                hideRefCodeFromUser: hideRoom,
              },
            });
          } else {
            router.push({
              pathname: `/${lang}/store/detail/${store.uuid}`,
              query: {
                roomNo: usrRoom,
              },
            });
          }
        }}
      >
        <img className="h-[50px] object-contain" src={hotelLogo} />
      </div>

      {rightIcon == "roomNo" ? (
        <div id="room-no" className="justify-end w-20 flex ">
          {roomNo && hideRoom === false ? (
            <div className="flex flex-col justify-center items-center leading-[14px] tracking-[-0.24px] font-[700]">
              <p
                className={`${
                  lang == "ar" ? "font-cairo" : "font-raleway"
                } text-[16px text-[${colorSchema.borderColor}]  text-center`}
              >
                {lang == "ar" ? "غرفة" : "room"}
              </p>
              <p
                className={`text-[16px] font-[700] text-[${
                  colorSchema.borderColor
                }] ${lang == "ar" ? "font-cairo mt-1" : "font-raleway"}`}
              >
                <b> {roomNo}</b>
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : rightIcon == "cart" ? (
        <div className="w-20 flex justify-end" onClick={handleCartClick}>
          <img src="/cart.svg" />

          {itemInCart > 0 ? (
            <div
              className={`rounded-full bg-[#EB5757] w-[20px] h-[20px] flex items-center justify-center absolute ${
                lang == "ar" ? "left-6" : "right-6"
              }  top-3.5 `}
            >
              <p
                className={`font-raleway font-[14px] text-[14px] text-[#FCFCFF] font-[700] leading-[19.03px] text-center `}
              >
                {itemInCart}
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="w-20"></div>
      )}
    </div>
  );
};

export default NavBar;
