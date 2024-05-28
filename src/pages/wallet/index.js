import React, { useEffect, useState } from "react";
import AlertModal from "../../components/AlertModal";
import MessageModal from "../../components/MessageModal";
import endPoint from "../../constant/endPoints"
import axios from "../../utils/axios";

export default function Wallet({ }) {

const [messageModal, setMessageModal] = useState({
    isOpen: false,
    headingTxt: "",
    alertMessage: "",
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window?.location?.search);
    const orderNumber = urlParams.get("orderNumber");
    const storeUuid = urlParams.get("storeUuid");
    const userAgent = window?.navigator?.userAgent;
    const walletType = urlParams.get('walletType');
    if(orderNumber && storeUuid){
      const deviceType = /iPad|iPhone|iPod|Mac/.test(userAgent) ? "apple" : "other";
      if(deviceType == "apple" && walletType == "android"){
        setMessageModal({
            isOpen: true,
            headingTxt: "Alert",
            alertMessage: "Please use apple wallet for ios devices",
          });
        return
      }else if(deviceType == "other" && walletType == "ios"){
        setMessageModal({
            isOpen: true,
            headingTxt: "Alert",
            alertMessage: "Please use google wallet for android devices",
          });
        return
      }
      getWalletPass(orderNumber, storeUuid, deviceType)
    }

    }
    
   
  }, []);

  const getWalletPass = async (orderNumber, storeUuid, deviceType) => {
    if(deviceType == "apple"){
        try {
            const response = await axios.get(`${endPoint.WALLETPASS}/${storeUuid}/orders/wallet-pass/${orderNumber}?deviceType=${deviceType}`, {
              responseType: 'arraybuffer', // Set the response type to blob to get binary data
            });
            const filename = `${orderNumber}.pkpass`;
            const blob = new Blob([response.data], { type: "application/vnd.apple.pkpass" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
          } catch (error) {
              setMessageModal({
                isOpen: true,
                headingTxt: "Error",
                alertMessage: "Something went wrong",
              })
            
          }
    }else{
        try {
            const response = await axios.get(`${endPoint.WALLETPASS}/${storeUuid}/orders/wallet-pass/${orderNumber}?deviceType=${deviceType}`,);
            window.open(response.data)
          } catch (error) {
            setMessageModal({
              isOpen: true,
              headingTxt: "Error",
              alertMessage: "Something went wrong",
            })
          
          }
          
    }
  }



  return (
    <>
      {/* <h1 id="heading" >hello world</h1> */}
      <MessageModal
            showModal={messageModal.isOpen}
            headingTxt={messageModal.headingTxt}
            alertMessage={messageModal.alertMessage}
            resource={{
            AGREE : "OK"
            }}
            handleUserChoice={() => {
              // closing modal
              setMessageModal({
                isOpen: false,
                headingTxt: "",
                alertMessage: "",
              });
            }}
          />
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      data: null,
    },
  };
};
