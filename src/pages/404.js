import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const NotFoundPage = () => {
  const [isRoomNumber, setRoomNumber] = useState();
  let router = useRouter();

  const store =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("store"))
      : { serviceID: "", products: [] };

  // get roomnumber from localstorage
  useEffect(() => {
    const roomNumber = localStorage.getItem("RoomNumber");
    if (roomNumber) {
      setRoomNumber(roomNumber);
    }
  }, []);
  return (
    <>
      <div className="flex flex-col h-screen w-screen items-center ">
        <div className="flex w-screen justify-center items-center mt-[100px] ">
          <img src="/sad-face.png" className="h-[80px] w-[80px]" />
        </div>
        <div className="items-center justify-center flex font-raleway font-[700] text-[35px] mt-2">
          404
        </div>
        <div className="items-center justify-center flex font-raleway text-[25px] mt-5">
          Page not found !
        </div>
        <div className="items-center justify-center text-center mx-10 flex font-raleway text-[20px] mt-5 leading-8">
          <p>We are sorry, we could not find the page you requested.</p>
        </div>
        <div className="items-center justify-center text-center mx-10 flex font-raleway text-[15px] ">
          <p>You can either use these options</p>
        </div>
        <div className="cursor-pointer bg-[#98B7FF] h-[40px] w-[100px] text-white items-center justify-center flex mt-[20px] rounded-md shadow">
          <div
            onClick={() =>
              router.push({
                pathname: `/store/detail/${store.uuid}`,
                query: {
                  roomNo: isRoomNumber,
                },
              })
            }
            className="font-medium"
          >
            Go Home
          </div>
        </div>
        <div className="cursor-pointer bg-white h-[40px] w-[100px]  items-center justify-center flex mt-[20px] rounded-md shadow">
          <div onClick={() => router.back()} className="font-medium">
            Go back
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
