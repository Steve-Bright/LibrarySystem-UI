import Book from "../utils/book.model.mjs"
import {addBookFunction, getAllBooksFunction} from "../controllers/book.controller.js"

const addBookBtn = document.getElementById("addBookBtn")
const backToCollection = document.getElementById("backToCollection")
const addBookFormEl = document.getElementById("addBookForm")
const bookDataEl = document.getElementById("bookData")
const collectionCategory = document.getElementById("collectionCategory")
const bookDataHeadings = document.getElementById("bookDataHeadings")
const categorySelect = document.getElementById("category")
const filePath = window.imagePaths.shareFilePath();
const collectionNavigationArea = document.getElementById("collectionNavigationArea")

const totalData = document.getElementById("totalData")

let category = true
let addBookCategory = true;
let index = 1;


if(bookDataHeadings){
    updateBookData(category)
}

if(collectionCategory){
    collectionCategory.addEventListener("change", () => {
        category = !category;
        updateBookData(category)
    })
}

if(categorySelect){
    const isbnArea = document.getElementById("isbnArea");
    categorySelect.addEventListener("change", () => {
        addBookCategory = !addBookCategory
        toggleISBN(addBookCategory)
    })

    toggleISBN(addBookCategory)

    function toggleISBN(addCategory){
        let addingBook = addCategory? "english": "myanmar"
        if(addingBook == "myanmar"){
            isbnArea.innerHTML = ``;
        }else if(addingBook == "english"){
            isbnArea.innerHTML = `
            <label for="isbn">ISBN</label>
                    <input type="text" id="isbn" name="isbn" required>
                    <br>`
        }
    }
}

if(addBookBtn){
    addBookBtn.addEventListener("click", ()=> {
        window.navigationApi.toAnotherPage("addBook.html")
    })
}

if(backToCollection){
    backToCollection.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("collectionpage.html")
    })
}

if(addBookFormEl){
    addBookFormEl.addEventListener("submit", async(e)=> {
        e.preventDefault();
        const myBook = new Book({
            bookCover: document.getElementById("bookCover").files[0],
            category: e.target.category.value,
            accNo: e.target.accNo.value,
            bookTitle: e.target.bookTitle.value,
            initial: e.target.initial.value,
            classNo: e.target.classNo.value,
            callNo: e.target.callNo.value,
            sor: e.target.statementOfResponsibility.value,
            isbn: e.target.isbn.value,
        })
    
        const formData = new FormData()
    
        for(let key in myBook){
            console.log("each key: " + key + " and value " + myBook[key])
            if(myBook.hasOwnProperty(key)){
                if(myBook[key] !== undefined){
                    formData.append(key, myBook[key])
                }
            }
        }
        console.log("This is the form data " + JSON.stringify(formData))
        const result = await addBookFunction(formData)
        console.log("This is result " + JSON.stringify(result))
        window.showMessageApi.alertMsg(result.msg)
    
    })
}

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
                <th>Publisher</th>
                <th></th>
            </tr>
        `
    }

    let totalLength = result.result.totalItems;
    let totalPages = result.result.totalPages;
    totalData.innerHTML = `Books (${totalLength})`

    
    if(totalPages > 1) {
        if(page == 1){
            buildCollectionNavigation(collectionNavigationArea, false, true)
        }else if(page === totalPages){
            console.log("Does this condition work?")
            buildCollectionNavigation(collectionNavigationArea, true, false)
        }else{
            console.log("Total pagess from server " + typeof totalPages + "current page: " + typeof page)
            buildCollectionNavigation(collectionNavigationArea, true, true)
        }
    }else{
        buildCollectionNavigation(collectionNavigationArea, false, false)
    }

    

    let totalBookData = result.result.items;
    if (totalBookData.length > 0 ){
        bookDataEl.innerHTML= ``
        totalBookData.forEach((eachBook) => {
            const newRow = document.createElement("tr")
            let imagePath = filePath + eachBook.bookCover
            newRow.innerHTML = 
                `
                    <td>${eachBook.accNo}</td>
                    <td><img src="${imagePath}" class="displayBookCover"></td> 
                    <td>${eachBook.bookTitle}
                    <td>${eachBook.sor}</td>
                    <td>${eachBook.classNo}</td>
                    <td>${eachBook.isbn}</td>
                    <td>${eachBook.publisher || "-"}</td>
                    <td><button>View Details</button></td>
                `
            bookDataEl.appendChild(newRow)
        })
    }else{
        bookDataEl.innerHTML = `
            <tr> <td colspan="7"> There are no books at the moment </td> </tr>
        `
    }
    
}

function buildCollectionNavigation(area, backward, forward){
    area.innerHTML = ``

    if(backward == true){
        const backwardButton = document.createElement("img")
        backwardButton.src = "./assets/arrow.png"
        backwardButton.classList.add("backButton")
        backwardButton.id = "collectionBackward"
        area.appendChild(backwardButton)
    } 

    if(forward == true){
        const forwardButton = document.createElement("img")
        forwardButton.src = "./assets/arrow_right.png"
        forwardButton.classList.add("backButton")
        forwardButton.id = "collectionForward"
        area.appendChild(forwardButton)
    }

    const collectionBackward = document.getElementById("collectionBackward")
    const collectionForward = document.getElementById("collectionForward")
    
    if(collectionForward){
        collectionForward.addEventListener("click", () => {
            index++;
            updateBookData(category, index)
        })
    }
    
    if(collectionBackward){
        collectionBackward.addEventListener("click", () => {
            index --;
            updateBookData(category, index)
        })
    }
    
}