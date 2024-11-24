import Book from "../utils/book.model.mjs"
import {addBookFunction, getAllBooksFunction, getDetailedBook} from "../controllers/book.controller.js"

const addBookBtn = document.getElementById("addBookBtn")
const backToCollection = document.getElementById("backToCollection")
const addBookFormEl = document.getElementById("addBookForm")
const bookDataEl = document.getElementById("bookData")
const collectionCategory = document.getElementById("collectionCategory")
const bookDataHeadings = document.getElementById("bookDataHeadings")
const categorySelect = document.getElementById("category")
const filePath = window.imagePaths.shareFilePath();
const collectionNavigationArea = document.getElementById("collectionNavigationArea")
const viewBookForm = document.getElementById("viewBookForm")
// const viewBookFormField = document.querySelectorAll("#viewBookForm input,  textarea")
const viewBookCover = document.getElementById("viewBookCover")

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

if(backToCollection){
    console.log("doesnt this catch this function as well?")
    backToCollection.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("collectionpage.html")
    })
}

if(viewBookForm){
    // await getDetailedBook(category, bookIds[i])
    updateBookDetail()
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
            if(myBook.hasOwnProperty(key)){
                if(myBook[key] !== undefined){
                    formData.append(key, myBook[key])
                }
            }
        }
        const result = await addBookFunction(formData)
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
            buildCollectionNavigation(collectionNavigationArea, true, false)
        }else{
            buildCollectionNavigation(collectionNavigationArea, true, true)
        }
    }else{
        buildCollectionNavigation(collectionNavigationArea, false, false)
    }

    
    let bookIds = [];
    let totalBookData = result.result.items;
   
    if (totalBookData.length > 0 ){   
        bookDataEl.innerHTML= ``
        totalBookData.forEach((eachBook) => {
            bookIds.push(eachBook._id)
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
                    <td><button class="detailedBook">View Details</button></td>
                `
            bookDataEl.appendChild(newRow)
            
        });
        // console.log("These are book Ids " + bookIds)
        viewDetailedBookFunction(categoryData, bookIds)
    }else{
        bookDataEl.innerHTML = `
            <tr> <td colspan="7"> There are no books at the moment </td> </tr>
        `
    }
    
}

async function buildCollectionNavigation(area, backward, forward){
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

function viewDetailedBookFunction(category, bookIds){
    const detailedButtons = document.querySelectorAll(".detailedBook")
    detailedButtons.forEach((eachButton, i) => {
        eachButton.addEventListener("click", async () => {
            let detailedBookData =  await getDetailedBook(category, bookIds[i])
            localStorage.setItem("detailedBookData", JSON.stringify(detailedBookData.result)) 
            window.navigationApi.toAnotherPage("viewBook.html")
        })
    })
}

function updateBookDetail(){
    let bookDetail = localStorage.getItem("detailedBookData")
    let myBook = new Book(JSON.parse(bookDetail))
    delete myBook.id;
    if(myBook["category"] == "english"){
        isbnArea.innerHTML = `
                    <label for="isbn">ISBN</label>
                    <input type="text" id="isbn" name="isbn">
                    <br>
                    `
    }
    const viewInputs = document.querySelectorAll("#viewBookForm input, textarea")
    let index = 0;

        Object.keys(myBook).forEach((eachKey) => {
             if(eachKey == "bookCover"){
                viewBookCover.src=filePath + myBook[eachKey]
                
            }else{
                viewInputs[index].value = myBook[eachKey] ? myBook[eachKey] : "-"
                index++
            }


        })
}