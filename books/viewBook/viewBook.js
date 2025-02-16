import Book from "../../utils/book.model.mjs"
import { getDetailedBook, deleteBook, editBook } from "../../controllers/book.controller.js"
import { bookUIMapping } from "../../utils/book.mapper.js"
import { capitalizeFirstLetter } from "../../utils/extra.js"

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

let detailedBook = JSON.parse(sessionStorage.getItem("bookId"))
const bookData = await getDetailedBook(detailedBook.category, detailedBook.id)
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
const viewInputs = document.querySelectorAll("#viewBookForm input, #viewBookForm textarea")
    let index = 0; 
        
Object.keys(cleanedBookData).forEach((eachKey) => {
    for(let eachInput of viewInputs){
        if(eachKey == "category" && eachInput.id == "category"){
            viewInputs[index].value = capitalizeFirstLetter(cleanedBookData[eachKey]);
            index++
        }
        else if(eachInput.id == eachKey){
            eachInput.value = cleanedBookData[eachKey] ? cleanedBookData[eachKey] : "-"
        }
    }
    if(eachKey == "bookCover"){
        viewBookCover.src=filePath + cleanedBookData[eachKey]
                   
    }
})

borrowBookButton.addEventListener("click", () => {
    console.log("book data" + bookData)
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
    })

    viewBookForm.addEventListener("submit", async(e) => {  
        e.preventDefault()     
        if(document.getElementById("bookCover")){
            editedBook.editedPhoto = true;
            editedBook.bookCover = bookCover.files[0]
        }

        const formData = new FormData()
    
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