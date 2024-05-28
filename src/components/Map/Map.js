import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import getLang, { getLangServerSide, useLang } from "../../../src/utils/locale";
import { useRouter } from "next/router";
import axios from "axios";

function Map({
  position = {
    lat: 0.0,
    lng: 0.0,
  },
  containerStyle,
  BranchName,
  addressData,
  distanceTest,
  lang,
  setRtl,
  ...props
}) {
  // const lang = useLang();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_KEY,
    googleMapsApiKey: `AIzaSyB9vWPTo6O2OO-hMEhEqoSfQJcQRUeRwGk`,
  });

  const router = useRouter();
  const [address, setAddress] = React.useState("");

  React.useEffect(() => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&key=AIzaSyB9vWPTo6O2OO-hMEhEqoSfQJcQRUeRwGk`;
    axios.get(geocodeUrl).then((response) => {
      if (response.data.status === "OK") {
        setAddress(response.data.results[0].formatted_address);
      }
    });
  }, [position]);

  // const handleMapClick = () => {
  //   const url = `https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`;
  //   router.push(url);
  // };

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = () => {
    const { lat, lng } = position;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="max-w-[650px] h-[78px] bg-white rounded-[14.66px] items-center  justify-evenly flex cursor-pointer shadow-[0_20px_36px_0px_rgba(23,20,57,0.04)]"
      onClick={handleMapClick}
    >
      {/* <div
        className={`flex items-center ml-2  ${
          lang == "ar"
            ? "font-cairo text-[15px]"
            : "font-raleway text-[13px] "
        }  font-bold text-[13px] w-[20%] justify-center`}
      >
        {BranchName}
      </div> */}
      <div className="flex flex-col  justify-center w-[70%] ml-4  ">
        <div
          className={`flex items-center   ${
            lang == "ar"
              ? "font-cairo text-[15px]"
              : "font-raleway text-[13px] "
          }  font-bold text-[12px]  `}
        >
          {BranchName}
        </div>
        <div
          className={` ${
            lang == "ar"
              ? "font-cairo text-[11px]"
              : "font-raleway text-[11px] "
          }  font-medium line-clamp-3`}
        >
          {addressData}
        </div>
        <div
          className={` ${
            lang == "ar"
              ? "font-cairo  text-[13px]"
              : "font-raleway  text-[12px] "
          }   font-bold`}
        >
          {distanceTest} KM
        </div>
      </div>
      <div className="w-32 h-32 flex items-center justify-end">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{
              width: "80%",
              height: "61%",
            }}
            center={position}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              zoomControl: false,
              fullscreenControl: false,
            }}
          >
            <Marker
              position={position}
              draggable={false}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new window.google.maps.Size(25, 25),
              }}
            />
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default React.memo(Map);
