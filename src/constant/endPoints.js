const _Environments = {
  development: {
    BASE_URL: `http://localhost:1337/admin`,
    GET_STORE_BY_ID: `/api/store/detail`,
    GET_RESOURCES: `/api/resources/list`,
    PAYMENT: "/api/payment-methods",
    GET_ODER_STATUS: "/api/order-statuses",
    ORDER: "/api/store/order",
    PLACES: "/api/places",
    WALLETPASS : "/api/store/detail"
  },
};

function getEnvironment() {
  const platform = "development";
  return _Environments[platform];
}

const Environment = getEnvironment();
export default Environment;
