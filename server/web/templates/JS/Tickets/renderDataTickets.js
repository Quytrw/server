import { HOST, PORT } from "../config.js";
import renderListPage from "./paginationTicker.js";
let list_Ticket = [];
let lists = []

const ticketItems = document.querySelector(".ticket-list");
const prev_btn = document.getElementById("prev_link");
const next_btn = document.getElementById("next_link");
const license = document.querySelector(".license");
const selectItem = document.querySelector(".select-list");
const timein = document.querySelector(".timein");
const timeout = document.querySelector(".timeout");
const inform = document.querySelector(".inform");

let perPage = 3;
let currentPage = 1;
let start = 0;
let end = perPage;
let totalPages = 0;
const acc = JSON.parse(sessionStorage.getItem("currentUser"))

const ticketsAPI = `http://${HOST}:${PORT}/api/tickets/`;
const websocketURL = `ws://${HOST}:${PORT}/ws/tickets/`;

// Connect to WebSocket
const socket = new WebSocket(websocketURL);
socket.onopen = function(event) {
  console.log("Kết nối đã được thiết lập thành công!");
};
socket.onerror = function(error) {
  console.error("Lỗi kết nối: ", error);
};
socket.onmessage = function(event) {
  const message = JSON.parse(event.data);
  
  // Check if the message is a parking lot update
  if (message.type === 'ticket.update') {
    const updatedTickets = message.ticket;
    
    // Find the updated parking lot in the list
    const index = lists.findIndex(ticket => ticket.id === updatedTickets.id);
    if (index !== -1) {
      // Replace the existing parking lot with the updated one
      lists[index] = updatedTickets;
      
      // Refresh the parking lot list
      renderTicket(lists);
    }
  }
};

function main() {
  getData(renderTicket);
}
function getData(callback) {
  fetch(ticketsAPI)
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (response) {
      if(acc.isAdmin) {
        list_Ticket = response;
      }
      else {
        list_Ticket = response.filter(ticket => ticket.license == acc.license)
      }
      lists = list_Ticket
      totalPages = Math.ceil(list_Ticket.length / perPage);
      renderListPage(list_Ticket, currentPage, changePage);
      return list_Ticket;
    })
    .then(callback);
}
function renderTicket(list_Ticket) {
  let check;
  let htmls = "";
  const content = list_Ticket.map((ticket, index) => {
    if (index >= start && index < end) {
      if (ticket.ispaid) {
        check = "checked";
      } else {
        check = "";
      }
      if (ticket.timeout == null) {
        ticket.timeout = "";
      }
      if (ticket.total == null) {
        ticket.total = 0;
      }
      htmls += `<tr class="h-[80px]">`;
      htmls += `<td class="border border-black">${index + 1}</td>`;
      htmls += `<td class="border border-black">${ticket.license}</td>`;
      htmls += `<td class="border border-black">${ticket.timein}</td>`;
      htmls += `<td class="border border-black">${ticket.timeout}</td>`;
      htmls += `<td class="border border-black">${ticket.total}</td>`;
      htmls += `<td class="border border-black"><input type="checkbox" name="" id="" ${check} disabled></td>`;
      htmls += `</tr>`;
      return htmls;
    }
  });
  ticketItems.innerHTML = htmls;
}
function handleButtonPageClick(currentNumberPage, i, centerIndex) {
  if (currentPage <= 4 || currentPage >= totalPages - 3) {
    currentNumberPage[i].classList.add("text-white", "bg-[#2B3467]");
  } else if (currentNumberPage.length === 7) {
    currentNumberPage[centerIndex].classList.add("text-white", "bg-[#2B3467]");
  } else {
    currentNumberPage[centerIndex].classList.add("text-white", "bg-[#2B3467]");
  }

  start = (currentPage - 1) * perPage;
  end = currentPage * perPage;

  next_btn.classList.remove("text-[#ccc]");
  prev_btn.classList.remove("text-[#ccc]");

  if (currentPage === 1) {
    prev_btn.classList.add("text-[#ccc]");
    prev_btn.disabled = true;
  }
  if (currentPage === totalPages) {
    next_btn.classList.add("text-[#ccc]");
    next_btn.disabled = true;
  }
}
function changePage(list_Ticket) {
  let currentNumberPage = document.querySelectorAll(".number-page div");
  let centerIndex = Math.floor(currentNumberPage.length / 2);

  for (let i = 0; i < currentNumberPage.length; i++) {
    currentNumberPage[i].addEventListener("click", function () {
      let value = parseInt(currentNumberPage[i].innerText);
      currentPage = value;
      renderListPage(list_Ticket, currentPage, changePage);

      currentNumberPage = document.querySelectorAll(".number-page div");
      $(".number-page div").removeClass("text-white bg-[#2B3467]");

      handleButtonPageClick(currentNumberPage, i, centerIndex);

      renderTicket(list_Ticket);
    });
  }
}
next_btn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
  }
  if (currentPage === totalPages) {
    next_btn.classList.add("text-[#ccc]");
  }
  renderListPage(list_Ticket, currentPage, changePage);
  prev_btn.classList.remove("text-[#ccc]");
  $(".number-page div").removeClass("text-white bg-[#2B3467]");

  if (currentPage <= 5) {
    $(`.number-page div:eq(${currentPage - 1})`).addClass(
      "text-white bg-[#2B3467]"
    );
  } else if (currentPage >= totalPages - 3) {
    let targetIndex = 4 + (currentPage - (totalPages - 3));
    $(`.number-page div:eq(${targetIndex})`).addClass(
      "text-white bg-[#2B3467]"
    );
  } else {
    $(".number-page div:eq(4)").addClass("text-white bg-[#2B3467]");
  }

  if (currentPage === 21 && totalPages >= 21) {
    $(".number-page div:last-child").addClass("text-white bg-[#2B3467]");
  }

  start = (currentPage - 1) * perPage;
  end = currentPage * perPage;
  renderTicket(list_Ticket);
});
prev_btn.addEventListener("click", () => {
  currentPage--;

  if (currentPage < 1) {
    currentPage = 1;
  }
  if (currentPage === 1) {
    prev_btn.classList.add("text-[#ccc]");
  }
  renderListPage(list_Ticket, currentPage, changePage);
  next_btn.classList.remove("text-[#ccc]");
  start = (currentPage - 1) * perPage;
  end = currentPage * perPage;
  renderTicket(list_Ticket);
});
export function searchTicketListInAdmin() {
  start = 0;
  end = perPage;
  const select = selectItem.options[selectItem.selectedIndex].innerHTML;
  let tickets = []
  if (license.value != "" && timein.value != "" && timeout.value != "" && select != "") {
    // Tìm vé theo 3 input
    if (select == "Not paid") {
      tickets = lists.filter(ticket => 
        ticket.license == license.value && 
        listDayBetween(new Date(timein.value), new Date(timeout.value))
        .includes(ticket.timein.slice(0, -10)) && ticket.ispaid == false)
    } else if (select == "Paid") {
      tickets = lists.filter(ticket => 
        ticket.license == license.value && 
        listDayBetween(new Date(timein.value), new Date(timeout.value))
        .includes(ticket.timein.slice(0, -10)) && ticket.ispaid == true)
    } else {
      tickets = lists.filter(ticket => 
        ticket.license == license.value && 
        listDayBetween(new Date(timein.value), new Date(timeout.value))
        .includes(ticket.timein.slice(0, -10)))
    }
  } else if (license.value != "" && timein.value != "" && timeout.value != "") {
    // Tìm vé theo license và datein
    tickets = lists.filter(ticket => listDayBetween(new Date(timein.value), new Date(timeout.value))
    .includes(ticket.timein.slice(0, -10)) && ticket.license == license.value)
  } else if (license.value != "" && select != "") {
    // Tìm vé theo license và select
    if (select == "Not paid") {
      tickets = lists.filter(ticket => ticket.license == license.value && ticket.ispaid == false)
    } else if (select == "Paid") {
      tickets = lists.filter(ticket => ticket.license == license.value && ticket.ispaid == true)
    } else {
      tickets = lists.filter(ticket => ticket.license == license.value)
    }
  } else if (timein.value != "" && timeout.value != "" && select != "") {
    // Tìm vé theo datein và select
    if (select == "Not paid") {
      tickets = lists.filter(ticket => listDayBetween(new Date(timein.value), new Date(timeout.value))
    .includes(ticket.timein.slice(0, -10)) && ticket.ispaid == false)
    } else if (select == "Paid") {
      tickets = lists.filter(ticket => listDayBetween(new Date(timein.value), new Date(timeout.value))
    .includes(ticket.timein.slice(0, -10)) && ticket.ispaid == true)
    } else {
      tickets = lists.filter(ticket => listDayBetween(new Date(timein.value), new Date(timeout.value))
    .includes(ticket.timein.slice(0, -10)))
    }
  } else if (license.value != "") {
    // Tìm vé theo license
    tickets = lists.filter(ticket => ticket.license == license.value)
  } else if (timein.value != "" && timeout.value != "") {
    // Tìm vé theo datein
    tickets = lists.filter(ticket => listDayBetween(new Date(timein.value), new Date(timeout.value))
    .includes(ticket.timein.slice(0, -10)))
  } else if (select != "") {
    // Tìm vé theo select
      if(select == "Paid") {
        tickets = lists.filter(ticket => ticket.ispaid == true)
    }
    else if (select == "Not paid") {
        tickets = lists.filter(ticket => ticket.ispaid == false)
    }
    else {
        tickets = lists
    }
  } else {
    tickets = []
  }
  if (tickets.length <= 0) {
    inform.innerHTML = "Not found any tickets!";
    inform.style.display = "block";
  } else {
    inform.innerHTML = "";
    inform.style.display = "none";
  }
  list_Ticket = tickets
  totalPages = Math.ceil(tickets.length / perPage);
  ticketItems.innerHTML = "";
  renderListPage(tickets, currentPage, changePage);
  renderTicket(tickets);
}
export function searchTicketListInUser() {
  start = 0;
  end = perPage;
  const select = selectItem.options[selectItem.selectedIndex].innerHTML;
  let tickets = [];
  if (timein.value == "" && timeout.value == "") {
    if (select == "Paid") {
      tickets = lists.filter((ticket) => ticket.ispaid == true);
    } else if (select == "Not paid") {
      tickets = lists.filter((ticket) => ticket.ispaid == false);
    } else {
      tickets = lists;
    }
  }
  else {
    if (select == "Paid") {
      tickets = lists.filter((ticket) => ticket.ispaid == true && listDayBetween(new Date(timein.value), new Date(timeout.value)).includes(ticket.timein.slice(0, -10)));
    } else if (select == "Not paid") {
      tickets = lists.filter((ticket) => ticket.ispaid == false && listDayBetween(new Date(timein.value), new Date(timeout.value)).includes(ticket.timein.slice(0, -10)));
    } else {
      tickets = lists.filter((ticket) => listDayBetween(new Date(timein.value), new Date(timeout.value)).includes(ticket.timein.slice(0, -10)));
    }
  }
  // console.log(listDayBetween(new Date(timein.value.slice(0, -6)), new Date(timeout.value.slice(0, -6))));
  if (tickets.length <= 0) {
    inform.innerHTML = "Not found any tickets!";
    inform.style.display = "block";
  } else {
    inform.innerHTML = "";
    inform.style.display = "none";
  }
  list_Ticket = tickets
  totalPages = Math.ceil(tickets.length / perPage);
  ticketItems.innerHTML = "";
  renderListPage(tickets, currentPage, changePage);
  renderTicket(tickets);
}
function listDayBetween(startDate, endDate) {
  const datesInRange = [];

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    datesInRange.push(dateStr);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return datesInRange;
}
main();
