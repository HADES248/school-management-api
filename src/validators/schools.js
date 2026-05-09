function validateSchool({ name, address, latitude, longitude }) {
  const errors = [];

  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("name is required and must be a non-empty string.");
  }

  if (!address || typeof address !== "string" || address.trim() === "") {
    errors.push("address is required and must be a non-empty string.");
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (latitude === undefined || latitude === null || isNaN(lat) || lat < -90 || lat > 90) {
    errors.push("latitude must be a valid number between -90 and 90.");
  }

  if (longitude === undefined || longitude === null || isNaN(lon) || lon < -180 || lon > 180) {
    errors.push("longitude must be a valid number between -180 and 180.");
  }

  return errors;
}

module.exports = validateSchool;