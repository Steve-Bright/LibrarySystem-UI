import { getAllLoansFunction, searchLoan } from "../../controllers/loan.controller.js";
import { buildMemberNavigation } from "../../utils/extra.js";
const loanType = document.getElementById("loanType")
const searchLoanForm = document.getElementById("searchLoanForm")
const printLoan = document.getElementById('printLoan')
const borrowButton = document.getElementById("borrowBook")
const totalData = document.getElementById("totalData")
const loanNavigationArea = document.getElementById("loanNavigationArea")
const loanDataEl = document.getElementById("loanData")

let searchedHistory = sessionStorage.getItem("searchLoanResult")
let searchedKeyword = sessionStorage.getItem("searchLoanData")
let index = 1;
let loanTypeValue = cacheLoanType();
loanType.value = loanTypeValue;
await searchLoanFunction(loanTypeValue)

if(!searchedHistory){
  updateLoanData(loanTypeValue)
}else{
  placeItemsInSearchForm(searchedKeyword)
  showSearchResults(searchedHistory)
}

loanType.addEventListener("change", () => {
  updateLoanData(loanType.value)
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

    if(totalPages > 1){
        if(page == 1){
            buildMemberNavigation(loanNavigationArea, false, true, index, updateLoanData, updateNewIndex)
        }else if (page === totalPages){
            buildMemberNavigation(loanNavigationArea, true, false, index, updateLoanData, updateNewIndex)
        }else{
            buildMemberNavigation(loanNavigationArea, true, true, index, updateLoanData, updateNewIndex)
        }
    }else{
        buildMemberNavigation(loanNavigationArea, false, false, index, updateLoanData, updateNewIndex)
    }

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
      <td>${eachLoan.memberId.name}</td>            
      <td>${eachLoan.memberId.memberId}</td>
      <td>${eachLoan.bookId.bookTitle}</td>
      <td>${eachLoan.bookId.callNo}</td>
      <td>${eachLoan.bookId.category}</td>
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