import { searchRevenueByDateTime } from "./renderDataRevenue.js"

const searchTicket_btn = document.querySelector('.search-ticket_btn')

searchTicket_btn.addEventListener('click', searchRevenueByDateTime, (event) => {
    event.preventDefault()
})
