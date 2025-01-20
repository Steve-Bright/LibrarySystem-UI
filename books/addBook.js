import Book from "../utils/book.model.mjs"
import {addBookFunction, getLatestAccNo, generateBarCode} from "../controllers/book.controller.js"
import { convertMMToEng, convertEngToMM } from "../utils/burmese.mapper.js"

const backToCollection = document.getElementById("backToCollection")
const addBookImageArea = document.getElementById("addBookImageArea")
const addBookFormEl = document.getElementById("addBookForm")
const accNoInput = document.getElementById("accNo")
const categorySelect = document.getElementById("category")
const callNoBtn = document.getElementById('callNoBtn')
const callNoInput = document.getElementById("callNo")
const classInput = document.getElementById("classNo")
const addBookCover = document.getElementById("bookCover")
const initialInput = document.getElementById("initial")
const clearDataButton = document.getElementById("clearDataButton")
const isbnArea = document.getElementById("isbnArea");
let addBookCategory = true;
let addBookData ;
let bookCache;

backToCollection.addEventListener("click", () => {
  if(bookCache){
      localforage.setItem("addbookCache", bookCache).then(function(value){
          window.navigationApi.toAnotherPage("./books/collectionpage.html")
      })
  }
  window.navigationApi.toAnotherPage("./books/collectionpage.html")
})

categorySelect.addEventListener("change", async() => {
    addBookCategory = !addBookCategory
    accNoInput.value = await getLatestAccNo(categorySelect.value)
    if(categorySelect.value == "myanmar"){
        accNoInput.value = convertEngToMM(accNoInput.value, true)
    }
    toggleISBN(addBookCategory)
})

accNoInput.value = await getLatestAccNo(categorySelect.value)
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

function autogenerateCallNo(accNoInput, initialInput, classInput, callNoInput){

  let accNoValue = accNoInput.value
  let initialValue = initialInput.value;
  let classNoValue = classInput.value;

  accNoInput.addEventListener("input", () => {
      accNoValue = accNoInput.value;
      triggerCallNumber()
  })

  initialInput.addEventListener("input", () => {
      initialValue = initialInput.value
      triggerCallNumber()
  })

  classInput.addEventListener("input", () => {
      classNoValue = classInput.value;
      triggerCallNumber()
  })

  function triggerCallNumber(){
      callNoInput.value = accNoValue + " " + initialValue + " " + classNoValue
  }
  
}

const bookValue = await localforage.getItem('addbookCache');
let bookValueKeys = Object.keys(bookValue)
    addBookData = addBookFormEl.querySelectorAll("input, select, textarea")
    for(let i = 2; i <  addBookData.length; i++){
        if(addBookData[i].id == bookValueKeys[i]){
            console.log(addBookData[i].id + " is same with " + bookValueKeys[i])
        }else{
            console.log(addBookData[i].id + " is not same with " + bookValueKeys[i])
        }
    }
    bookCache = new Book({
        category: addBookData[1].value,
        accNo: addBookData[2].value
    })
    delete bookCache.bookCover;
    let bookKeys = Object.keys(bookCache)
    addBookData.forEach((eachInput, i) => {

        if(eachInput.type === "file"){
            console.log('this is the file input type')
        }else{
            eachInput.addEventListener("input", () => {
                bookCache[bookKeys[i]] = eachInput.value;
            })

            console.log("this is the book cache " + JSON.stringify(bookCache))
        }

    })

    addBookCover.addEventListener("change", (event) => {

        let bookCoverAdded = addBookCover.files[0]
        if(bookCoverAdded){
            let image = window.URL.createObjectURL(bookCoverAdded)
                addBookImageArea.innerHTML = `
                <img src=${image} alt="Book Cover">
            `
        }
    })

    autogenerateCallNo(accNoInput, initialInput, classInput, callNoInput)

    clearDataButton.addEventListener("click", () => {
        localforage.removeItem("addbookCache")
    })
    
    addBookFormEl.addEventListener("submit", async(e)=> {
        e.preventDefault();
        let bookCategory = e.target.category.value;
        let bookAccNo = e.target.accNo.value;
        bookAccNo = convertMMToEng(bookAccNo, true)
        let bookClassNo = e.target.classNo.value;
        let barcodeImage = await generateBarCode(bookCategory, bookAccNo)

        console.log("this is acc number " + convertMMToEng(bookAccNo))
        
        const myBook = new Book({
            bookCover: document.getElementById("bookCover").files[0],
            // bookCover: barcodeImage,
            category: bookCategory,
            accNo: bookAccNo,
            bookTitle: e.target.bookTitle.value,
            subTitle: e.target.subTitle.value,
            parallelTitle: e.target.parallelTitle.value,
            initial: e.target.initial.value,
            classNo: convertMMToEng(bookClassNo),
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

        for (const [key, value] of Object.entries(myBook)) {
            if(value == "" || !value){
                delete myBook[key]
            }
        }
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
        if(result.con){
            window.location.reload()
        }
        // window.location.reload();
    })