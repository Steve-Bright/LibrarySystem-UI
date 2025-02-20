import { deleteLoanFunction, extendLoanFunction, getDetailedLoanFunction, returnLoanFunction } from "../../controllers/loan.controller.js";
import { loanMap } from "../../utils/loan.mapper.js";
import Book from "../../utils/book.model.mjs";
import Loan from "../../utils/loan.model.mjs";
import Member from "../../utils/member.model.js";
const backToCollection = document.getElementById("backToCollection");
const filePath = window.imagePaths.shareFilePath();
let detailedLoan = JSON.parse(sessionStorage.getItem("loanId"))
const memberContentsInputs = document.querySelectorAll("#memberDetailInfo input")
const memberPhotoPlace = document.getElementById("memberPhotoSize")
const bookContentsInputs = document.querySelectorAll("#bookDetailInfo input")
const bookCoverPlace = document.getElementById("bookCoverSize")
const loanContentsInput = document.querySelectorAll("#loanDetailInfo input")
const deleteLoanBtn = document.getElementById("deleteLoanBtn")
const extendLoanBtn = document.getElementById("extendLoanBtn")
const returnLoanBtn = document.getElementById("returnLoanBtn")

const loanData = await getDetailedLoanFunction(detailedLoan.id)
let cleanedLoanMemberData = loanMap.loanMemberMapping(loanData.result.memberId)
let cleanedLoanBookData = loanMap.loanBookMapping(loanData.result.bookId)
let cleanedLoanDetailData = loanMap.loanDetailMapping(loanData.result)

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
  } 
})

getMemberData()
getBookData()
getLoanData()

function getMemberData(){
  Object.keys(cleanedLoanMemberData).forEach((eachKey) => {
    for(let eachInput of memberContentsInputs){
      if(eachInput.id == eachKey){
        eachInput.value = cleanedLoanMemberData[eachKey] ? cleanedLoanMemberData[eachKey] : "-"
      }
    }

    if(eachKey === "photo"){
      memberPhotoPlace.src = filePath + cleanedLoanMemberData[eachKey]
    }
  })
  
  if(cleanedLoanMemberData.block){
    const bannedOrNot = document.getElementById("bannedOrNot");
      bannedOrNot.classList.remove("notBanned");
      bannedOrNot.classList.add("bannedArea")
  }
}

function getBookData(){
  Object.keys(cleanedLoanBookData).forEach((eachKey) => {
    for(let eachInput of bookContentsInputs){
      if(eachInput.id == eachKey){
      eachInput.value = cleanedLoanBookData[eachKey] ? cleanedLoanBookData[eachKey] : "-"
      }

    }

    if(eachKey === "bookCover"){
      bookCoverPlace.src = filePath + cleanedLoanBookData[eachKey]
    }
  })
  
}

function getLoanData(){
  Object.keys(cleanedLoanDetailData).forEach((eachKey) => {
    for(let eachInput of loanContentsInput){
      if(eachInput.id == eachKey){
        eachInput.value = cleanedLoanDetailData[eachKey] ? cleanedLoanDetailData[eachKey] : "-"
      }
    }
  })
}