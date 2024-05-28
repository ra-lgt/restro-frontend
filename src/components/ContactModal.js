import React, { useState } from "react";
import getLang, { getLangServerSide, useLang } from "../../src/utils/locale";
import CountryModal from "./CountryModal";
import { countryCode } from "./../constant/countryCode";
import validation from "./../utils/validation";

const AlertModal = ({
  resources,
  handleCross,
  onsubmit,
  lang,
  setRtl,
  ...props
}) => {
  const [countryModal, setCountryModal] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countryobj, setcountryobj] = useState({
    dial_code: "+966",
    code: "SA",
  });

  const [countryCodeArr, setcountryCodeArr] = useState(countryCode);
  const [countryCodeSearch, setcountryCodeSearch] = useState("");

  const [state, setState] = useState({ email: "", number: "" });

  // const lang = useLang();

  let timer;

  //VALIDATION FUNCTION
  const [errors, setErrors] = useState({
    email: "",
    number: "",
  });

  const handleCountryCodeChange = (e) => {
    e.preventDefault();
    // console.log("input text ==>", e.target.value);
    setcountryCodeSearch(e.target.value);
    //clear time out if the user start typing befoe 1000
    clearTimeout(timer);
    timer = setTimeout(() => {
      const tempAr = [...countryCode];
      const filterArr = [];
      tempAr.forEach((item) => {
        //  console.log("forEach item===>", item.attributes);
        let tempName = item.name.toLowerCase();
        let tempCode = item.dial_code;
        if (
          String(item.name).includes(e.target.value) ||
          tempName.includes(e.target.value.toLowerCase()) ||
          tempCode.includes(e.target.value)
        ) {
          filterArr.push(item);
        }
      });
      // console.log("filter array ==>", filterArr);
      setcountryCodeArr(filterArr);
    }, 800);
  };

  //handle change function
  const handleChange = (
    propertyName,
    change,
    validate = {
      type: "",
      payload: "",
      required: false,
    }
  ) => {
    if (validate?.type?.length > 0) {
      setErrors({
        ...errors,
        [propertyName]: validation(change.target.value, validate),
      });
    }
    // TODO: we will use this type property later for validating if the input is correct
    setState({ ...state, [propertyName]: change.target.value });
  };
  // validate
  const validate = () => {
    const errorsChecked = {
      email: validation(state.email, { type: "email", required: true }),
      // number: validation(state.number, {
      //   type: "phone",
      //   required: false,
      // }),
    };
    setErrors(errorsChecked);
    let foundErrors =
      Object.values(errorsChecked)?.filter((item) => item !== "")?.length > 0
        ? true
        : false;
    // will return true if no errors
    return !foundErrors;
  };
  const handleClick = () => {
    if (validate()) {
      setIsButtonDisabled(true);
      onsubmit(
        state.email,
        state.number,
        countryobj.dial_code,
        countryobj.code
      );
    }
  };
  return (
    <>
      <div className=" justify-center items-center flex fixed inset-0 z-50">
        <div className="flex flex-col gap- bg-white p-4 rounded-xl mx-4">
          <div dir={setRtl} className="  flex  justify-between ">
            <p className="justify-center flex font-raleway font-[600] text-[17px]">
              {resources?.CONTACT_DETAIL}
            </p>

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

          <div
            dir={setRtl}
            className={`${
              lang == "ar" ? "lg:pr-14 mr-2  ml-2" : "lg:pl-10  "
            } flex w-full  mt-5  px-7  leading-[17.74px] tracking-[-0.32 px] `}
          >
            <div className=" ">
              <p
                style={{ color: "#1B153D" }}
                className={`${
                  lang == "ar" ? "font-cairo" : "font-raleway"
                } text-[16px]  font-[600]`}
              >
                {resources?.CONTACT_MODAL_EMAIL}
              </p>
              {/* <p
                className={`${
                  lang == "ar" ? "font-cairo mt-1" : "font-raleway"
                } text-[15px] text-[#BDBDBD] font-[500] `}
              >
                {resources?.TO_RECEIVE_NOTI}
              </p> */}
            </div>
          </div>

          <div className="flex justify-center items-center  w-full mt-2">
            <div className="w-[85%]  h-[54.15px] rounded-[12.59px] bg-[#FFFFFF] items-center justify-start flex shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)] ">
              <input
                id="email"
                autoComplete="email"
                // style={{ color: colorSchema.borderColor }}
                className={`bg-[#FFFFFF]  text-[17.63px] font-[500] ${
                  lang == "ar" ? "font-cairo" : "font-raleway"
                } ml-4 items-center outline-none w-[90%] leading-[20.7px]`}
                value={state.email}
                placeholder={resources?.EMAIL_ADDRESS}
                onChange={(e) =>
                  handleChange("email", e, {
                    type: "email",
                  })
                }
              />
            </div>
          </div>
          <div
            dir={setRtl}
            className="flex w-full items-center justify-center  "
          >
            <div className="w-[85%] flex items-start">
              <p className="text-red-500 font-raleway text-[15px] mt-1  ">
                {errors.email}
              </p>
            </div>
          </div>

          <div
            dir={setRtl}
            className={`${
              lang == "ar" ? "lg:pr-14 mr-2  ml-2" : "lg:pl-10  "
            }flex w-full  mt-5  px-7  leading-[17.74px] tracking-[-0.32 px] `}
          >
            <div className=" ">
              <p
                style={{ color: "#1B153D" }}
                className={`${
                  lang == "ar" ? "font-cairo" : "font-raleway"
                } text-[16px]  font-[600]`}
              >
                {resources?.CONTACT_MODAL_NUMBER}
              </p>
              {/* <p
                className={`${
                  lang == "ar" ? "font-cairo mt-1" : "font-raleway"
                } text-[15.11px] text-[#BDBDBD] font-[500] `}
              >
                {resources?.FOR_THE_DELIVERY}
              </p> */}
            </div>
          </div>
          <div className="flex justify-center items-center w-full mt-2 cursor-pointer ">
            <div className="w-[85%]  h-[54.15px] rounded-[12.59px] bg-[#FFFFFF] items-center justify-start flex shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)] ">
              <div
                onClick={() => setCountryModal(true)}
                className="flex justify-center ml-2"
              >
                <img
                  height={15}
                  width={30}
                  src={`/flags/${countryobj?.code.toLocaleLowerCase()}.png`}
                />
                <p className="font-raleway text-[17.63px] ml-2 ">
                  {countryobj?.dial_code}
                </p>
              </div>

              {countryModal == true ? (
                <CountryModal
                  showModal={true}
                  handleCross={() => {
                    setCountryModal(false);
                  }}
                  data={countryCodeArr}
                  handleOnclickCountry={(item) => {
                    setCountryModal(false);
                    setcountryobj(item);
                    setcountryCodeArr(countryCode);
                    setcountryCodeSearch("");
                    //console.log(item);
                  }}
                  searchValue={countryCodeSearch}
                  handleChange={handleCountryCodeChange}
                />
              ) : null}

              <input
                id="phone-number"
                autoComplete="tel"
                // style={{ color: colorSchema.borderColor }}
                placeholder={resources?.ENTER_PHONE_NO}
                className={`bg-[#FFFFFF]  text-[17.63px] font-[500] ${
                  lang == "ar" ? "font-cairo" : "font-raleway"
                } ml-4 items-center outline-none  leading-[20.7px]`}
                value={state.number}
                onChange={(e) =>
                  handleChange("number", e, {
                    type: "phone",
                    required: false,
                  })
                }
                type="text"
              />
            </div>
          </div>
          <div
            dir={setRtl}
            className="flex w-full items-center justify-center  "
          >
            <div className="w-[85%] flex items-start">
              <p
                className={`text-red-500 ${
                  lang == "ar" ? "font-cairo" : "font-raleway"
                } text-[15px] mt-1  `}
              >
                {errors.number}
              </p>
            </div>
          </div>
          <button
            className={`bg-[#98B7FF] p-4 rounded-[20px] text-[#1B153D] font-[700] w-[80%] m-auto mt-3 text-[16px] font-raleway ${
              isButtonDisabled ? "pointer-events-none" : ""
            }`}
            onClick={handleClick}
            disabled={isButtonDisabled}
          >
            {resources?.CONTACT_MODAL_SUBMIT}
          </button>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
    </>
  );
};

export default AlertModal;
