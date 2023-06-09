import { searchTicketListInAdmin, searchTicketListInUser } from "./renderDataTickets.js";

const searchTicket_btn = document.querySelector('.search-ticket_btn')
const acc = JSON.parse(sessionStorage.getItem("currentUser"))
searchTicket_btn.addEventListener('click', (event) => {
    event.preventDefault()
    if (acc.isAdmin) {
        searchTicketListInAdmin()
    }
    else {
        searchTicketListInUser()
    }
})
