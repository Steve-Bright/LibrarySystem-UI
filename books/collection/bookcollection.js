import {getAllBooksFunction, searchBook} from "../../controllers/book.controller.js"
import {buildCollectionNavigation, buildNavArea} from "../../utils/extra.js"
import { convertMMToEng, convertEngToMM } from "../../utils/burmese.mapper.js"
import { dotImages } from "../../utils/extra.js"
import { todayDate } from "../../utils/extra.js"
const collectionCategory = document.getElementById("collectionCategory")
const searchBookForm = document.getElementById("searchBookForm")
const callNoBtn = document.getElementById('callNoBtn')
const addBookBtn = document.getElementById("addBookBtn")
const totalData = document.getElementById("totalData")
const collectionNavigationArea = document.getElementById("collectionNavigationArea")
const pageIndex = document.getElementById("pageIndex")
const totalPagesUI = document.getElementById("totalPages")
const navAreaBook = document.getElementById("navAreaBook")
const collectionBackward = document.querySelectorAll(".collectionBackward")
const collectionForward = document.querySelectorAll(".collectionForward")
const buttonsForward = document.getElementById("buttonsForward")
const buttonsBackward = document.getElementById("buttonsBackward")
const bookDataHeadings = document.getElementById("bookDataHeadings")
const navigationButtons = document.getElementById('navigationButtons')
const bookDataEl = document.getElementById("bookData")
const filePath = window.imagePaths.shareFilePath();

let searchedHistory = sessionStorage.getItem("searchBookResult")
let searchedKeyword = sessionStorage.getItem("searchBookData")
let index = Number(cachePageIndex())
let category = cacheCategory();
collectionCategory.value = category;
await searchBookFunction(category)

if(!searchedHistory){
    updateBookData(category, index)
}else{
    placeItemsInSearchForm(category, searchedKeyword)
    showSearchResults(category, searchedHistory)
}


collectionCategory.addEventListener("change", () => {
  updateBookData(collectionCategory.value)
})

callNoBtn.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./books/callNumber/bookCallNo.html")
})

addBookBtn.addEventListener("click", ()=> {
  window.navigationApi.toAnotherPage("./books/addBook/addBook.html")
})

function placeItemsInSearchForm(categoryData, searchedCache){
    searchedCache = JSON.parse(searchedCache)
    let searchedAccNo;
    if(categoryData == "myanmar"){
        searchedAccNo = convertEngToMM(searchedCache.accNo, true)
    }else{
        searchedAccNo = searchedCache.accNo
    }
    searchBookForm.bookTitleInput.value = searchedCache.bookTitle
    searchBookForm.accNoInput.value = searchedAccNo
    searchBookForm.authorInput.value = searchedCache.sor
    searchBookForm.publisherInput.value = searchedCache.publisher
    searchBookForm.subjectInput.value = searchedCache.subject
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

    let navigationComponents = {
        resultPages: {totalPages, index, navigationButtons},
        collectionNavigation: {collectionBackward, collectionForward},
        pageValues: {pageIndex, totalPagesUI},
        category: categoryData,
        updateFunction: updateBookData
    }
    buildNavArea(navigationComponents)

    
    let totalBookData = result.result.items;
   
    if (totalBookData.length > 0 ){   
        bookDataEl.innerHTML= ``
        showEachBook(bookDataEl, totalBookData)
        // viewDetailedBookFunction(categoryData)
    }else{
        bookDataEl.innerHTML = `
            <tr> <td colspan="8"> There are no books at the moment </td> </tr>
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
            <tr> <td colspan="8">Book is not found </td> </tr>
        `
    }
    
    // let searchResults = 
}

function showEachBook(placerDiv, bookData){

    for(let eachBook of bookData){
        let imageCondition = ``;
        if(eachBook.loanStatus == true){
            if(eachBook.latestLoanId.overdue){
                imageCondition = `<img src=${dotImages.red_dot} class="dotSize"></img>`
            }else{
                let bookDueDate = new Date(eachBook.latestLoanId.dueDate)
                if(bookDueDate.toDateString() === new Date(todayDate()).toDateString() || bookDueDate.toDateString() === new Date(todayDate(1)).toDateString()){
                    imageCondition = `<img src=${dotImages.orange_dot} class="dotSize"></img>`
                }else{
                    imageCondition = `<img src=${dotImages.green_dot} class="dotSize"></img>`
                }
            }
        }
        let accNo;
        let classNo;
        if(!eachBook.isbn){
            accNo = convertEngToMM(eachBook.accNo, true)
            classNo = convertEngToMM(eachBook.classNo, true)
            placerDiv.classList.remove("englishSize")
            placerDiv.classList.add("burmeseSize")
        }else{
            accNo = eachBook.accNo
            classNo = eachBook.classNo
            placerDiv.classList.remove("burmeseSize")
            placerDiv.classList.add("englishSize")
        }
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
                <td>${imageCondition}</td>
                <td>${accNo}</td>
                <td><img src="${imagePath}" class="displayBookCover"></td> 
                <td>${eachBook.bookTitle}</td>
                <td>${eachBook.sor}</td>
                <td>${classNo}</td>
                ${conditionalCell}
                <td><button class="detailedBook" id="${eachBook._id}">View Details</button></td>
            `
            placerDiv.appendChild(newRow)    
            
        viewDetailedBookFunction(category)
    }
}

searchBookForm.addEventListener("reset", () => {
    sessionStorage.removeItem("searchBookData")
    sessionStorage.removeItem("searchBookResult")
    window.location.reload()
})

async function searchBookFunction(categoryData){
    searchBookForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        let searchData = {
            category: categoryData,
            bookTitle: e.target.bookTitleInput.value,
            accNo: convertMMToEng(e.target.accNoInput.value, true),
            sor: e.target.authorInput.value,
            publisher: e.target.authorInput.value,
            subject: e.target.subjectInput.value,
            isbn: e.target.isbnInput.value
        }
        sessionStorage.setItem("searchBookData", JSON.stringify(searchData))
        const result = await searchBook(searchData)
        if(!result){
            sessionStorage.setItem("searchBookResult", "[]")
            
        }else{
            sessionStorage.setItem("searchBookResult", JSON.stringify(result))
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

function cachePageIndex(indexValue = null){
    if(indexValue !== null){
        sessionStorage.setItem("pageIndex", indexValue)
    }
    let cachedPageIndexValue = sessionStorage.getItem("pageIndex")
    if(cachedPageIndexValue === null){
        return 1;
    }
    return cachedPageIndexValue;
}

function updateBookHeading(categoryData){
    if(categoryData == "english"){
        bookDataHeadings.innerHTML = `
            <tr>
                <th class="dotFormat"></th>
                <th>Acc No.</th>
                <th class="headingCoverFormat">Book Cover</th>
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
                <th class="dotFormat"></th>
                <th>Acc No.</th>
                <th class="headingCoverFormat">Book Cover</th>
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