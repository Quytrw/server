const number_page = document.querySelector('.number-page')
const perPage = 3

function addButton(number, currentPage){
  let classbutton = "float-left py-2 px-4 duration-300 border border-[#ddd] mx-1 cursor-pointer "
  if(number == currentPage) {
      classbutton += "text-white bg-[#2B3467]"
  }
  return `
      <div class="${classbutton}">${number}</div>
  `
}

function addDot(){
  return `
      <div class=" float-left py-2 px-4 duration-300 border border-[#ddd] mx-1 cursor-pointer">...</div>
  `
}

function renderListPage(list_Ticket, currentPage, changePage) {
  let totalPages = Math.ceil(list_Ticket.length / perPage)
  let htmls = ''
  if(totalPages > 7){
      if(currentPage <= 4) {
          for(let i = 1;i <= 5;i++){
              htmls += addButton(i, currentPage)
          }
          htmls += addDot()
          htmls += addButton(totalPages)
      } else if (currentPage >= totalPages - 3) {
          htmls += addButton(1);
          htmls += addDot()
          for (let i = totalPages - 4; i <= totalPages; i++) {
              htmls += addButton(i, currentPage)
          }
      } else {
          htmls += addButton(1);
          htmls += addDot()
          for (var i = currentPage - 1; i <= currentPage + 1; i++) {
              htmls += addButton(i, currentPage)
          }
          htmls += addDot()
          htmls += addButton(totalPages, currentPage)
        }
  } else {
      for (let i = 1; i <= totalPages; i++) {
          htmls += addButton(i, currentPage)
      }
  }
  console.log(totalPages);
  number_page.innerHTML = htmls
  changePage(list_Ticket)
}


export default renderListPage