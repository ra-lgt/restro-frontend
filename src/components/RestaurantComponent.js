import React from "react";
import Image from "next/image";
import Rating from "./Rating";

// props details
// item => name,image,bannerImage,info,deliveryTime,rating
// className => more specification for the container such as container width default is 96%
// onClick => handling onClick event

const RestaurantComponent = ({ item, className, onClick }) => {
  return (
    <button className={`${className} `} onClick={onClick}>
      <div
        className={`flex  flex-col  h-[215px] rounded-[14.66px] bg-white px-2 py-2 pb-5 text-black shadow `}
      >
        {/*banner and profile*/}
        <div
          className={`w-full h-[120px]  rounded-[14.66px] bg-slate-400 flex items-end px-[15px]`}
          style={{
            backgroundImage: `url(${item.bannerImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100%",
            backgroundPosition: "center",
          }}
        >
          <img className="h-[79px] w-[79px]" alt="Profile" src={item.image} />
        </div>
        {/*Other info*/}

        <div className="flex mt-2 self-start items-center justify-between w-[100%] text-start font-raleway text-[16.76px] pr-[25px] font-[500]">
          {item.name}
          <div className="text-[12px] text-[#828282] flex items-center">
            {item.rating}
            <Rating value={item.rating} size={10} className={`ml-[10px]`} />
          </div>
        </div>
        <p className="text-[10px] text-[#828282]  self-start text-start font-raleway leading-[14.75px] tracking-[-0.25px]">
          {item.info}
        </p>
        <p className="mt-[10px] text-[13px] text-[#828282]  self-start text-start font-raleway leading-[14.75px] tracking-[-0.25px]">
          {item.deliveryTime}
        </p>
      </div>
    </button>
  );
};

export default RestaurantComponent;
