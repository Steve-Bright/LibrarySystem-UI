import { getAllLoansFunction, searchLoan } from "../../controllers/loan.controller.js";
import { buildMemberNavigation } from "../../utils/extra.js";
import { buildNavArea } from "../../utils/extra.js";
import { dotImages } from "../../utils/extra.js";
import { todayDate } from "../../utils/extra.js";
const loanType = document.getElementById("loanType")
const searchLoanForm = document.getElementById("searchLoanForm")
const printLoan = document.getElementById('printLoan')
const borrowButton = document.getElementById("borrowBook")
const totalData = document.getElementById("totalData")
const loanNavigationArea = document.getElementById("loanNavigationArea")
const loanDataEl = document.getElementById("loanData")

const pageIndex = document.getElementById("loanPageIndex")
const totalPagesUI = document.getElementById("loanTotalPages")
const collectionBackward = document.querySelectorAll(".collectionBackward")
const collectionForward = document.querySelectorAll(".collectionForward")
const buttonsForward = document.getElementById("loanButtonsForward")
const buttonsBackward = document.getElementById("loanButtonsBackward")
const navigationButtons = document.getElementById('loanNavigationButtons')

let searchedHistory = sessionStorage.getItem("searchLoanResult")
let searchedKeyword = sessionStorage.getItem("searchLoanData")

let loanTypeValue = cacheLoanType();
loanType.value = loanTypeValue;
let index = Number(cachePageIndex(loanTypeValue));
await searchLoanFunction(loanTypeValue)

if(!searchedHistory){
  updateLoanData(loanTypeValue, index)
}else{
  placeItemsInSearchForm(searchedKeyword)
  showSearchResults(searchedHistory)
}

loanType.addEventListener("change", () => {
  updateLoanData(loanType.value, index)
  window.location.reload()
} )

printLoan.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./loans/printLoans/printLoans.html")
})

borrowButton.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./loans/addLoan/addLoan.html")
})

function placeItemsInSearchForm(searchedCache){
  searchedCache = JSON.parse(searchedCache)
  searchLoanForm.accNoInput.value = searchedCache.accNo,
  searchLoanForm.memberIdInput.value = searchedCache.memberId,
  searchLoanForm.bookNameInput.value = searchedCache.bookTitle,
  searchLoanForm.memberNameInput.value = searchedCache.name,
  searchLoanForm.loanDateInput.value = searchedCache.loanDate,
  searchLoanForm.dueDateInput.value = searchedCache.dueDate
}

async function updateLoanData(loanValue, page = 1){
  loanTypeValue = loanValue;
  let loanData = cacheLoanType(loanValue);
  let result = await getAllLoansFunction(loanData, page)
  let totalLength = result.result.totalItems;
  let totalPages = result.result.totalPages;
  totalData.innerHTML = `Loans (${totalLength})`
  let navigationComponents = {
    resultPages: {totalPages, index, navigationButtons},
    collectionNavigation: {collectionBackward, collectionForward},
    pageValues: {pageIndex, totalPagesUI},
    category: `${loanTypeValue}Loan`, 
    skipArea: {leftSkip: buttonsBackward, rightSkip: buttonsForward}
  }
  buildNavArea(navigationComponents)

  if(totalLength === 0){
    pageIndex.value = "0"
  }
  
  pageIndex.addEventListener("change", () => {
    let pageNumber = Number(pageIndex.value)
    if(pageNumber <= totalPages && pageNumber > 0){
        cachePageIndex(loanTypeValue, pageNumber)
        window.location.reload()
    }else{
      pageIndex.value = cachePageIndex(loanTypeValue) 
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

function showSearchResults(searchedHistory){
  searchedHistory = JSON.parse(searchedHistory)
  totalData.innerHTML = `Loans Found (${searchedHistory.length})`
  if(searchedHistory.length != 0){
    loanDataEl.innerHTML = ""
    showEachLoan(loanDataEl, searchedHistory)
  }else{
    loanDataEl.innerHTML = `
       <tr> <td colspan="8"> No Loans found </td> </tr>
    `
  }
}

function updateNewIndex(newIndex){
  index = newIndex;
}

function showEachLoan(placerDiv, loanData){
  for(let eachLoan of loanData){
    let imageCondition = ``;
    if(eachLoan.loanStatus == true){
        let dueDate = new Date(eachLoan.dueDate)
        if(eachLoan.overdue){
          imageCondition =  `<img src=${dotImages.red_dot} class="dotSize"></img>`
        }else if(dueDate.toDateString() === new Date(todayDate()).toDateString() || dueDate.toDateString() === new Date(todayDate(1)).toDateString()){
          imageCondition = `<img src=${dotImages.orange_dot} class="dotSize"></img>`
        }
        else{
          imageCondition = `<img src=${dotImages.green_dot} class="dotSize"></img>`
        }
    }

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
      <td>${imageCondition}</td>
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

async function searchLoanFunction(loanType){
  searchLoanForm.addEventListener("submit", async(e) => {
    e.preventDefault()
    let searchData = {
      accNo: e.target.accNoInput.value,
      memberId: e.target.memberIdInput.value,
      bookTitle: e.target.bookNameInput.value,
      name: e.target.memberNameInput.value,
      loanDate: e.target.loanDateInput.value,
      dueDate: e.target.dueDateInput.value
    }
    sessionStorage.setItem("searchLoanData", JSON.stringify(searchData))
    const result = await searchLoan(loanType, searchData)
    if(!result){
      sessionStorage.setItem("searchLoanResult", "[]")
    }else{
      sessionStorage.setItem("searchLoanResult", JSON.stringify(result))
    }
    window.location.reload()
  })
}

searchLoanForm.addEventListener("reset", async(e) => {
  sessionStorage.removeItem("searchLoanResult")
  sessionStorage.removeItem("searchLoanData")
  window.location.reload()
})

function cacheLoanType(booleanValue = null){
  if(booleanValue !== null){
    sessionStorage.setItem("loanType", booleanValue)
  }

  let cachedLoanTypeValue = sessionStorage.getItem("loanType")
  if(cachedLoanTypeValue === null){
    return "all"
  }
  return cachedLoanTypeValue;
}

function cachePageIndex(loanType, indexValue = null){
  // "allLoan": "allLoanPageIndex",
  // "todayLoan": "todayLoanPageIndex",
  // "overdueLoan": "overdueLoanPageIndex",
  // "otherLoan": "otherLoanPageIndex",
  let sessionData;
  switch(loanType){
    case "all": sessionData = "allLoanPageIndex"
    break;
    case "today": sessionData = "todayLoanPageIndex"
    break;
    case "overdue": sessionData = "overdueLoanPageIndex"
    break;
    case "other": sessionData = "otherLoanPageIndex"
    break;
  }
  if(indexValue !== null){
      sessionStorage.setItem(sessionData, indexValue)
  }
  let cachedPageIndexValue = sessionStorage.getItem(sessionData)
  if(cachedPageIndexValue === null){
      return 1;
  }
  return cachedPageIndexValue;
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