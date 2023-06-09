import { submitSignInForm, submitSignUpForm } from './index.js'
import { isEmpty, isValidEmail, minLength, validateLicensePlate } from '../Validate/validate.js'

const submit_btn = document.querySelector('input[type="submit"]')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const username = document.querySelector('#name')
const license = document.querySelector('#license')
const errName = document.querySelector('.errName')
const errEmail = document.querySelector('.errEmail')
const errPassword = document.querySelector('.errPassword')
const errLicense = document.querySelector('.errLicense')
let data = {}

username.addEventListener('change', (e) => {
    e.preventDefault();
    if (isEmpty(username.value)) {
        errName.innerHTML = "Please enter your name!"
    }
    else {
        errName.innerHTML = ""
    }
})
email.addEventListener('change', (e) => {
    e.preventDefault();
    if (isEmpty(email.value) || !isValidEmail(email.value)) {
        errEmail.innerHTML = "Invalid email!"
    }
    else {
        errEmail.innerHTML = ""
    }
})
password.addEventListener('change', (e) => {
    e.preventDefault();
    if (isEmpty(password.value) || !minLength(password.value, 6)) {
        errPassword.innerHTML = "Invalid password!"
    }
    else {
        errPassword.innerHTML = ""
    }
})
license.addEventListener('change', (e) => {
    e.preventDefault();
    if (isEmpty(license.value) || !validateLicensePlate(license.value)) {
        errLicense.innerHTML = "Invalid license!"
    }
    else {
        errLicense.innerHTML = ""
    }
})
submit_btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (submit_btn.classList.contains('signIn')) {
        if (!isValidEmail(email.value)) {
            errEmail.innerHTML = "Invalid email!"
        }
        else {
            errEmail.innerHTML = ""
        }
        if (!minLength(password.value, 6)) {
            errPassword.innerHTML = "Invalid password!"
        }
        else {
            errPassword.innerHTML = ""
        }
        if(!isEmpty(email.value) && !isEmpty(password.value)) {
            submitSignInForm(e, email.value, password.value)
        }
        else {
            errEmail.innerHTML = "Enter email"
            errPassword.innerHTML = "Enter password"
        }
    }
    if (submit_btn.classList.contains('signUp')) {
        if (!isValidEmail(email.value)) {
            errEmail.innerHTML = "Invalid email!"
        }
        else {
            errEmail.innerHTML = ""
        }
        if (!minLength(password.value, 6)) {
            errPassword.innerHTML = "Invalid password!"
        }
        else {
            errPassword.innerHTML = ""
        }
        if (!validateLicensePlate(license.value)) {
            errLicense.innerHTML = "Invalid license!"
        }
        else {
            errLicense.innerHTML = ""
        }
        if(!isEmpty(username.value) && !isEmpty(password.value) && !isEmpty(email.value) && !isEmpty(license.value)) {
            data = {
                "email": email.value,
                "password": password.value,
                "name": username.value,
                "license": license.value,
                "isAdmin": false
            }
            submitSignUpForm(e, data)
        }
        else {
            errName.innerHTML = "Enter username"
            errEmail.innerHTML = "Enter email"
            errPassword.innerHTML = "Enter password"
            errLicense.innerHTML = "Enter license"
        }
    }
});



