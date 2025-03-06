import { getMemLoanHis } from "../../controllers/member.controller.js";
import { buildLoanHistoryNavigation } from "../../utils/extra.js"
import { buildNavArea } from "../../utils/extra.js";
const backToCollection = document.getElementById("backToCollection")
const totalData = document.getElementById("totalData")
const loanNavigationArea = document.getElementById("loanNavigationArea")
const loanDataEl = document.getElementById("loanData")

const pageIndex = document.getElementById("memLoanHisPageIndex")
const totalPagesUI = document.getElementById("memLoanHisTotalPages")
const collectionBackward = document.querySelectorAll(".collectionBackward")
const collectionForward = document.querySelectorAll(".collectionForward")
const buttonsForward = document.getElementById("memLoanHisButtonsForward")
const buttonsBackward = document.getElementById("memLoanHisButtonsBackward")
const navigationButtons = document.getElementById('memLoanHisNavigationButtons')

let detailedMember = JSON.parse(sessionStorage.getItem("memberId"))
let memberId = detailedMember.id
let index = Number(cachePageIndex(memberId))

updateLoanData()

backToCollection.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./members/viewMember/viewMember.html")
})

async function updateLoanData(page = 1){
    let result = await getMemLoanHis(memberId, page)
    let totalLength = result.result.totalItems;
    let totalPages = result.result.totalPages;
    totalData.innerHTML = `Loans (${totalLength})`

    let navigationComponents = {
      resultPages: {totalPages, index, navigationButtons},
      collectionNavigation: {collectionBackward, collectionForward},
      pageValues: {pageIndex, totalPagesUI},
      category: `${memberId}LoanHis`,
      skipArea: {leftSkip: buttonsBackward, rightSkip: buttonsForward}
    }
    buildNavArea(navigationComponents)
    pageIndex.addEventListener("change", () => {
      if(pageIndex.value <= totalPages){
          cachePageIndex(memberId, pageIndex.value)
          window.location.reload()
      }else{
          pageIndex.value = cachePageIndex(memberId) 
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

function cachePageIndex(memberId, indexValue = null){
  let sessionData = `${memberId}LoanHis`
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
