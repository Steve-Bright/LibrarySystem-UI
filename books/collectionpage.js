import Book from "../utils/book.model.mjs"
import {addBookFunction, getAllBooksFunction, getDetailedBook, editBook, deleteBook, getLatestAccNo, generateBarCode} from "../controllers/book.controller.js"
import {buildCollectionNavigation} from "../utils/extra.js"

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
        window.navigationApi.toAnotherPage("./books/bookCallNo.html")
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
        window.navigationApi.toAnotherPage("./books/collectionpage.html")
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
        window.navigationApi.toAnotherPage("./books/addBook.html")
    })
}


if(addBookFormEl){    
    addBookFormEl.addEventListener("submit", async(e)=> {
        e.preventDefault();
        let bookCategory = e.target.category.value;
        let bookAccNo = e.target.accNo.value;
        let barcodeImage = await generateBarCode(bookCategory, bookAccNo)

        const myBook = new Book({
            bookCover: document.getElementById("bookCover").files[0],
            // bookCover: barcodeImage,
            category: bookCategory,
            accNo: bookAccNo,
            bookTitle: e.target.bookTitle.value,
            subTitle: e.target.subTitle.value,
            parallelTitle: e.target.parallelTitle.value,
            initial: e.target.initial.value,
            classNo: e.target.classNo.value,
            callNo: e.target.callNo.value,
            sor: e.target.statementOfResponsibility.value,
            authorOne: e.target.author1.value,
            authorTwo: e.target.author2.value,
            authorThree: e.target.author3.value,
            other: e.target.other.value,
            translator: e.target.translator.value,
            pagination: e.target.pagination.value,
            size: e.target.size.value,
            illustrationType: e.target.illustrationType.value,
            seriesTitle: e.target.seriesTitle.value,
            seriesNo: e.target.seriesNo.value,
            includeCD: e.target.cdDvd.value,
            subjectHeadings: e.target.subjectHeadings.value,
            edition: e.target.edition.value,
            editor: e.target.editor.value,
            place: e.target.place.value,
            publisher: e.target.publisher.value,
            year: e.target.year.value,
            keywords: e.target.keywords.value,
            summary: e.target.summary.value,
            notes: e.target.notes.value,
            source: e.target.source.value,
            price: e.target.price.value,
            donor: e.target.donor.value,
            catalogOwner: e.target.catalogOwner.value,
            barcode: barcodeImage
            // isbn: e.target.isbn.value,
        })
        console.log("this is just pagination " + e.target.pagination.value)
        console.log("this is book " + JSON.stringify(myBook))
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
        console.log("this is result " + JSON.stringify(result))
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
            buildCollectionNavigation(collectionNavigationArea, false, true, index, category, updateBookData, updateNewIndex)
        }else if(page === totalPages){
            buildCollectionNavigation(collectionNavigationArea, true, false, index, category, updateBookData, updateNewIndex)
        }else{
            buildCollectionNavigation(collectionNavigationArea, true, true, index, category, updateBookData, updateNewIndex)
        }
    }else{
        buildCollectionNavigation(collectionNavigationArea, false, false, index, category, updateBookData, updateNewIndex)
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

function updateNewIndex(newIndex){
    index = newIndex;
}

function viewDetailedBookFunction(category, bookIds){
    const detailedButtons = document.querySelectorAll(".detailedBook")
    detailedButtons.forEach((eachButton, i) => {
        eachButton.addEventListener("click", async () => {
            let detailedBookData =  await getDetailedBook(category, bookIds[i])
            localStorage.setItem("detailedBookData", JSON.stringify(detailedBookData.result)) 
            window.navigationApi.toAnotherPage("./books/viewBook.html")
        })
    })
}

function updateBookDetail(){
    let bookDetail = localStorage.getItem("detailedBookData")
    let myBook = new Book(JSON.parse(bookDetail))
    const isbnViewArea = document.getElementById("viewIsbnArea")
    delete myBook.bookId;
    delete myBook.barcode;
    delete myBook.loanStatus;
    isbnViewArea.innerHTML = ``
    if(myBook["category"] == "english"){
        console.log("there is isbn in view detail")
        isbnViewArea.innerHTML = `
                    <label for="isbn">ISBN</label>
                    <input type="text" id="isbn" name="isbn">
                    <br>
                    `
    }else{
        delete myBook.isbn;
    }
    const viewInputs = document.querySelectorAll("#viewBookForm input, #viewBookForm textarea")
    let index = 0;
    console.log("viewinputs length " + JSON.stringify(viewInputs))

    
    console.log("this is my book " + JSON.stringify(myBook))
        setTimeout(() => {
            Object.keys(myBook).forEach((eachKey) => {
                console.log("this is index number " + index + " and each key " + eachKey + " eachInput: " + viewInputs.length)
                if(eachKey == "bookCover"){
                   viewBookCover.src=filePath + myBook[eachKey]
                   
               }else if(eachKey == "isbn"){
                    console.log("isbn condition? ")
                   const isbnInput = document.getElementById("isbn")
                   isbnInput.value = myBook[eachKey]
                   index++
               }
               else{
                   viewInputs[index].value = myBook[eachKey] ? myBook[eachKey] : "-"
                   index++
               }
   
   
           })
        }, 300)
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
    delete newBook.barcode;
    delete newBook.loanStatus;

    const bookKeys =  Object.keys(newBook);

    removeImage.addEventListener('click', () => {
        viewBookCover.remove();
        imagePreviewArea.innerHTML = `
             <input type="file" id="bookCover"> 
        `
        const bookCoverImage = document.getElementById("bookCover")
        bookCoverImage.addEventListener('change', () => {
            newBook.bookCover = bookCoverImage.files[0]
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
        console.log("This is testing little bro "  + JSON.stringify(newBook))
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