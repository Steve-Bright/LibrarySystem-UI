import { getDetailedBook, deleteBook } from "../../controllers/book.controller.js"
import { bookUIMapping } from "../../utils/book.mapper.js"
import { capitalizeFirstLetter } from "../../utils/extra.js"

const isbnViewArea = document.getElementById("viewIsbnArea")
const viewBookCover = document.getElementById("viewBookCover")
const viewBookForm = document.getElementById("viewBookForm")
const editButtonsArea = document.getElementById("editButtonsArea")
const filePath = window.imagePaths.shareFilePath();
const backToCollection = document.getElementById("backToCollection")
const deleteBookButton = document.getElementById("deleteBookButton")
const editBookButton = document.getElementById("editBookButton")
const viewInputs = document.querySelectorAll("#viewBookForm input, #viewBookForm textarea")

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
              <input type="text" id="isbn" name="isbn" class="uneditable">
              `
}

    let index = 0; 
        
Object.keys(cleanedBookData).forEach((eachKey) => {
    if(eachKey == "bookCover"){
        viewBookCover.src=filePath + cleanedBookData[eachKey]
                   
    }else if(eachKey == "isbn"){
        const isbnInput = document.getElementById("isbn")
        isbnInput.value = cleanedBookData[eachKey]
        index++
    }else if(eachKey == "category"){
        viewInputs[index].value = capitalizeFirstLetter(cleanedBookData[eachKey]);
        index++
    }
    else{
        viewInputs[index].value = cleanedBookData[eachKey] ? cleanedBookData[eachKey] : "-"
        index++
    }
})

function updateBookUi(triggerUpdateUi = true){
    // const categoryChoose = document.getElementById("categoryDiv")
    // categoryChoose.innerHTML = `
    // `

    editButtonsArea.innerHTML = `
        <button type="button" id="cancelEditButton">Cancel</button>
        <button type="submit">Save</button>
    `

    //make each input editable
    viewInputs.forEach((eachInput) => {
        eachInput.classList.remove("uneditable")
    })
}
        