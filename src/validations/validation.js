//Name

const validateName = (name) => {
  return /^([a-zA-Z ]){2,30}$/.test(name);
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
  return /^[6789][0-9]{9}$/g.test(Number);
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
  return /^([a-zA-Z\d ]){2,30}$/.test(title) 
}

const validatePrice = (price) => {
  return /^[1-9]\d*(\.\d+)?$/.test(price)
}


const validateInstallments = (installment) => {
  return /^(0(?!)|[1-9]\d{0,1})$/.test(installment)
}

const validateStyle = (style) =>{
  return /^[a-z A-Z]+$/.test(style) 
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
  validateInstallments,
  validateStyle
};
