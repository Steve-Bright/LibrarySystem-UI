import {getAllBooksFunction} from "../../controllers/book.controller.js"
import {buildCollectionNavigation} from "../../utils/extra.js"
import { convertMMToEng, convertEngToMM } from "../../utils/burmese.mapper.js"
const collectionCategory = document.getElementById("collectionCategory")
const callNoBtn = document.getElementById('callNoBtn')
const addBookBtn = document.getElementById("addBookBtn")
const totalData = document.getElementById("totalData")
const collectionNavigationArea = document.getElementById("collectionNavigationArea")
const bookDataHeadings = document.getElementById("bookDataHeadings")
const bookDataEl = document.getElementById("bookData")
const filePath = window.imagePaths.shareFilePath();

let index = 1;
let category = true
updateBookData(category)

collectionCategory.addEventListener("change", () => {
  category = !category;
  updateBookData(category)
})

callNoBtn.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./books/bookCallNo.html")
})

addBookBtn.addEventListener("click", ()=> {
  window.navigationApi.toAnotherPage("./books/addBook/addBook.html")
})

async function updateBookData(booleanValue, page = 1){
    let categoryData = booleanValue ? "english" : "myanmar"; 
    let result = await getAllBooksFunction(categoryData, page)
    if(categoryData == "english"){
        bookDataHeadings.innerHTML = `
            <tr>
                <th>Acc No.</th>
                <th>Book Cover</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Class No</th>
                <th>ISBN</th>
                <th>Publisher</th>
                <th></th>
            </tr>
        `
    }else if(categoryData == "myanmar"){
        bookDataHeadings.innerHTML = `
            <tr>
                <th>Acc No.</th>
                <th>Book Cover</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Class No</th>
                <th colspan="2">Publisher</th>
                <th></th>
            </tr>
        `
    }

    let totalLength = result.result.totalItems;
    let totalPages = result.result.totalPages;
    totalData.innerHTML = `Books (${totalLength})`

    
    if(totalPages > 1) {
        if(page == 1){
            buildCollectionNavigation(collectionNavigationArea, false, true, index, category, updateBookData, updateNewIndex)
        }else if(page === totalPages){
            buildCollectionNavigation(collectionNavigationArea, true, false, index, category, updateBookData, updateNewIndex)
        }else{
            buildCollectionNavigation(collectionNavigationArea, true, true, index, category, updateBookData, updateNewIndex)
        }
    }else{
        buildCollectionNavigation(collectionNavigationArea, false, false, index, category, updateBookData, updateNewIndex)
    }

    
    let totalBookData = result.result.items;
   
    if (totalBookData.length > 0 ){   
        bookDataEl.innerHTML= ``
        totalBookData.forEach((eachBook) => {
            console.log("each book publisher " + eachBook.publisher)
            let conditionalCell = eachBook.isbn 
                ? `
                <td>${eachBook.isbn}</td>
                <td>${eachBook.publisher || "-"}</td>
                `
                : `
                <td colspan="2">${eachBook.publisher || "-"}</td>` 
            
            const newRow = document.createElement("tr")
            let imagePath = filePath + eachBook.bookCover
            newRow.innerHTML = 
                `
                    <td>${eachBook.accNo}</td>
                    <td><img src="${imagePath}" class="displayBookCover"></td> 
                    <td>${eachBook.bookTitle}
                    <td>${eachBook.sor}</td>
                    <td>${eachBook.classNo}</td>
                    ${conditionalCell}
                    <td><button class="detailedBook" id="${eachBook._id}">View Details</button></td>
                `
            bookDataEl.appendChild(newRow)
            
        });
        viewDetailedBookFunction(categoryData)
    }else{
        bookDataEl.innerHTML = `
            <tr> <td colspan="7"> There are no books at the moment </td> </tr>
        `
    }
    
}

function updateNewIndex(newIndex){
  index = newIndex;
}

function viewDetailedBookFunction(category){
    const detailedButtons = document.querySelectorAll(".detailedBook")
    detailedButtons.forEach((eachButton) => {
        eachButton.addEventListener("click", async () => {
            sessionStorage.setItem("bookId", eachButton.id)
            window.navigationApi.toAnotherPage("./books/viewBook/viewBook.html")
        })
    })
}