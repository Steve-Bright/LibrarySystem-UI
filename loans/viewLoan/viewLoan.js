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
const loanData = await getDetailedLoanFunction(detailedLoan.id)
let cleanedLoanMemberData = loanMap.loanMemberMapping(loanData.result.memberId)
let cleanedLoanBookData = loanMap.loanBookMapping(loanData.result.bookId)
let cleanedLoanDetailData = loanMap.loanDetailMapping(loanData.result)


console.log("this is loan book; "+ JSON.stringify(cleanedLoanBookData))
console.log("this is loandetail; " + JSON.stringify(cleanedLoanDetailData))
backToCollection.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./loans/allLoans/loanpage.html")
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