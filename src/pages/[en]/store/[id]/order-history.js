import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";

import OderHistoryComponent from "../../../../components/OderHistoryComponent";
import NavBar from "../../../../components/NavBar";
import { StoreContext } from "../../../../context/appContext";

// next js
import Router, { useRouter } from "next/router";

// third party
import axios from "../../../../utils/axios";
import endpoints from "../../../../constant/endPoints";
import { handleChangeResObj } from "../../../../utils/utilFunctions";
import getLang, { getLangServerSide, useLang } from "../../../../utils/locale";

const Index = ({ storeID, roomNo, ...props }) => {
  const [items, setItems] = useState([]);
  const [colorSchema, setColorSchema] = useState();
  const [colorLoaded, setColorLoaded] = useState(false);
  const [isRoomNumber, setRoomNumber] = useState(null);
  const [store, updateStore] = useContext(StoreContext);
  const [hideRoom, setHideRoom] = useState();

  const router = useRouter();
  // const lang = useLang();
  const lang = props.lang;
  const setRtl = props.setRtl;

  // console.log("THIS IS LANG VALUE FROM ORDER HISTory PAGE", lang);
  // console.log("THIS IS setRTl VALUE FROM ORDER HISTory PAGE", setRtl);

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
  }, []);

  useEffect(() => {
    const orderHistory = JSON.parse(
      localStorage.getItem("OrderHistoryByStore")
    );
    if (orderHistory && store?.uuid) {
      if (orderHistory?.[store?.uuid]) {
        setItems(orderHistory?.[store?.uuid]);
      }
    }
  }, [store]);

  const getHideRoom = () => {
    const localRoom = localStorage.getItem("hideRoom");
    // console.log("THIS IS ORDER HISTORY HIDE VALUE", localRoom);
    setHideRoom(localRoom === "true");
  };

  return (
    <>
      <Head>
        <title>{store?.name}</title>

        <meta
          property="og:image"
          content={store?.logo != null ? store?.logo?.previewUrl : ""}
        />
        <meta name="description" content={"Order-History Page"} />
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
                  pathname: `/${lang}/store/detail/${store.uuid}`,
                  query: {
                    roomNo: roomNo,
                    hideRefCodeFromUser: hideRoom,
                  },
                });
              } else {
                router.replace({
                  pathname: `/${lang}/store/detail/${store.uuid}`,
                  query: {
                    roomNo: roomNo,
                  },
                });
              }
            }}
          />

          <OderHistoryComponent
            lang={lang}
            setRtl={setRtl}
            data={items}
            setData={setItems}
            colorSchema={colorSchema}
            resources={props.resources}
          />
        </div>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  let lang = getLangServerSide(context).locale;
  let setRtl = getLangServerSide(context).rtl;

  // console.log("THIS IS LANG FROM ORDER HISTORY", lang);
  // console.log("THIS IS rtl FROM ORDER HISTORY", setRtl);
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
      lang,
      setRtl,
    },
  };
}
export default Index;
