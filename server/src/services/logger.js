const error = (fileName, methodName, error) => {
  console.error(`ERROR: ${fileName} | ${methodName} | ${error.message}`);
};

const warn = (fileName, methodName, warningMessage) => {
  console.warn(`WARNING: ${fileName} | ${methodName} | ${warningMessage}`);
};

const info = (fileName, methodName, infoMessage) => {
  console.info(`INFO: ${fileName} | ${methodName} | ${infoMessage}`);
};

module.exports = {
  error,
  warn,
  info,
};
