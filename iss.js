const request = require('request');

const isJson = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return false;
  }
};

const isJsonParsable = string => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(`https://api.ipify.org/?format=json`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    if (!isJson(body)) {
      callback('Response is not in JSON format!', null);
      return;
    }

    if (isJson(body) && isJsonParsable(body)) {
      const data = JSON.parse(body);
      callback(null, data.ip);
    }

  });
};

/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */
const fetchCoordsByIP = (ip, callback) => {
  // use request to fetch lat/lng from JSON API
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`;
      callback(msg, null);
      return;
    }

    if (!isJson(body)) {
      callback('Response is not in JSON format!', null);
      return;
    }

    if (isJson(body) && isJsonParsable(body)) {
      const { latitude, longitude } = JSON.parse(body);
      callback(null, { latitude, longitude });
    }

  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = (coords, callback) => {
  // use request to fetch lat/lng from JSON API
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching FlyOver Times Response: ${body}`;
      callback(msg, null);
      return;
    }

    if (!isJson(body)) {
      callback('Response is not in JSON format!', null);
      return;
    }

    if (isJson(body) && isJsonParsable(body)) {
      const data = JSON.parse(body);
      if (data.response)
        callback(null, data.response);
    }

  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(passTimes, callback) {
  if (!passTimes) {
    callback('No Passtimes Available!', null);
    return;
  }

  let passDate, displayResult;
  for (let pass of passTimes) {
    passDate = new Date(pass.risetime * 1000);
    displayResult = `Next pass at ${passDate} for ${pass.duration} seconds!`;
    callback(null, displayResult);
  }
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };