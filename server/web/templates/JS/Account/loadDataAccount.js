import {getInfor} from './index.js'
const account_name = document.querySelector('.account_name')
setInterval(() => {
    account_name.innerHTML = getInfor().name
}, 1000)
