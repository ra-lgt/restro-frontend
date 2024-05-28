import React from "react";
import NavBar from "../NavBar";
import useWindowSize from "../../hooks/useWindowSize";
// next js
import Router, { useRouter } from "next/router";

const CityDetail = ({
  place,
  colorSchema,
  store,
  isRoomNumber,
  size,
  setDetailsModal,
}) => {
  const router = useRouter();
  // console.log("this is place ", place);
  const data = place?.description;
  // const pattern1='!\[.*[.png)]'

  // var placeholder_text=data.replaceAll(/!\[.*[.png)]/g," %s ")
  // var images_links=data.match(/!\[.*[.png)]/g)
  // const final_html = placeholder_text.replace(/%s/g, () => {
  //   return images_links.shift();
  // });
  // console.log('-------------------------')
  // console.log(final_html)

  const htmlText = data.replace(
    /!\[(.*?)\]\((.*?)\.png\)/g,
    '<img alt="$1" src="$2.png" class="py-4 rounded-[18px] font-raleway h-[40%] w-[40%] "/>'
  );

  //split
  //match

  //console.log("this is summary data ", data);
  // Regular expression pattern to match the text and image URLs
  // const pattern = /(.?)\n\n(!\[[^\]]\])\((.*?)\)/gs;

  // // Match the text and image URLs using the pattern
  // const matches = [...data.matchAll(pattern)];

  // // Extract the text and image URLs from the matches
  // const text = data.replace(/!\[(.?)\]\((.?)\)/g, "");
  // const images = [...data.matchAll(/!\[(.?)\]\((.?)\)/g)].map((match) => ({
  //   alt: match[1],
  //   url: match[2],
  // }));

  // console.log("THIS IS HTML TEXT", text);
  return (
    <>
      <div
        style={{
          backgroundColor: colorSchema?.backgroundColor
            ? colorSchema.backgroundColor
            : "#FCFCFF",
        }}
        className="flex flex-col items-center h-screen w-screen min-h-screen fixed inset-0  z-40 overflow-x-hidden  "
      >
        <NavBar
          leftIconVissible={true}
          leftIcon="back"
          hotelLogo={store?.logo !== null ? store?.logo?.previewUrl : ""}
          rightIcon="roomNo"
          roomNo={router.query.roomNo}
          handleBackBtn={() => {
            setDetailsModal(false);
          }}
        />
        <div className="flex flex-col items-center">
          <div
            style={{
              height: size.width * 0.35,
              borderRadius: "1rem",
            }}
            className="relative object-contain rounded-[14.66px] w-[85%] max-w-[650px] mt-20"
          >
            <img
              alt="city"
              className="absolute h-full w-full object-cover rounded-[14.66px]  "
              src={place?.logo?.previewUrl}
            />
          </div>
          <div className="mt-4 items-center w-[85%] font-raleway max-w-[650px] text-[#333333] font-[700] text-[16.76px]">
            {place?.name}
          </div>

          {/* <div className="mt-2 items-center w-[85%] font-raleway max-w-[650px] text-[#333333] font-[500] text-[14px]">
            {text}
          </div> */}
          <div className="mt-2 items-center w-[85%] font-raleway max-w-[650px] text-[#333333] font-[500] text-[14px]">
            <div dangerouslySetInnerHTML={{ __html: htmlText }}></div>
          </div>

          {/* <div className=" flex flex-wrap justify-around mt-[15px] px-4 w-full ">
            {images.map((image, index) => (
              <img
                className="w-[150px] h-[120px] rounded-lg mt-2 "
                key={index}
                src={image.url}
                alt={image.alt}
              />
            ))}
          </div> */}

          <div className="mt-4 items-center w-[85%] font-raleway max-w-[650px] text-[#333333] font-[500] text-[14px] mb-5">
            {place?.summary}
          </div>
        </div>
      </div>
    </>
  );
};

export default CityDetail;
