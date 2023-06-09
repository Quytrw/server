import {getInfor, handleEdit} from './index.js'


const name = document.getElementById('name')
const password = document.getElementById('password')
const email = document.getElementById('email')
const submitBtn = document.querySelector('.save_btn')
const account_name = document.querySelector('.account_name')
const acc = JSON.parse(sessionStorage.getItem("currentUser"))
let data = {}

name.value = getInfor().name
password.value = getInfor().password
email.value = getInfor().email

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    data = {
        "id": acc.id,
        "email": acc.email,
        "password": password.value,
        "name": name.value,
        "license": acc.license,
        "isAdmin": acc.isAdmin
    }
    handleEdit(data)
})