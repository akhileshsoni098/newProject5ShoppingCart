//Name

const validateName = (name) => {
  return /^[A-Z](?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(name);
};

// Email

const validateEmail = (email) => {
  return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(
    email
  );
};

//Password

const validatePassword = (password) => {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(
    password
  );
};

//Phone

const validateMobileNo = (Number) => {
  return /^((\+91)?|91)?[6789][0-9]{9}$/g.test(Number);
};

//Pincode

const validatePincode = (pincode) => {
  return /^[1-9][0-9]{5}$/.test(pincode);
};

//Place

const validatePlace = (value) => {
  return /^[^\W\d_]+\.?(?:[-\s'’][^\W\d_]+\.?)*$/.test(value);
};

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateMobileNo,
  validatePincode,
  validatePlace,
};
