const headingForm_text = document.querySelector('.form-heading')
const headingIntroduce_text = document.querySelector('.introduce-heading')
const submit_btn = document.querySelector('input[type="submit"]')
const switch_btn = document.querySelector('.switch')
const formContainer = document.querySelector('.form-container')
const switchContainer = document.querySelector('.switch-container')
const name = document.querySelector('input[placeholder="Name"]')
const license = document.querySelector('input[placeholder="License plate"]')
const errName = document.querySelector('.errName')
const errEmail = document.querySelector('.errEmail')
const errPassword = document.querySelector('.errPassword')
const errLicense = document.querySelector('.errLicense')

let isSignIn = false
switch_btn.addEventListener('click', function (e) {
    e.preventDefault()
    setTimeout(function () {
        name.classList.toggle('hidden')
        license.classList.toggle('hidden')
        errName.classList.toggle('hidden')
        errLicense.classList.toggle('hidden')
    }, 200)
    errName.innerHTML = ''
    errEmail.innerHTML = ''
    errPassword.innerHTML = ''
    errLicense.innerHTML = ''
    if (isSignIn) {
        formContainer.classList.remove('translate-x-[430px]')
        switchContainer.classList.remove('-translate-x-[1038px]')
        setTimeout(function () {
            headingForm_text.innerHTML = "LOGIN TO YOUR ACCOUNT"
            headingIntroduce_text.innerHTML = "NEW HERE ?"
            switch_btn.innerHTML = "Sign Up"
            submit_btn.value = "Sign In"
            submit_btn.classList.add("signIn")
            submit_btn.classList.remove("signUp")
        }, 200)
        isSignIn = false
    }
    else {
        formContainer.classList.add('translate-x-[430px]')
        switchContainer.classList.add('-translate-x-[1038px]')
        setTimeout(function () {
            headingForm_text.innerHTML = "CREATE YOUR ACCOUNT"
            headingIntroduce_text.innerHTML = "ALREADY HAVE ?"
            switch_btn.innerHTML = "Sign In"
            submit_btn.value = "Sign Up"
            submit_btn.classList.remove("signIn")
            submit_btn.classList.add("signUp")
        }, 200)
        isSignIn = true
    }

})
submit_btn.addEventListener('click', function (e) {
    e.preventDefault()
})
