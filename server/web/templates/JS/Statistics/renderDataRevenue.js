import { HOST, PORT } from "../config.js";
let list_Revenue = [];
let lists = [];

const revenueItems = document.querySelector(".revenue-list");
const prev_btn = document.getElementById("prev_link");
const next_btn = document.getElementById("next_link");
const number_page = document.querySelector(".number-page");
const timein = document.querySelector(".timein");
const timeout = document.querySelector(".timeout");
const total = document.querySelector(".total");
const inform = document.querySelector(".inform");

let perPage = 3;
let currentPage = 1;
let start = 0;
let end = perPage;
let totalPages = 0;

// const ticketsAPI = "http://localhost:3000/tickets"
// const ticketsAPI = "http://192.168.232.123:8000/api/tickets/"
const ticketsAPI = `http://${HOST}:${PORT}/api/tickets/`;
const websocketURL = `ws://${HOST}:${PORT}/ws/tickets/`;

// Connect to WebSocket
const socket = new WebSocket(websocketURL);
socket.onopen = function (event) {
  console.log("Kết nối đã được thiết lập thành công!");
};
socket.onerror = function (error) {
  console.error("Lỗi kết nối: ", error);
};
socket.onmessage = function (event) {
  const message = JSON.parse(event.data);

  // Check if the message is a parking lot update
  if (message.type === "ticket.update") {
    const updatedTickets = message.ticket;

    if (updatedTickets.ispaid) {
      const index = lists.findIndex(
        (ticket) => ticket.id === updatedTickets.id
      );
      console.log(updatedTickets);
      console.log(lists);
      if (index !== -1) {
        lists[index] = updatedTickets;
      }
      else {
        lists.push(updatedTickets);
        console.log(lists);
      }
      getData(renderRevenue);
    }
  }
};

function main() {
  getData(renderRevenue);
}
function getData(callback) {
  fetch(ticketsAPI)
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (response) {
      list_Revenue = response.filter((ticket) => ticket.ispaid == true);
      // console.log(list_Revenue);
      lists = list_Revenue;
      totalPages = Math.ceil(list_Revenue.length / perPage);
      renderListPage(totalPages, list_Revenue);
      return response;
    })
    .then(function () {
      callback(list_Revenue);
    });
}
function renderRevenue(list_Revenue) {
  let htmls = "";
  const content = list_Revenue.map((ticket, index) => {
    if (index >= start && index < end) {
      htmls += `<tr class="h-[80px]">`;
      htmls += `<td class="border border-black">${index + 1}</td>`;
      htmls += `<td class="border border-black">${ticket.license}</td>`;
      htmls += `<td class="border border-black">${ticket.timein}</td>`;
      htmls += `<td class="border border-black">${ticket.timeout}</td>`;
      htmls += `<td class="border border-black">${ticket.total}</td>`;
      htmls += `<td class="border border-black"><input type="checkbox" name="" id="" checked disabled></td>`;
      htmls += `</tr>`;
      return htmls;
    }
  });
  revenueItems.innerHTML = htmls;
  loadRevenues(list_Revenue);
}
function changePage(list_Revenue) {
  const currentNumberPage = document.querySelectorAll(".number-page div");
  for (let i = 0; i < currentNumberPage.length; i++) {
    // console.log(currentNumberPage[i]);
    currentNumberPage[i].addEventListener("click", () => {
      let value = i + 1;
      currentPage = value;
      $(".number-page div").removeClass("text-white");
      $(".number-page div").removeClass("bg-[#2B3467]");
      currentNumberPage[i].classList.add("text-white");
      currentNumberPage[i].classList.add("bg-[#2B3467]");
      // console.log(currentNumberPage[i]);
      start = (currentPage - 1) * perPage;
      end = currentPage * perPage;
      // console.log(currentPage);
      next_btn.classList.remove("text-[#ccc]");
      prev_btn.classList.remove("text-[#ccc]");
      if (i == 0) {
        prev_btn.classList.add("text-[#ccc]");
        // next_btn.classList.remove('text-[#ccc]')
        prev_btn.disable = true;
      }
      if (i == currentNumberPage.length - 1) {
        next_btn.classList.add("text-[#ccc]");
        // prev_btn.classList.remove('text-[#ccc]')
        next_btn.disable = true;
      }
      renderRevenue(list_Revenue);
    });
  }
}
function renderListPage(totalPages, list_Revenue) {
  let htmls = "";
  htmls += `<div class="text-white bg-[#2B3467] float-left py-2 px-4 duration-300 border border-[#ddd] mx-1 cursor-pointer">${1}</div>`;
  for (let i = 2; i <= totalPages; i++) {
    htmls += `<div class=" float-left py-2 px-4 duration-300 border border-[#ddd] mx-1 cursor-pointer">${i}</div>`;
  }
  number_page.innerHTML = htmls;
  changePage(list_Revenue);
}
next_btn.addEventListener("click", () => {
  currentPage++;

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  if (currentPage === totalPages) {
    next_btn.classList.add("text-[#ccc]");
  }
  prev_btn.classList.remove("text-[#ccc]");
  $(".number-page div").removeClass("text-white");
  $(".number-page div").removeClass("bg-[#2B3467]");
  $(`.number-page div:eq(${currentPage - 1})`).addClass("text-white");
  $(`.number-page div:eq(${currentPage - 1})`).addClass("bg-[#2B3467]");
  start = (currentPage - 1) * perPage;
  end = currentPage * perPage;
  renderRevenue(list_Revenue);
});
prev_btn.addEventListener("click", () => {
  currentPage--;

  if (currentPage < 1) {
    currentPage = 1;
  }
  if (currentPage === 1) {
    prev_btn.classList.add("text-[#ccc]");
  }
  next_btn.classList.remove("text-[#ccc]");
  $(".number-page div").removeClass("text-white");
  $(".number-page div").removeClass("bg-[#2B3467]");
  $(`.number-page div:eq(${currentPage - 1})`).addClass("text-white");
  $(`.number-page div:eq(${currentPage - 1})`).addClass("bg-[#2B3467]");
  start = (currentPage - 1) * perPage;
  end = currentPage * perPage;
  renderRevenue(list_Revenue);
});
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
export function searchRevenueByDateTime() {
  // revenueItems.innerHTML = ''
  let revenues = [];
  start = 0;
  end = perPage;
  // console.log(timein.value.slice(0, -6), timeout.value.slice(0, -6));
  // console.log(listDayBetween(new Date(timein.value.slice(0, -6)), new Date(timeout.value.slice(0, -6))));
  revenues = lists.filter((ticket) => {
    if (
      listDayBetween(new Date(timein.value), new Date(timeout.value)).includes(
        ticket.timein.slice(0, -10)
      ) &&
      ticket.ispaid == true
    ) {
      return true;
    }
  });
  totalPages = Math.ceil(revenues.length / perPage);
  revenueItems.innerHTML = "";
  // console.log(revenues);
  // console.log(revenueItems.innerHTML);
  if (revenues.length <= 0) {
    inform.innerHTML = "Không tìm thấy vé nào!";
    inform.style.display = "block";
  } else {
    inform.innerHTML = "";
    inform.style.display = "none";
  }
  list_Revenue = revenues;
  renderListPage(totalPages, revenues);
  renderRevenue(revenues);
  loadRevenues(revenues);
}
function loadRevenues(list_Revenue) {
  let totalSum = 0;
  list_Revenue.forEach((ticket) => {
    if (ticket.ispaid == true) {
      totalSum += Number.parseInt(ticket.total);
    }
    return totalSum;
  });
  console.log(totalSum);
  total.innerHTML = totalSum;
}
main();
