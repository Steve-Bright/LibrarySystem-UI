import { getBookLoanHis } from "../../controllers/book.controller.js"
import { buildLoanHistoryNavigation } from "../../utils/extra.js"
const backToCollection = document.getElementById("backToCollection")
import { buildNavArea } from "../../utils/extra.js";
const totalData = document.getElementById("totalData")
const loanNavigationArea = document.getElementById("loanNavigationArea")
const loanDataEl = document.getElementById("loanData")

const pageIndex = document.getElementById("bookLoanHisPageIndex")
const totalPagesUI = document.getElementById("bookLoanHisTotalPages")
const collectionBackward = document.querySelectorAll(".collectionBackward")
const collectionForward = document.querySelectorAll(".collectionForward")
const buttonsForward = document.getElementById("bookLoanHisButtonsForward")
const buttonsBackward = document.getElementById("bookLoanHisButtonsBackward")
const navigationButtons = document.getElementById('bookLoanHisNavigationButtons')

let detailedBook = JSON.parse(sessionStorage.getItem("bookId"))
let bookId = detailedBook.id
let index = Number(cachePageIndex(bookId))

updateLoanData(index)

backToCollection.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./books/viewBook/viewBook.html")
})

async function updateLoanData(page = 1){
    let result = await getBookLoanHis(bookId, page)
    let totalLength = result.result.totalItems;
    let totalPages = result.result.totalPages;
    totalData.innerHTML = `Loans (${totalLength})`

    let navigationComponents = {
      resultPages: {totalPages, index, navigationButtons},
      collectionNavigation: {collectionBackward, collectionForward},
      pageValues: {pageIndex, totalPagesUI},
      category: `${bookId}LoanHis`, 
      skipArea: {leftSkip: buttonsBackward, rightSkip: buttonsForward}
    }
    buildNavArea(navigationComponents)
    pageIndex.addEventListener("change", () => {
      if(pageIndex.value <= totalPages){
          cachePageIndex(bookId, pageIndex.value)
          window.location.reload()
      }else{
          pageIndex.value = cachePageIndex(bookId) 
          window.showMessageApi.alertMsg("Invalid page")
      }
    })

    let totalLoanData = result.result.items;
    if(totalLoanData.length > 0){
      loanDataEl.innerHTML = ``
      showEachLoan(loanDataEl, totalLoanData)
    }else{
      loanDataEl.innerHTML = `
        <tr>
                <td colspan="8">No Loans at the moment</td>
        </tr>
      `
    }
}

function updateNewIndex(newIndex){
  index = newIndex;
}

function cachePageIndex(bookId, indexValue = null){
  let sessionData = `${bookId}LoanHis`
  if(indexValue !== null){
      sessionStorage.setItem(sessionData, indexValue)
  }
  let cachedPageIndexValue = sessionStorage.getItem(sessionData)
  if(cachedPageIndexValue === null){
      return 1;
  }
  return cachedPageIndexValue;
}

function showEachLoan(placerDiv, loanData){
  for(let eachLoan of loanData){
    let loanDate = new Date(eachLoan.loanDate)
    let dueDate = new Date(eachLoan.dueDate)
    let formattedLoanDate = loanDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    let formattedDueDate = dueDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const newRow = document.createElement("tr")
    newRow.innerHTML = `
      <td>${eachLoan.name}</td>            
      <td>${eachLoan.memberId}</td>
      <td>${eachLoan.bookTitle}</td>
      <td>${eachLoan.callNo}</td>
      <td>${eachLoan.category}</td>
      <td>${formattedLoanDate}</td>
      <td>${formattedDueDate}</td>
      <td><button class="detailedLoan" id=${eachLoan._id}>View Details </button></td>
    `
    placerDiv.appendChild(newRow)
    viewDetailedLoanFunction()
  }
}

function viewDetailedLoanFunction(){
  const detailedButtons = document.querySelectorAll(".detailedLoan")
  detailedButtons.forEach((eachButton) => {
    eachButton.addEventListener("click", async() => {
      let detailedLoan = {
        id: eachButton.id
      }
      sessionStorage.setItem("loanId", JSON.stringify(detailedLoan))
      window.navigationApi.toAnotherPage("./loans/viewLoan/viewLoan.html")
    })
  })
}