const DEFAULT_SLEEP_INTERVAL = 3000; // default sleep interval of 3 seconds

const sleep = (ms) => {
  let sleepInterval = ms || DEFAULT_SLEEP_INTERVAL;
  return new Promise(resolve => setTimeout(resolve, sleepInterval));
}

const hasKeys = (object) => {
  return Object.keys(object).length > 0
}

const isNullOrEmpty = (str) => {
  return str === undefined
    || str === null
    || str === ""
}

const isNullOrEmptyObj = (obj) => {
  return obj === undefined
    || obj === null
    || typeof(obj) !== 'object' // a non-object (e.g. string) can be considered a null object
    || !(typeof(obj) === 'object' && hasKeys(obj))
}

const isNullOrEmptyArray = (obj) => {
  return obj === undefined
    || obj === null
    || !Array.isArray(obj) // a non-array can be considered a null array
    || !(Array.isArray(obj) && obj.length > 0)
}

module.exports = {
  hasKeys,
  isNullOrEmpty,
  isNullOrEmptyObj,
  isNullOrEmptyArray,
  sleep,
}