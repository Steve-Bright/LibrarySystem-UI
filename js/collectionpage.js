import Book from "../utils/book.model.mjs"
import {addBookFunction, getAllBooksFunction, getDetailedBook, editBook, deleteBook, getLatestAccNo, generateBarCode} from "../controllers/book.controller.js"
const JsBarcode = window.JsBarcode;

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
const imagePreviewArea = document.getElementById("imagePreviewArea")
const editBookButton = document.getElementById("editBookButton")
const editButtonsArea = document.getElementById("editButtonsArea")
const totalData = document.getElementById("totalData")
const deleteBookButton = document.getElementById("deleteBookButton")
// const bookBarCode = document.getElementById("bookBarCode")
const imagePlaceholder = document.getElementById("imagePlaceholder")
const accNoInput = document.getElementById("accNo")
const categoryInput = document.getElementById("category")
const callNoBtn = document.getElementById('callNoBtn')

let category = true
let addBookCategory = true;
let index = 1;

if(callNoBtn){
    callNoBtn.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("bookCallNo.html")
    })
}

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
    // console.log("doesnt this catch this function as well?")
    backToCollection.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("collectionpage.html")
    })
}

if(deleteBookButton){
    deleteBookButton.addEventListener('click', () =>{
        // let result
         window.showMessageApi.confirmMsg("Do you really want to delete?")
    })

    window.showMessageApi.dialogResponse(async(event, response) =>{
        // console.log("this is their response "+ response)
        let bookDetail = localStorage.getItem("detailedBookData")
        bookDetail = JSON.parse(bookDetail)
        if(!response){
            const result = await deleteBook(bookDetail.category, bookDetail._id)
            window.showMessageApi.alertMsg(result.msg)
        }
    })
}

if(editBookButton){
    editBookButton.addEventListener("click", () => {
        updateEditBookUi();
        // window.navigationApi.toAnotherPage("editBook.html")
    })
}

if(viewBookForm){
    // await getDetailedBook(category, bookIds[i])
    updateBookDetail()
}

if(categorySelect){
    const isbnArea = document.getElementById("isbnArea");
    categorySelect.addEventListener("change", async() => {
        addBookCategory = !addBookCategory
        accNoInput.value = await getLatestAccNo(categoryInput.value)
        toggleISBN(addBookCategory)
    })

    accNoInput.value = await getLatestAccNo(categoryInput.value)
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
        let bookCategory = e.target.category.value;
        let bookAccNo = e.target.accNo.value;
        let barcodeImage = await generateBarCode(bookCategory, bookAccNo)

        const myBook = new Book({
            // bookCover: document.getElementById("bookCover").files[0],
            bookCover: barcodeImage,
            category: bookCategory,
            accNo: bookAccNo,
            bookTitle: e.target.bookTitle.value,
            initial: e.target.initial.value,
            classNo: e.target.classNo.value,
            callNo: e.target.callNo.value,
            sor: e.target.statementOfResponsibility.value,
            // isbn: e.target.isbn.value,
        })

        if(e.target.isbn){
            myBook.isbn = e.target.isbn.value;
        }
    
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
        imagePlaceholder.src = barcodeImage;
        // window.location.reload();
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
    delete myBook.bookId;
    if(myBook["category"] == "english"){
        isbnArea.innerHTML = `
                    <label for="isbn">ISBN</label>
                    <input type="text" id="isbn" name="isbn">
                    <br>
                    `
    }
    const viewInputs = document.querySelectorAll("#viewBookForm input, #viewBookForm textarea")
    
    let index = 0;
    // console.log(JSON.stringify(myBook))

        Object.keys(myBook).forEach((eachKey) => {
             if(eachKey == "bookCover"){
                viewBookCover.src=filePath + myBook[eachKey]
                
            }else if(eachKey == "isbn"){
                const isbnInput = document.getElementById("isbn")
                isbnInput.value = myBook[eachKey]
                index++
            }
            else{
                viewInputs[index].value = myBook[eachKey] ? myBook[eachKey] : "-"
                index++
            }


        })
}

function updateEditBookUi(){
    viewBookForm.id = ""
    viewBookForm.id = "editBookForm"

    editButtonsArea.innerHTML = `<button type="submit">Edit</button>`
    const removeImageButton = document.createElement("button");
    removeImageButton.id = "removeImage";
    removeImageButton.textContent = "remove";
    imagePreviewArea.appendChild(removeImageButton);

    const editBookForm = document.getElementById("editBookForm")
    const removeImage = document.getElementById("removeImage")
    const editBookFormField = document.querySelectorAll("#editBookForm input,  textarea")
    let newBook = new Book({})
    delete newBook.bookId;
    delete newBook.bookCover;

    const bookKeys =  Object.keys(newBook);

    removeImage.addEventListener('click', () => {
        viewBookCover.remove();
        imagePreviewArea.innerHTML = `
             <input type="file" id="bookCover"> 
        `
        const bookCoverImage = document.getElementById("bookCover")
        bookCoverImage.addEventListener('change', () => {
            newBook.bookCover = filePath + bookCoverImage.files[0]
        })
    })

    editBookFormField.forEach((eachInput, i ) => {
        eachInput.addEventListener("change", () => {
            // console.log("input is detected")
            newBook[bookKeys[i]] = eachInput.value;
        })
    })

    let bookDetail = localStorage.getItem("detailedBookData")
    bookDetail = JSON.parse(bookDetail)
    newBook.category = bookDetail.category
    newBook.bookId = bookDetail._id

    editBookForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        const formData = new FormData()
        // console.log("This is testing little bro "  + JSON.stringify(newBook))
        for(let key in newBook){
            
            if(newBook.hasOwnProperty(key)){
                if(newBook[key] !== undefined){
                    formData.append(key, newBook[key])
                }
            }
        }
        let result = await editBook(formData)
        window.showMessageApi.alertMsg(result.msg)
    })
}