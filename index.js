const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  fetchCoordsByIP(ip, (error, coordinates) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }

      nextISSTimesForMyLocation(passTimes, (error, passTimes) => {
        if (error) {
          return console.log("It didn't work!", error);
        }
        // success, print out the deets!
        console.log(passTimes);
      });
    });
  });
});