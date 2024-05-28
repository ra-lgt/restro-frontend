import React from "react";
import Image from "next/image";

// props details

// item =>
//    {name,
//    price ,
//    image => use svg from the laundryIcons,
//    info
// className => more specification for the container such as container width default is 96%
// onClick => handling onClick event

const CarRentalComponent = ({ item, className, onClick }) => {
  return (
    <button className={`${className}`} onClick={onClick}>
      <div
        className={`flex  flex-col  h-[100%] rounded-[15.7458px] shadow bg-white px-2 py-2 pb-[25px] text-[15px] tracking-[-0.269929px] leading-[18px]`}
      >
        <Image
          alt="CarImage"
          className="w-full  rounded-[15.7458px]"
          width={"100%"}
          height={120}
          blurDataURL
          placeholder="blur"
          src={item.image}
        />
        {/*Title and price*/}
        <div className={`flex w-[100%]`}>
          <div className="mt-2 self-start w-[80%] text-[16.76px] text-start font-raleway text-[#333333] font-semibold">
            {item.name}
          </div>
          <div className="flex flex-col mt-2 items-end justify-between w-[20%] font-raleway text-[#4F4F4F] h-[100%] pb-2">
            <div>
              ${item.price}
              <sup>/day</sup>
            </div>
          </div>
        </div>
        <p className="text-[12.57px] text-[#828282]  self-start text-start font-raleway leading-[14.75px] tracking-[-0.25px] w-[95%]">
          {item.info}
        </p>
      </div>
    </button>
  );
};

export default CarRentalComponent;
