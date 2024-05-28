import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Fallback = () => {
  const router = useRouter();
  const store =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("store"))
      : { serviceID: "", products: [] };

  useEffect(() => {
    console.log("store", store);
  }, []);
  return (
    <>
      <Head>
        <title>No Internet</title>
      </Head>
      <style>
        {` body {
          display : flex;
        }`}
      </style>

      <div
        style={{
          backgroundColor: "white",
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "black",
        }}
      >
        <div
          style={{
            height: 100,
            width: 100,
            borderColor: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                backgroundColor: "black",
                height: 10,
                width: 10,
                borderRadius: 10,
                marginRight: 20,
              }}
            />
            <div
              style={{
                backgroundColor: "black",
                height: 10,
                width: 10,
                borderRadius: 10,
              }}
            />
          </div>

          <div
            style={{
              marginTop: 15,
              backgroundColor: "black",
              height: 7,
              width: 30,
            }}
          />
        </div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          No Internet
        </div>

        <div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            Looks like you are not connected to the network.
            <br /> Check your setting and try again.
          </div>
        </div>
        <a
          href={`/store/detail/be255013-6665-4fd7-a1db-9aac46457182?roomNo=25`}
          style={{
            backgroundColor: "black",
            color: "white",
            width: 100,
            height: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            marginTop: 20,
            cursor: "pointer",
          }}
        >
          Go Back
        </a>
      </div>
    </>
  );
};

export default Fallback;
