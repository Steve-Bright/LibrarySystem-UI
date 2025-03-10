import { getAllLoansFunction, searchLoan } from "../../controllers/loan.controller.js";
// import { navigationComponents, } from "../../utils/extra.js";
import { buildNavArea } from "../../utils/extra.js";
const backToCollection = document.getElementById("backToCollection")
const loanType = document.getElementById("loanType")
const searchLoanForm = document.getElementById("searchLoanForm")
const totalData = document.getElementById("totalData")
const loanNavigationArea = document.getElementById("loanNavigationArea")
const loanDataEl = document.getElementById("loanData")
const printPreview = document.getElementById("printPreview")
const clearSelectedLoan = document.getElementById("clearSelectedLoans")

const pageIndex = document.getElementById("printLoanPageIndex")
const totalPagesUI = document.getElementById("printLoanTotalPages")
const collectionBackward = document.querySelectorAll(".collectionBackward")
const collectionForward = document.querySelectorAll(".collectionForward")
const buttonsForward = document.getElementById("printLoanButtonsForward")
const buttonsBackward = document.getElementById("printLoanButtonsBackward")
const navigationButtons = document.getElementById('printLoanNavigationButtons')

let searchedHistory = sessionStorage.getItem("searchPrintLoanResult")
let searchedKeyword = sessionStorage.getItem("searchPrintLoanData")
let printLoanStorage = "toPrintLoan"
let printMaterials = localStorage.getItem(printLoanStorage)
const currentFile = window.imagePaths.shareCurrentFile();
let selectedLoans = [];
let loanTypeValue = cacheLoanType();
loanType.value = loanTypeValue;

let index = Number(cachePageIndex(loanTypeValue))
await searchLoanFunction(loanTypeValue)

if(printMaterials){
  selectedLoans = printMaterials.split(",")
}

if(!searchedHistory){
  updateLoanData(loanTypeValue, index)
}else{
  placeItemsInSearchForm(searchedKeyword)
  showSearchResults(searchedHistory)
}

backToCollection.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./loans/allLoans/loanpage.html")
})

printPreview.addEventListener("click", () => {
  if(selectedLoans!=[]){
    localStorage.setItem(printLoanStorage, selectedLoans)
  }else{
    localStorage.removeItem(printLoanStorage)
  }
  let windowFeatures = {
    "width":725,
    "height":1123
  }

  let data = {
    "fileName": currentFile+"./loans/printLoans/printPreview.html",
    "name": "Loans print Window",
    "windowFeatures": windowFeatures
  }

  window.navigationApi.openWindow(data);
})

for(let eachIcon of collectionForward){
  eachIcon.addEventListener("click", () => {
      if(selectedLoans != []){
          localStorage.setItem(printLoanStorage, selectedLoans)
      }else{
          localStorage.removeItem(printLoanStorage)
      }
  })
}

for(let eachIcon of collectionBackward){
  eachIcon.addEventListener("click", () => {
      if(selectedLoans != []){
          localStorage.setItem(printLoanStorage, selectedLoans)
      }else{
          localStorage.removeItem(printLoanStorage)
      }
  })
}

clearSelectedLoan.addEventListener("click", ()=> {
  window.showMessageApi.confirmMsg("Do you really want to delete?")
})

window.showMessageApi.dialogResponse(async(event, response) =>{
  if(!response){
      localStorage.removeItem(printLoanStorage)
      window.location.reload()
  }
})

async function updateLoanData(loanValue, page = 1){
  loanTypeValue = loanValue;
  let loanData = cacheLoanType(loanValue);
  let result = await getAllLoansFunction(loanData, page)
  console.log('result is ' + JSON.stringify(result))
  let totalLength = result.result.totalItems;
  let totalPages = result.result.totalPages;
  totalData.innerHTML = `Loans (${totalLength})`

  let navigationComponents = {
    resultPages: {totalPages, index, navigationButtons},
    collectionNavigation: {collectionBackward, collectionForward},
    pageValues: {pageIndex, totalPagesUI},
    category: `${loanTypeValue}PrintLoan`,
    skipArea: {leftSkip: buttonsBackward, rightSkip: buttonsForward},
    printArray: selectedLoans
  }
  buildNavArea(navigationComponents)
  if(totalLength === 0){
    pageIndex.value = "0"
  }

  pageIndex.addEventListener("change", () => {
    if(selectedLoans != []){
      localStorage.setItem(printLoanStorage, selectedLoans)
    }else{
        localStorage.removeItem(printLoanStorage)
    }
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
                <td colspan="7">No Loans at the moment</td>
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
      <td><input type="checkbox" id=${eachLoan._id}  value=${eachLoan._id} class="eachLoan"></td>
      <td>${eachLoan.name}</td>            
      <td>${eachLoan.memberId}</td>
      <td>${eachLoan.bookTitle}</td>
      <td>${eachLoan.callNo}</td>
      <td>${eachLoan.category}</td>
      <td>${formattedLoanDate}</td>
      <td>${formattedDueDate}</td>

    `
    placerDiv.appendChild(newRow)

    // viewDetailedLoanFunction()
  }
  loanSelection()
}


function placeItemsInSearchForm(searchedCache){
  searchedCache = JSON.parse(searchedCache)
  searchLoanForm.accNoInput.value = searchedCache.accNo,
  searchLoanForm.memberIdInput.value = searchedCache.memberId,
  searchLoanForm.bookNameInput.value = searchedCache.bookTitle,
  searchLoanForm.memberNameInput.value = searchedCache.name,
  searchLoanForm.loanDateInput.value = searchedCache.loanDate,
  searchLoanForm.dueDateInput.value = searchedCache.dueDate
}

function showSearchResults(searchedHistory){
  searchedHistory = JSON.parse(searchedHistory)
  totalData.innerHTML = `Loans Found(${searchedHistory.length})`
  if(searchedHistory.length != 0){
    loanDataEl.innerHTML = ``
    showEachLoan(loanDataEl, searchedHistory)
  }else{
    loanDataEl.innerHTML = `
      <tr>
          <td colspan="7">No Loans at the moment</td>
      </tr>
    `
  }
  loanSelection()
}

function cacheLoanType(booleanValue = null){
  if(booleanValue !== null){
    sessionStorage.setItem("printloanType", booleanValue)
  }

  let cachedLoanTypeValue = sessionStorage.getItem("printloanType")
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
    case "all": sessionData = "allPrintLoanPageIndex"
    break;
    case "today": sessionData = "todayPrintLoanPageIndex"
    break;
    case "overdue": sessionData = "overduePrintLoanPageIndex"
    break;
    case "other": sessionData = "otherPrintLoanPageIndex"
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


async function searchLoanFunction(loanType){
  searchLoanForm.addEventListener("submit", async(e) => {
    e.preventDefault()
    localStorage.setItem(printLoanStorage, selectedLoans)
    let searchData = {
      accNo: e.target.accNoInput.value,
      memberId: e.target.memberIdInput.value,
      bookTitle: e.target.bookNameInput.value,
      name: e.target.memberNameInput.value,
      loanDate: e.target.loanDateInput.value,
      dueDate: e.target.dueDateInput.value
    }
    sessionStorage.setItem("searchPrintLoanData", JSON.stringify(searchData))
    const result = await searchLoan(loanType, searchData)
    if(!result){
      sessionStorage.setItem("searchPrintLoanResult", "[]")
    }else{
      sessionStorage.setItem("searchPrintLoanResult", JSON.stringify(result))
    }
    window.location.reload()
  })
}

searchLoanForm.addEventListener("reset", () => {
  sessionStorage.removeItem("searchPrintLoanResult")
  sessionStorage.removeItem("searchPrintLoanData")
  window.location.reload()
})

function loanSelection(){
  let allLoans = document.querySelectorAll(".eachLoan")
  let selectAllLoan = document.getElementById("selectAllLoans")

  selectAllLoan.addEventListener("change", () => {
    if(selectAllLoan.checked === true){
      console.log("this check box is checked")
      allLoans.forEach((eachLoan) => {
        if(!selectedLoans.includes(eachLoan.id)){
          selectedLoans.push(eachLoan.id)
        }
      })
    }else{
      console.log("this check box is deselected")
      allLoans.forEach((eachLoan) => {
        if(selectedLoans.includes(eachLoan.id)){
          let selectedIndex = selectedLoans.indexOf(eachLoan.id)
          selectedLoans.splice(selectedIndex, 1)
        }
      })
    }

    checkBoxes()
  })

  checkBoxes()
  function checkBoxes() {


    allLoans.forEach((eachLoan, i) => {
      if(selectedLoans.includes(eachLoan.id) && !eachLoan.checked){
        eachLoan.checked = true;
      }else if(!selectedLoans.includes(eachLoan.id) && eachLoan.checked){
        eachLoan.checked = false;
      }
  
      eachLoan.addEventListener("change", () => {
        if(!selectedLoans.includes(eachLoan.id)){
          selectedLoans.push(eachLoan.id)
        }else{
          let selectedIndex = selectedLoans.indexOf(eachLoan.id)
          selectedLoans.splice(selectedIndex, 1)
        }
        checkSelectAllBox()
      })
    })

    checkSelectAllBox()

    function checkSelectAllBox(){
      let allBoxesChecked = true;
      allLoans.forEach((eachLoan) => {
        if(!eachLoan.checked === true){
          allBoxesChecked = false;
        }
      })
  
      if(allBoxesChecked ==  true){
        selectAllLoan.checked = true;
      }else{
        selectAllLoan.checked = false;
      }
    }

  }

}