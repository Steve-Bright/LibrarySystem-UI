import Book from "../../utils/book.model.mjs"
import { getDetailedBook, deleteBook, editBook, getLatestLoanFunction } from "../../controllers/book.controller.js"
import { convertEngToMM, convertMMToEng } from "../../utils/burmese.mapper.js"
import { bookUIMapping } from "../../utils/book.mapper.js"
import {loanMappingInBook} from "../../utils/loan.mapper.js"
import { capitalizeFirstLetter } from "../../utils/extra.js"

const loanArea = document.getElementById("loanArea")
const isbnViewArea = document.getElementById("viewIsbnArea")
const viewBookCover = document.getElementById("viewBookCover")
const editButtonsArea = document.getElementById("editButtonsArea")
const filePath = window.imagePaths.shareFilePath();
const backToCollection = document.getElementById("backToCollection")
const deleteBookButton = document.getElementById("deleteBookButton")
const editBookButton = document.getElementById("editBookButton")
const borrowBookButton = document.getElementById("borrowBookButton")
const imagePreviewArea = document.getElementById("imagePreviewArea")
const viewBookForm = document.getElementById("viewBookForm")
const loanHistory = document.getElementById("loanHistory")
const accNoInput = document.getElementById('accNo')
const classInput = document.getElementById("classNo")
const initialInput = document.getElementById("initial")
const callNoInput = document.getElementById("callNo")
const loanedPeriod = document.getElementById("loanPeriod")
const loanedMember = document.getElementById("memberName")
const loanedMemberNum = document.getElementById("phoneNumber")
const viewLoanDetail = document.getElementById("viewLoanButton")

let detailedBook = JSON.parse(sessionStorage.getItem("bookId"))
const bookData = await getDetailedBook(detailedBook.category, detailedBook.id)
const loanedData = await getLatestLoanFunction(detailedBook.category, detailedBook.id)
let cleanedLoanData = loanMappingInBook(loanedData.result)
let cleanedBookData = bookUIMapping(bookData.result)
backToCollection.addEventListener("click", () => {
    window.navigationApi.toAnotherPage("./books/collection/collectionpage.html")
})

deleteBookButton.addEventListener("click", () => {
    window.showMessageApi.confirmMsg("Do you really want to delete?")
})

editBookButton.addEventListener("click", () => {
    updateBookUi();
})

loanHistory.addEventListener("click", () => {
    window.navigationApi.toAnotherPage("./books/loanHistory/loanHistory.html")
})

 window.showMessageApi.dialogResponse(async(event, response) =>{
    if(!response){
        const result = await deleteBook(detailedBook.category, detailedBook.id)
        window.showMessageApi.alertMsg(result.msg)
        window.navigationApi.toAnotherPage("./books/collection/collectionpage.html")
    }
})

isbnViewArea.innerHTML = ``
if(cleanedBookData["category"] == "english"){
  isbnViewArea.innerHTML = `
              <label for="isbn">ISBN</label>
              <input type="text" id="isbn" name="isbn" class="viewBookFormat">
              `
}
const viewInputs = document.querySelectorAll("#viewBookForm input, #viewBookForm textarea, #includeCD")
    let index = 0; 

let accNo;
let classNo;
let callNo;
Object.keys(cleanedBookData).forEach((eachKey) => {
    for(let eachInput of viewInputs){
        if(eachKey == "category" && eachInput.id == "category"){
            viewInputs[index].value = capitalizeFirstLetter(cleanedBookData[eachKey]);
            if(cleanedBookData[eachKey] == "myanmar"){ 
                accNo = convertEngToMM(cleanedBookData["accNo"], true)
                classNo = convertEngToMM(cleanedBookData["classNo"])
                callNo = convertEngToMM(cleanedBookData["callNo"], true)
            }else{
                accNo = cleanedBookData["accNo"]
                classNo = cleanedBookData["classNo"]
                callNo = cleanedBookData["callNo"]
            }
            index++
        }
        else if(eachInput.id == eachKey){
            if(eachKey == "accNo" && eachInput.id == "accNo"){
                eachInput.value = accNo;
            }else if(eachKey == "classNo" && eachInput.id == "classNo"){
                eachInput.value = classNo;
            }else if(eachKey == "callNo" && eachInput.id == "callNo"){
                eachInput.value = callNo;
            }else{
                eachInput.value = cleanedBookData[eachKey]
            }
        }
    }
    if(eachKey == "bookCover"){
        viewBookCover.src=filePath + cleanedBookData[eachKey]
                   
    }
})

console.log('due date  ' + cleanedLoanData.dueDate)

if(loanedData.con){
    loanedPeriod.textContent = (new Date(cleanedLoanData.dueDate)).toDateString()
    loanedMember.textContent = cleanedLoanData.name
    loanedMemberNum.textContent = cleanedLoanData.phone
    loanArea.classList.remove("removedArea")
    loanArea.classList.add("loanedBanner")
    
    if(cleanedLoanData.overdue){
        loanArea.classList.add("overduedLoan")
    }else{
        loanArea.classList.add("defaultLoan")
    }

    viewLoanDetail.addEventListener("click", () => {
        let detailedLoan = {
            id: cleanedLoanData._id
          }
          sessionStorage.setItem("loanId", JSON.stringify(detailedLoan))
          window.navigationApi.toAnotherPage("./loans/viewLoan/viewLoan.html")    
    })
}

borrowBookButton.addEventListener("click", () => {
    localStorage.setItem("borrowBook", JSON.stringify(bookData.result))
    window.navigationApi.toAnotherPage("./loans/addLoan/addLoan.html")
})


function updateBookUi(){
    let editedBook = new Book({
        category: detailedBook.category,
        bookId: detailedBook.id
    })
    delete editedBook.loanStatus;
    delete editedBook.barcode;
    const bookModification = document.getElementById("bookModification")
    uiTransform(bookModification);
    updateButtonFunctionality(bookModification)

    viewInputs.forEach((eachInput) => {
        eachInput.addEventListener("input", () => {
            editedBook[eachInput.id] = eachInput.value
        })

        autogenerateCallNo(accNoInput, initialInput, classInput, callNoInput, editedBook)
    })

    viewBookForm.addEventListener("keydown", (e) => {
        if(e.key == "Enter"){
            e.preventDefault()
        }
    })

    viewBookForm.addEventListener("submit", async(e) => {  
        e.preventDefault()     
        if(document.getElementById("bookCover")){
            editedBook.editedPhoto = true;
            editedBook.bookCover = bookCover.files[0]
        }

        const formData = new FormData()

        if(editedBook.category == "myanmar"){
            console.log("this condition is burmese " + JSON.stringify(editedBook))
            if(editedBook.accNo){
                editedBook.accNo = convertMMToEng(editedBook.accNo, true)
            }
            if(editedBook.callNo){
                editedBook.callNo = convertMMToEng(editedBook.callNo, true)
            }
            if(editedBook.classNo){
                editedBook.classNo = convertMMToEng(editedBook.classNo)
            }
        }
    
        for(let key in editedBook){
            if(editedBook.hasOwnProperty(key)){
                if(editedBook[key] !== undefined){
                    formData.append(key, editedBook[key])
                }
            }
        }

        const result = await editBook(formData)
        window.showMessageApi.alertMsg(result.msg)
        window.location.reload()
    })
}

function uiTransform(bookModification){
    editButtonsArea.innerHTML = `
        <button type="button" id="cancelEditButton">Cancel</button>
        <button type="submit">Save</button>
    `

    viewInputs.forEach((eachInput) => {
        eachInput.classList.remove("viewBookFormat")
        eachInput.classList.add("addBookFormat")
    })

    const removeImageButton = document.createElement("button");
    removeImageButton.id = "removeImage";
    removeImageButton.textContent = "Remove Image";
    bookModification.appendChild(removeImageButton)

    //making sure that category cannot be edited. 
    viewInputs[0].style.pointerEvents = "none"
    viewInputs[0].style.backgroundColor = "#D9D9D9"
}

function updateButtonFunctionality(bookModification){
    const cancelButton = document.getElementById("cancelEditButton")
    cancelButton.addEventListener("click", () => {
        window.location.reload()
    })

    const removeImageBtn = document.getElementById("removeImage")
    removeImageBtn.addEventListener("click", () => {
        viewBookCover.remove()
        bookModification.innerHTML = `
            <input type="file" id="bookCover" name="bookCover" class="addBookFormat">
        `
        const bookCover = document.getElementById("bookCover")
        bookCover.addEventListener("change", (e) => {
            let editedBookCover = bookCover.files[0]
            if(editedBookCover){
                let image = window.URL.createObjectURL(editedBookCover)
                imagePreviewArea.innerHTML = `
                    <img src=${image} alt="Book Cover" id="viewBookCover">
                `
            }
        })
    })
}

function autogenerateCallNo(accNoInput, initialInput, classInput, callNoInput, book){

    let accNoValue = accNoInput.value
    let initialValue = initialInput.value;
    let classNoValue = classInput.value;
      
    accNoInput.addEventListener("input", () => {
        accNoValue = accNoInput.value;
        triggerCallNumber()
    })
      
    initialInput.addEventListener("input", () => {
        initialValue = initialInput.value
        triggerCallNumber()
    })
      
    classInput.addEventListener("input", () => {
        classNoValue = classInput.value;
        triggerCallNumber()
    })
      
    function triggerCallNumber(){
        callNoInput.value = accNoValue + " " + initialValue + " " + classNoValue
        book["callNo"] = callNoInput.value
    }
        
}