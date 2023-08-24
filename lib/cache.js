const NodeCache = require("node-cache");

// https://stackoverflow.com/questions/52752396/how-to-synchronize-cache-object-between-multiple-files-in-node
const cache = (function () { 
  this.storage = new NodeCache();
  return this; 
})();

module.exports = {
  cache,
}