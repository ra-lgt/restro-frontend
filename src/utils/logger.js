const color = {
  ERROR: "\x1b[31m",
  LOG: "\x1b[32m",
  WARN: "\x1b[33m",
  white: "\x1b[37m",
  reset: "\x1b[0m",
};

const printLog = (type, ...data) => {
  if (process?.env?.NODE_ENV === "production") return;
  console.log(`${color[type]} 👉 [${type}]${color.reset}`, ...data);
};
const logger = {
  log: (...data) => {
    printLog("LOG", ...data);
  },
  error: (...data) => {
    printLog("ERROR", ...data);
  },
  warn: (...data) => {
    printLog("WARN", ...data);
  },
};

export default logger;

// copy "👉" and place it in browser filter
