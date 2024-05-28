import React, { useState } from "react";

// conext
export const StoreContext = React.createContext();
export const CartContext = React.createContext();

export const AppContext = ({ children }) => {
  const getInitialStoreState = () => {
    if (typeof window !== "undefined") {
      const store = localStorage.getItem("store");
      // console.log('Store From Context API ===>',JSON.parse(store))
      return store ? JSON.parse(store) : {};
    }
    return {};
  };

  //state
  const [store, setstore] = useState(getInitialStoreState);
  const [cartItems, setCartItems] = useState({ serviceID: "", products: [] });

  /************* logic *******************/

  // update store data in context
  const handleUpdateStore = (store) => {
    localStorage.setItem("store", JSON.stringify(store));
    setstore(store);
  };

  const handleCartItemUpdate = (newCartObj) => {
    if (newCartObj?.products?.length > 0) {
      localStorage.setItem("cart", JSON.stringify(newCartObj));
    } else {
      localStorage.removeItem("cart");
    }

    setCartItems(newCartObj);
  };

  return (
    <StoreContext.Provider value={[store, handleUpdateStore]}>
      <CartContext.Provider value={[cartItems, handleCartItemUpdate]}>
        {children}
      </CartContext.Provider>
    </StoreContext.Provider>
  );
};
