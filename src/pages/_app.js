import "../styles/globals.css";
import Router from "next/router";
import { useState, useEffect } from "react";
// context
import { AppContext } from "../context/appContext";
// import Head from "next/head";

function Loading() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => url !== Router.asPath && setLoading(true);
    const handleComplete = (url) => url === Router.asPath && setLoading(false);

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleComplete);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleComplete);
    };
  }, [Router.events]);

  return (
    loading && (
      <>
        <div className="absolute h-full w-full min-h-full rounded flex items-center justify-center ">
          <div className="block mb-4 fixed z-50">
            <LoaderIcon size={40} />
          </div>
        </div>
        <div className="opacity-25 h-full w-full fixed inset-0 z-40 bg-black"></div>
      </>
    )
  );
}

const LoaderIcon = ({ size }) => (
  <svg
    className="animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    height={size}
    width={size}
    fill="black"
  >
    <path d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z" />
  </svg>
);

function MyApp({ Component, pageProps }) {
  return (
    <AppContext>
      <>
        {/* <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0 user-scalable=no"
          />
        </Head> */}
        <Loading />
        <Component {...pageProps} />
      </>
    </AppContext>
  );
}

export default MyApp;
