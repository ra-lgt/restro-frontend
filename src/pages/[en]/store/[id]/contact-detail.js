import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import NavBar from "../../../../components/NavBar";
import { StoreContext } from "../../../../context/appContext";

// next js
import Router, { useRouter } from "next/router";

// third party
import axios from "../../../../utils/axios";
import endpoints from "../../../../constant/endPoints";
import { handleChangeResObj } from "../../../../utils/utilFunctions";
import CountryModal from "../../../../components/CountryModal";
import { countryCode } from "../../../../constant/countryCode";
import validation from "../../../../utils/validation";
import getLang, { getLangServerSide, useLang } from "../../../../utils/locale";

const Index = ({ storeID, roomNo, resources, ...props }) => {
  const [items, setItems] = useState([]);
  const [colorSchema, setColorSchema] = useState();
  const [colorLoaded, setColorLoaded] = useState(false);
  const [isRoomNumber, setRoomNumber] = useState(null);
  const [store, updateStore] = useContext(StoreContext);
  const [hideRoom, setHideRoom] = useState();
  const [countryModal, setCountryModal] = useState(false);
  const [countryobj, setcountryobj] = useState({
    dial_code: "+966",
    code: "SA",
  });
  const [countryCodeArr, setcountryCodeArr] = useState(countryCode);
  const [countryCodeSearch, setcountryCodeSearch] = useState("");
  const [state, setState] = useState({ email: "", number: "" });

  const router = useRouter();
  const lang = useLang();
  //VALIDATION FUNCTION
  const [errors, setErrors] = useState({
    email: "",
    number: "",
  });
  let timer;
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

  useEffect(() => {
    getHideRoom();
    const roomNumber = localStorage.getItem("RoomNumber");
    if (!roomNumber) {
      localStorage.setItem("RoomNumber", router.query.roomNo);
    }
    setRoomNumber(roomNo);
    setColorSchema({
      backgroundColor: store?.backgroundColor
        ? store.backgroundColor
        : "#FCFCFF",
      fontColor: store?.fontColor ? store.fontColor : "#4F4F4F",
      borderColor: store?.borderColor ? store.borderColor : "#1B153D",
    });
    setColorLoaded(true);

    let getLocalStore = localStorage.getItem("store");

    if (!getLocalStore) {
      axios
        .get(`${endpoints.GET_STORE_BY_ID}/${storeID}`)
        .then((res) => {
          console;
          updateStore(res.data.data);
        })
        .catch((er) => {
          // console.log(er);
        });
    }
    //Setting Number and email if exist in localStorage
    const contactDetailString = localStorage.getItem("contactDetail");
    if (contactDetailString) {
      const contactDetail = JSON.parse(contactDetailString);
      setState({
        email: contactDetail?.clientEmail || "",
        number: contactDetail?.cellNumber || "",
      });
      setcountryobj({
        dial_code: contactDetail?.countryCode || "+966",
        code: contactDetail?.countryName || "SA",
      });
    }
  }, []);

  const getHideRoom = () => {
    const localRoom = localStorage.getItem("hideRoom");
    // console.log("THIS IS ORDER HISTORY HIDE VALUE", localRoom);
    setHideRoom(localRoom === "true");
  };

  const handleSubmit = () => {
    const contactDetailString = localStorage.getItem("contactDetail");

    let contactDetail = {
      countryCode: countryobj.dial_code,
      cellNumber: state.number,
      clientEmail: state.email,
      countryName: countryobj.code,
    };
    contactDetailString = JSON.stringify(contactDetail);
    localStorage.setItem("contactDetail", contactDetailString);

    router.back();
  };

  return (
    <>
      <Head>
        <title>{store?.name}</title>

        <meta
          property="og:image"
          content={store?.logo != null ? store?.logo?.previewUrl : ""}
        />
        <meta name="description" content={"Contact-detail Page"} />
        <meta property="og:title" content={store?.name} />
      </Head>
      {colorLoaded && (
        <div
          style={{ backgroundColor: colorSchema.backgroundColor }}
          className="w-screen h-screen flex flex-col items-center "
        >
          <NavBar
            leftIconVissible={true}
            leftIcon="back"
            hotelLogo={store?.logo !== null ? store?.logo?.previewUrl : ""}
            rightIcon="roomNo"
            roomNo={router.query.roomNo}
            handleBackBtn={() => {
              const query = {
                roomNo: router.query.roomNo,
              };
              if (hideRoom) {
                query.hideRefCodeFromUser = false;
                router.replace({
                  pathname: `/${lang.locale}/store/detail/${store.uuid}`,
                  query: {
                    roomNo: roomNo,
                    hideRefCodeFromUser: hideRoom,
                  },
                });
              } else {
                router.replace({
                  pathname: `/${lang.locale}/store/detail/${store.uuid}`,
                  query: {
                    roomNo: roomNo,
                  },
                });
              }
            }}
          />

          {/* CONTACT FORM */}
          <div
            dir={lang.rtl}
            className={`${
              lang.locale == "ar" ? "lg:pr-14 mr-2  ml-2" : "lg:pl-14  "
            }flex w-full  max-w-[650px]  px-7  leading-[17.74px] tracking-[-0.32 px] mt-24 `}
          >
            <div className=" ">
              <p
                style={{ color: "#1B153D" }}
                className={`${
                  lang.locale == "ar" ? "font-cairo" : "font-raleway"
                } text-[15.11px]  font-[600]`}
              >
                {resources?.PHONE_NUMBER_INCLUDING}
              </p>
              <p
                className={`${
                  lang.locale == "ar" ? "font-cairo mt-1" : "font-raleway"
                } text-[15.11px] text-[#BDBDBD] font-[500] `}
              >
                {resources?.FOR_THE_DELIVERY}
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center w-full mt-2 cursor-pointer  max-w-[650px]">
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
                style={{ color: colorSchema.borderColor }}
                placeholder={resources?.ENTER_PHONE_NO}
                className={`bg-[#FFFFFF]  text-[17.63px] font-[500] ${
                  lang.locale == "ar" ? "font-cairo" : "font-raleway"
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
            dir={lang.rtl}
            className="flex w-full items-center justify-center  "
          >
            <div className="w-[85%] flex items-start  max-w-[550px]">
              <p
                className={`text-red-500 ${
                  lang.locale == "ar" ? "font-cairo" : "font-raleway"
                } text-[15px] mt-1  `}
              >
                {errors.number}
              </p>
            </div>
          </div>
          <div
            dir={lang.rtl}
            className={`${
              lang.locale == "ar" ? "lg:pr-14 mr-2  ml-2" : "lg:pl-14  "
            } flex w-full  mt-5  px-7  leading-[17.74px] tracking-[-0.32 px]  max-w-[650px]`}
          >
            <div className=" ">
              <p
                style={{ color: "#1B153D" }}
                className={`${
                  lang.locale == "ar" ? "font-cairo" : "font-raleway"
                } text-[15px]  font-[600]`}
              >
                {resources?.EMAIL_ADDRESS}
              </p>
              <p
                className={`${
                  lang.locale == "ar" ? "font-cairo mt-1" : "font-raleway"
                } text-[15px] text-[#BDBDBD] font-[500] `}
              >
                {resources?.TO_RECEIVE_NOTI}
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center  w-full mt-2  max-w-[650px]">
            <div className="w-[85%]  h-[54.15px] rounded-[12.59px] bg-[#FFFFFF] items-center justify-start flex shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)] ">
              <input
                id="email"
                autoComplete="email"
                style={{ color: colorSchema.borderColor }}
                className={`bg-[#FFFFFF]  text-[17.63px] font-[500] ${
                  lang.locale == "ar" ? "font-cairo" : "font-raleway"
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
            dir={lang.rtl}
            className="flex w-full items-center justify-center  "
          >
            <div className="w-[85%] flex items-start  max-w-[550px]">
              <p className="text-red-500 font-raleway text-[15px] mt-1  ">
                {errors.email}
              </p>
            </div>
          </div>

          {/* Button */}
          <div className="flex items-center justify-center w-full  mt-10 cursor-pointer">
            <div
              style={{ outline: "none" }}
              id="confirm-order-button"
              className="w-[310px]  h-[59px] rounded-[20px] bg-[#98B7FF] flex justify-center items-center shadow-md  cursor-pointer"
              onClick={() => {
                if (validate()) {
                  handleSubmit();
                }
              }}
            >
              <p
                className={`${
                  lang.locale == "ar" ? "font-cairo" : "font-raleway"
                } text-[16px] font-[600] cursor-pointer `}
              >
                {resources?.SAVE}
              </p>
            </div>
          </div>

          {/* end div main */}
        </div>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  let lang = getLangServerSide(context).locale;
  // var declaeration

  let getResourceAPI = {};
  let isAPIFiled = false;
  try {
    let resourceAPI = await axios.get(
      `${endpoints.GET_RESOURCES}/locale/${lang}`
    );

    if (resourceAPI.status == 200) {
      getResourceAPI = handleChangeResObj(resourceAPI.data);
    }

    // console.log("Resources ====>", getResourceAPI);
  } catch (err) {
    isAPIFiled = true;
  }

  // console.log(context.query.storeID);
  return {
    props: {
      resources: getResourceAPI,
      isAPIFiled: isAPIFiled,
      storeID: context.params.id,
      roomNo: context.query.roomNo,
    },
  };
}
export default Index;
