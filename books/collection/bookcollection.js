import {getAllBooksFunction, searchBook} from "../../controllers/book.controller.js"
import {buildCollectionNavigation} from "../../utils/extra.js"
import { convertMMToEng, convertEngToMM } from "../../utils/burmese.mapper.js"
const collectionCategory = document.getElementById("collectionCategory")
const searchBookForm = document.getElementById("searchBookForm")
const callNoBtn = document.getElementById('callNoBtn')
const addBookBtn = document.getElementById("addBookBtn")
const totalData = document.getElementById("totalData")
const collectionNavigationArea = document.getElementById("collectionNavigationArea")
const bookDataHeadings = document.getElementById("bookDataHeadings")
const bookDataEl = document.getElementById("bookData")
const filePath = window.imagePaths.shareFilePath();

let searchedHistory = sessionStorage.getItem("searchResult")
let searchedKeyword = sessionStorage.getItem("searchData")
let index = 1;
let category = cacheCategory();
collectionCategory.value = category;
await searchBookFunction(category)

if(!searchedHistory){
    updateBookData(category)
}else{
    placeItemsInSearchForm(searchedKeyword)
    showSearchResults(category, searchedHistory)
}


collectionCategory.addEventListener("change", () => {
  updateBookData(collectionCategory.value)
})

callNoBtn.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./books/bookCallNo.html")
})

addBookBtn.addEventListener("click", ()=> {
  window.navigationApi.toAnotherPage("./books/addBook/addBook.html")
})

function placeItemsInSearchForm(searchedCache){
    searchedCache = JSON.parse(searchedCache)
    searchBookForm.bookTitleInput.value = searchedCache.bookTitle
    searchBookForm.accNoInput.value = searchedCache.accNo
    searchBookForm.authorInput.value = searchedCache.sor
    searchBookForm.publisherInput.value = searchedCache.publisher
    searchBookForm.classNoInput.value = searchedCache.classNo
    searchBookForm.isbnInput.value = searchedCache.isbn
}

async function updateBookData(booleanValue, page = 1){
    category = booleanValue
    let categoryData = cacheCategory(booleanValue);
    let result = await getAllBooksFunction(categoryData, page)
    updateBookHeading(categoryData)

    let totalLength = result.result.totalItems;
    let totalPages = result.result.totalPages;
    totalData.innerHTML = `Books (${totalLength})`

    
    if(totalPages > 1) {
        if(page == 1){
            buildCollectionNavigation(collectionNavigationArea, false, true, index, categoryData, updateBookData, updateNewIndex)
        }else if(page === totalPages){
            buildCollectionNavigation(collectionNavigationArea, true, false, index, categoryData, updateBookData, updateNewIndex)
        }else{
            buildCollectionNavigation(collectionNavigationArea, true, true, index, categoryData, updateBookData, updateNewIndex)
        }
    }else{
        buildCollectionNavigation(collectionNavigationArea, false, false, index, categoryData, updateBookData, updateNewIndex)
    }

    
    let totalBookData = result.result.items;
   
    if (totalBookData.length > 0 ){   
        bookDataEl.innerHTML= ``
        showEachBook(bookDataEl, totalBookData)
        // viewDetailedBookFunction(categoryData)
    }else{
        bookDataEl.innerHTML = `
            <tr> <td colspan="7"> There are no books at the moment </td> </tr>
        `
    }
    
}

function showSearchResults(category, searchedHistory){
    updateBookHeading(category)
    searchedHistory = JSON.parse(searchedHistory)
    totalData.innerHTML = `Books Found (${searchedHistory.length})`
    if(searchedHistory.length != 0){
        bookDataEl.innerHTML = ``
        showEachBook(bookDataEl, searchedHistory)
    }else{
        bookDataEl.innerHTML = `
            <tr> <td colspan="7">Book is not found </td> </tr>
        `
    }
    
    // let searchResults = 
}

function showEachBook(placerDiv, bookData){
    for(let eachBook of bookData){
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
            placerDiv.appendChild(newRow)    
            
        viewDetailedBookFunction(category)
    }
}

searchBookForm.addEventListener("reset", () => {
    sessionStorage.removeItem("searchResult")
    window.location.reload()
})

async function searchBookFunction(categoryData){
    searchBookForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        let searchData = {
            category: categoryData,
            bookTitle: e.target.bookTitleInput.value,
            accNo: e.target.accNoInput.value,
            sor: e.target.authorInput.value,
            publisher: e.target.authorInput.value,
            classNo: e.target.classNoInput.value,
            isbn: e.target.isbnInput.value
        }
        sessionStorage.setItem("searchData", JSON.stringify(searchData))
        const result = await searchBook(searchData)
        if(!result){
            sessionStorage.setItem("searchResult", "[]")
            
        }else{
            sessionStorage.setItem("searchResult", JSON.stringify(result))
        }
        
        window.location.reload()
    })
}

function updateNewIndex(newIndex){
  index = newIndex;
}

function cacheCategory(booleanValue = null){
    if(booleanValue !== null){
        sessionStorage.setItem("category", booleanValue)
    }
    
    let cachedCategoryValue = sessionStorage.getItem("category")
    if(cachedCategoryValue === null){
        return "english";
    }
    return cachedCategoryValue; 
}

function updateBookHeading(categoryData){
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
}

function viewDetailedBookFunction(category){
    const detailedButtons = document.querySelectorAll(".detailedBook")
    detailedButtons.forEach((eachButton) => {
        eachButton.addEventListener("click", async () => {
            let detailedBook = {
                id: eachButton.id,
                category: category
            }
            sessionStorage.setItem("bookId", JSON.stringify(detailedBook))
            window.navigationApi.toAnotherPage("./books/viewBook/viewBook.html")
        })
    })
}