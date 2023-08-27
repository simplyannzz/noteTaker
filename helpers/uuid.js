// Immediately export a function that generates a string of random numbers and letters
// helps generate a unique ID
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);