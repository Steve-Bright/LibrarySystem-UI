import { getMemLoanHis } from "../../controllers/member.controller.js";
import { buildLoanHistoryNavigation } from "../../utils/extra.js"
const backToCollection = document.getElementById("backToCollection")
const totalData = document.getElementById("totalData")
const loanNavigationArea = document.getElementById("loanNavigationArea")
const loanDataEl = document.getElementById("loanData")
let detailedMember = JSON.parse(sessionStorage.getItem("memberId"))
let memberId = detailedMember.id
let index = 1;

updateLoanData()

backToCollection.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./members/viewMember/viewMember.html")
})

async function updateLoanData(page = 1){
    let result = await getMemLoanHis(memberId, page)
    let totalLength = result.result.totalItems;
    let totalPages = result.result.totalPages;
    totalData.innerHTML = `Loans (${totalLength})`

    if(totalPages > 1){
        if(page == 1){
            buildLoanHistoryNavigation(loanNavigationArea, false, true, index, updateLoanData, updateNewIndex)
        }else if (page === totalPages){
            buildLoanHistoryNavigation(loanNavigationArea, true, false, index, updateLoanData, updateNewIndex)
        }else{
            buildLoanHistoryNavigation(loanNavigationArea, true, true, index, updateLoanData, updateNewIndex)
        }
    }else{
        buildLoanHistoryNavigation(loanNavigationArea, false, false, index, updateLoanData, updateNewIndex)
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
