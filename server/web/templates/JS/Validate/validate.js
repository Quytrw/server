export const isEmpty = (value) => {
    if(value == "") return true
    else return false
}
export const isValidEmail = (email) => {
    let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if(!regex.test(email)){
        return false
    }
    return true
}
export const minLength = (str, minlength) => {
    if(str.length < minlength) return false
    return true 
}
export const validateLicensePlate = (licensePlate) => {
    const regex = /^([0-9]{2}[A-Za-z]{1}[0-9]{1})|([0-9]{1}[A-Za-z]{2}[0-9]{1})|(([A-HK-Lo][a-zA-HJ-NP-Z])[0-9]{4})|((T|t)([0-9]{5}))$/;
  
    return regex.test(licensePlate);
  }