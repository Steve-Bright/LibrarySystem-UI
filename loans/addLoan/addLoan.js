import { addLoanFunction } from "../../controllers/loan.controller.js";
import Book from "../../utils/book.model.mjs";
import Loan from "../../utils/loan.model.mjs";
import Member from "../../utils/member.model.js";
const addMemberArea = document.getElementById('addMemberArea')
const addBookArea = document.getElementById("addBookArea")
const borrowBtn = document.getElementById("borrowBtn")
const searchMember = document.getElementById("searchMember")
const searchBook = document.getElementById("searchBook")
const clearLoan = document.getElementById("clearLoan")
const filePath = window.imagePaths.shareFilePath();
const currentFile = window.imagePaths.shareCurrentFile();

let borrowMember = localStorage.getItem("borrowMember")
borrowMember = JSON.parse(borrowMember)
let borrowBook = localStorage.getItem("borrowBook")
borrowBook = JSON.parse(borrowBook)

if(borrowMember){
    addMemberArea.classList.add("borrowBookDesign")
    addMemberArea.innerHTML = `
        <div id="memberHeading">
          <div>
             <h3>Member Info </h3>
          </div>
          <span id="goToMemberDetails">Details</span>
        </div>
        <br>
        
        <div id="memberContents">
            <div id="memberCover">
                <img src=${filePath + borrowMember.photo} id="memberPhotoSize">
            </div>

            <div id="memberDetailInfo">
                
              <div>
                <label for="memberId">Member Id</label>
                <input type="text" value="${borrowMember.memberId}" readonly>
              </div>
                <br>

              <div>
                <label for="memberName">Name</label>
                <input type="text" value="${borrowMember.name}" readonly>
              </div>
                <br>

              <div>
                <label for="memberType">Member Type </label>
                <input type="text" value="${borrowMember.memberType}" readonly>
              </div>
                <br>
              
              <div>
                <label for="memberPhone">Phone</label>
                <input type="text" value="${borrowMember.phone}" readonly>
              </div>
            </div>
        </div>
    `
    const goToMemberDetailsBtn = document.getElementById("goToMemberDetails")
    if(goToMemberDetailsBtn){
        goToMemberDetailsBtn.addEventListener("click", () => {
            sessionStorage.setItem("memberId", JSON.stringify({id: borrowMember._id}))
            window.navigationApi.toAnotherPage("./members/viewMember/viewMember.html")
        })
    }
}

if(borrowBook){
  addBookArea.classList.add("borrowBookDesign")
  addBookArea.innerHTML = `
      <div id="bookHeading">
        <div>
          <h2>Book Info</h2>
        </div>
        <span id="goToBookDetails">Details</span>
      </div>
      <br>
      
      <div id="bookContents">
          <div id="bookCover">
              <img src=${filePath + borrowBook.bookCover} id="bookCoverSize">
          </div>

          <div id="bookDetailInfo">
              
            <div>
              <label for="bookCategory">Category</label>
              <input type="text" value="${borrowBook.category}" readonly>
            </div>
              <br>

            <div>
              <label for="callNo">Call No </label>
              <input type="text" value="${borrowBook.callNo}" readonly>
            </div>

              <br>
            <div>
              <label for="bookTitle">Book Title </label>
              <input type="text" value="${borrowBook.bookTitle}" readonly>
            </div>
          </div>
      </div>
      
  `
  const goToBookDetailsBtn = document.getElementById("goToBookDetails")
  if(goToBookDetailsBtn){
      goToBookDetailsBtn.addEventListener("click", () => {
          let detailedBook = {
            id: borrowBook._id,
            category: borrowBook.category
          }
          sessionStorage.setItem("bookId", JSON.stringify(detailedBook))
          window.navigationApi.toAnotherPage("./books/viewBook/viewBook.html")
      })
  }
  
}


searchMember.addEventListener("click", () => {
  let windowFeatures = {
      "width":794,
      "height":400

  }
  let data = {
      "fileName": currentFile+"./loans/addLoan/searchMembers.html",
      "name": "Search Member",
      "windowFeatures": windowFeatures
  }
  window.navigationApi.openWindow(data);
  document.close()
})

searchBook.addEventListener("click", () => {
  let windowFeatures = {
      "width":794,
      "height":400

  }
  let data = {
      "fileName": currentFile+"./loans/addLoan/searchBooks.html",
      "name": "Search Book",
      "windowFeatures": windowFeatures,
  }
  
  window.navigationApi.openWindow(data);
})

clearLoan.addEventListener("click", () => {
  localStorage.removeItem("borrowBook")
  localStorage.removeItem("borrowMember")
  window.showMessageApi.alertMsg("Cleared!")
  window.location.reload()
})