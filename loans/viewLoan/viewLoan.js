import { deleteLoanFunction, extendLoanFunction, getDetailedLoanFunction, returnLoanFunction } from "../../controllers/loan.controller.js";
import { getDetailedBook } from "../../controllers/book.controller.js";
import { getDetailedMember } from "../../controllers/member.controller.js";
import {loanUIMapping} from "../../utils/loan.mapper.js";
import { todayDate } from "../../utils/extra.js";
const backToCollection = document.getElementById("backToCollection");
const filePath = window.imagePaths.shareFilePath();
let detailedLoan = JSON.parse(sessionStorage.getItem("loanId"))
const memberPhotoPlace = document.getElementById("memberPhotoSize")
const bookCoverPlace = document.getElementById("bookCoverSize")
const loanDetailData = document.querySelectorAll("#loanDetailForm input")
const deleteLoanBtn = document.getElementById("deleteLoanBtn")
const extendLoanBtn = document.getElementById("extendLoanBtn")
const returnLoanBtn = document.getElementById("returnLoanBtn")
const goToMemberDetails = document.getElementById("goToMemberDetails")
const goToBookDetails = document.getElementById("goToBookDetails")
const currentLoanStatus = document.getElementById("currentLoanStatus")

const loanData = await getDetailedLoanFunction(detailedLoan.id)
let cleanedLoanData = loanUIMapping(loanData.result)

backToCollection.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./loans/allLoans/loanpage.html")
})

deleteLoanBtn.addEventListener("click", ()=>{
  window.showMessageApi.confirmMsg("Are you sure you want to delete the loan?")
})

extendLoanBtn.addEventListener("click", ()=> {
  window.showMessageApi.confirmMsg2("Are you sure you want to extend the loan?")
})

returnLoanBtn.addEventListener("click", () => {
  window.showMessageApi.confirmMsg3("Are you sure you want to return the loan?")
})

//delete loan response
window.showMessageApi.dialogResponse(async(event, response) => {
  if(!response){
    const result = await deleteLoanFunction(detailedLoan.id)
    window.showMessageApi.alertMsg(result.msg)
    window.navigationApi.toAnotherPage("./loans/allLoans/loanpage.html")
  }
})

//extend loan response
window.showMessageApi.dialogResponse2(async(event, response) => {
  if(!response){
      const result = await extendLoanFunction(detailedLoan.id)
      window.showMessageApi.alertMsg(result.msg)
  }

})

//return loan response
window.showMessageApi.dialogResponse3(async(event, response) => {
  if(!response){
      const result = await returnLoanFunction(detailedLoan.id)
      window.showMessageApi.alertMsg(result.msg)
      window.location.reload()
  } 
})

Object.keys(cleanedLoanData).forEach((eachKey) => {
  for(let eachInput of loanDetailData){
    if(eachKey === "bookCover"){
      bookCoverPlace.src = filePath + cleanedLoanData[eachKey]
    }

    else if(eachKey === "photo"){
      memberPhotoPlace.src = filePath + cleanedLoanData[eachKey]
    }
    
    else if((eachKey === "loanDate" && eachInput.id === "loanDate") || (eachKey === "dueDate" && eachInput.id == "dueDate") || (eachKey === "returnDate" && eachInput.id === "returnDate")){
      if(cleanedLoanData[eachKey]){
        let dateValue = new Date(cleanedLoanData[eachKey])
        eachInput.value = dateValue.toDateString()
      }
    }

    else if(eachInput.id == eachKey){
      eachInput.value = cleanedLoanData[eachKey] ? cleanedLoanData[eachKey] : "-"
    }
  }

  if(eachKey === "loanStatus"){
    currentLoanStatus.classList.remove("returnedStatus")
    let loanDueDate = new Date(cleanedLoanData["dueDate"])
    if(cleanedLoanData["loanStatus"] == true){
      if(cleanedLoanData["overdue"]){
        currentLoanStatus.textContent = `OVERDUE: ${(new Date(cleanedLoanData["dueDate"])).toDateString()}`
        currentLoanStatus.classList.add("overdueStatus")
      }else if(loanDueDate.toDateString() === (new Date(todayDate())).toDateString() || loanDueDate.toDateString() === (new Date(todayDate(1))).toDateString()){
        currentLoanStatus.textContent = `LOANED: ${(loanDueDate).toDateString()}`
        currentLoanStatus.classList.add("nearDueStatus")
      }else{
        currentLoanStatus.textContent = `LOANED: ${(loanDueDate).toDateString()}`
        currentLoanStatus.classList.add("defaultLoanStatus")
      }
    }
  }
})

goToMemberDetails.addEventListener("click", async() =>{
  const result = await getDetailedMember(cleanedLoanData.memberDatabaseId)
  if(result.con){
    sessionStorage.setItem("memberId", JSON.stringify({id: cleanedLoanData.memberDatabaseId}))
    window.navigationApi.toAnotherPage("./members/viewMember/viewMember.html")
  }else{
    window.showMessageApi.alertMsg("Book has already been deleted")
  }
})

goToBookDetails.addEventListener("click", async() => {
  let category = cleanedLoanData.category;
  let bookId = cleanedLoanData.bookDatabaseId
  const result = await getDetailedBook(category, bookId)
  if(result.con){
    let detailedBook = {
      id: bookId,
      category
    }
    sessionStorage.setItem("bookId", JSON.stringify(detailedBook))
    window.navigationApi.toAnotherPage("./books/viewBook/viewBook.html")
  }else{
    window.showMessageApi.alertMsg("Book has already been deleted")
  }
})