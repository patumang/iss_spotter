/* const { fetchMyIP } = require('./iss'); */
/* const { fetchCoordsByIP } = require('./iss'); */
const { fetchISSFlyOverTimes } = require('./iss');

/* fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned IP:', ip);
}); */

/* fetchCoordsByIP("37.19.212.10", (error, coordinates) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned coordinates:', coordinates);
}); */

fetchISSFlyOverTimes(
  { latitude: '43.6227', longitude: '-79.3892' },
  (error, passTimes) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    console.log('It worked! Returned flyover times:', passTimes);
  }
);