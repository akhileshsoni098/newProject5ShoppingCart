//Name

const validateName = (name) => {
  return /^[A-Z](?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(name);
};

// Email

const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);
};

//Password

const validatePassword = (password) => {
  //8-15 characters, one lowercase letter and one number and maybe one UpperCase & special character:
  return /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,15}$/.test(password);
};

//Phone

const validateMobileNo = (Number) => {
  return /^((\+91)?|91)?[6789][0-9]{9}$/g.test(Number);
};

//Place

const validatePlace = (value) => {
  return /^[^\W\d_]+\.?(?:[-\s'][^\W\d_]+\.?)*$/.test(value);
};

//Pincode

const validatePincode = (pincode) => {
  return /^[1-9][0-9]{5}$/.test(pincode);
};

const validateTitle = (title) => {
  return /^[A-Z](?=.{1,15}$)[a-z]+(?:['_.\s][a-z]+)*$/.test(title) // 1 character Caps , range - 1-15
}

const validatePrice = (price) => {
  return /^[1-9]\d*(\.\d+)?$/.test(price)
}


const validateInstallments = (installment) => {
  return /^(0(?!)|[1-9]\d{0,1})$/.test(installment)
}


module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateMobileNo,
  validatePincode,
  validatePlace,
  validateTitle,
  validatePrice,
  validateInstallments
};
