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

let category = true
let addBookCategory = true;
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
        const imagePlaceholderEl = document.getElementById("imagePlaceholder")
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

async function updateBookData(booleanValue){
    let categoryData = booleanValue ? "english" : "myanmar"; 
    let result = await getAllBooksFunction(categoryData)
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

    let totalBookData = result.result.items;
    if (totalBookData.length > 0 ){
        bookDataEl.innerHTML= ``
        totalBookData.forEach((eachBook) => {
            const newRow = document.createElement("tr")
            let imagePath = filePath + eachBook.bookCover
            newRow.innerHTML = 
                `
                    <td>${eachBook.accNo}</td>
                    <!-- <td>image here </td> -->
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
