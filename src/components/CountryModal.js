import React, { useState, useContext, useEffect } from "react";

const CountryModal = ({
  showModal,
  data,
  handleOnclickCountry,
  handleCross,
  searchValue,
  handleChange,
}) => {
  return (
    <>
      {showModal == true ? (
        <>
          <div className=" justify-center items-center flex fixed inset-0 z-40">
            <div
              id="alert-modal"
              className=" bg-white w-[85%] h-[50%] rounded-xl max-w-[580px] flex flex-col items-start justify-start overflow-y-auto  "
            >
              <div className="flex fixed items-center justify-between bg-white w-[84.5%] max-w-[580px] p-3 rounded-tl-xl rounded-tr-xl ">
                <div>
                  <input
                    className={`bg-white text-[14.63px] flex font-[500] font-raleway outline-none  `}
                    placeholder="Search country"
                    value={searchValue}
                    onChange={handleChange}
                  />
                </div>
                <button
                  onClick={handleCross}
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="flex items-center justify-center w-[25px] h-[25px] opacity-[0.8]  bg-[#D9D9D9]  rounded-md   shadow hover:bg-[#D9D9D9] hover:shadow focus:bg-[#F2F2F2] focus:shadow focus:outline-none focus:ring-0 active:bg-[#F2F2F2] active:shadow-lg transition duration-150 ease-in-out cursor-pointer"
                >
                  <img
                    alt="close button"
                    src="/close.svg"
                    className="h-[13px] w-[13px] "
                  />
                </button>
              </div>

              {data.length > 0 ? (
                <div className="bg-white mt-12  w-[100%]">
                  {data.map((item, ind) => (
                    <div
                      key={ind}
                      className={
                        "flex p-2  hover:bg-gray-200 bg-white overflow-auto cursor-pointer "
                      }
                      onClick={() => handleOnclickCountry(item)}
                    >
                      <img
                        width={25}
                        height={15}
                        src={`/flags/${item.code.toLocaleLowerCase()}.png`}
                        alt="Flag"
                      />
                      <p className="pl-2 font-raleway text-[14px]">
                        {item.name}
                      </p>
                      <p className="pl-1 font-raleway">({item.dial_code})</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white w-[100%] flex items-center mt-20 text-center justify-center font-raleway">
                  Country not found
                </div>
              )}
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default CountryModal;
