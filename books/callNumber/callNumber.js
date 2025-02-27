import { getAllBooksFunction, searchBook } from "../../controllers/book.controller.js"
import {buildCollectionNavigation, buildBarcodeCollectionView} from "../../utils/extra.js"
const backToCollection = document.getElementById("backToCollection")
const totalData = document.getElementById("totalData")
const collectionCategory = document.getElementById("collectionCategory")
const barcodeData = document.getElementById("barcodeData")
const barcodeNavigationArea = document.getElementById("barcodeNavigationArea")
const searchBookForm = document.getElementById("searchBookForm")
const printPreview = document.getElementById("printPreview")

let searchedHistory = sessionStorage.getItem("searchCallNumResult")
let searchedKeyword = sessionStorage.getItem("searchCallNumData")
let printMaterials = localStorage.getItem("toPrintBarcode")
const filePath = window.imagePaths.shareFilePath();
const currentFile = window.imagePaths.shareCurrentFile();
let category = cacheCategory();
collectionCategory.value = category;
await searchCallNumFunction(category)
let index = 1;
let selectedCallNums = [];

if(printMaterials){
    let testing = JSON.parse(`[${printMaterials}]`)
    let dummy = []
    for(let i = 0; i < testing.length; i++){
        dummy.push(JSON.stringify(testing[i]))
    }
    selectedCallNums=dummy;
    // selectedCallNums = printMaterials.split(",")
}

if(!searchedHistory){
    await updateBookData(category)
}else{
    placeItemsInSearchForm(searchedKeyword)
    showSearchResults(category, searchedHistory)
}

if(collectionCategory){
    collectionCategory.addEventListener("change", () => {
        updateBookData(collectionCategory.value)
    })
}

if(backToCollection){
    backToCollection.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("./books/collection/collectionpage.html")
    })
}

printPreview.addEventListener("click", () => {
    if(selectedCallNums != []){
        localStorage.setItem("toPrintBarcode", selectedCallNums)
    }else{
        localStorage.removeItem("toPrintBarcode")
    }
     
    let windowFeatures = {
        "width":725,
        "height":1123
    }
    let data = {
        "fileName": currentFile+"./books/callNumber/printpreview.html",
        "name": "Print Window",
        "windowFeatures": windowFeatures
    }
    window.navigationApi.openWindow(data);
    document.close()
})

async function updateBookData(booleanValue, page = 1){
    category = booleanValue
    let categoryData = cacheCategory(booleanValue); 
    let result = await getAllBooksFunction(categoryData, page)
    let totalLength = result.result.totalItems;
    let eachBookData = result.result.items;
    let totalPages = result.result.totalPages;
    totalData.innerHTML = `Books (${totalLength})`

    barcodeData.innerHTML = ``
    let tr;
    let td;
    let trArrays = [];

    let rowData = buildBarcodeCollectionView(2, eachBookData, tr, td, trArrays)
    rowData.forEach((eachBarcode) => barcodeData.appendChild(eachBarcode))

    if(totalPages > 1) {
        if(page == 1){
            buildCollectionNavigation(barcodeNavigationArea, false, true, index, category, updateBookData, updateNewIndex)
        }else if(page === totalPages){
            buildCollectionNavigation(barcodeNavigationArea, true, false, index, category, updateBookData, updateNewIndex)
        }else{
            buildCollectionNavigation(barcodeNavigationArea, true, true, index, category, updateBookData, updateNewIndex)
        }
    }else{
        buildCollectionNavigation(barcodeNavigationArea, false, false, index, category, updateBookData, updateNewIndex)
    }

    barcodeSelection(categoryData)

}

function updateNewIndex(newIndex){
    index = newIndex;
}

function placeItemsInSearchForm(searchedCache){
    searchedCache = JSON.parse(searchedCache)
    searchBookForm.bookTitleInput.value = searchedCache.bookTitle
    searchBookForm.accNoInput.value = searchedCache.accNo
    searchBookForm.authorInput.value = searchedCache.sor
    searchBookForm.publisherInput.value = searchedCache.publisher
    searchBookForm.classNoInput.value = searchedCache.classNo
}

function showSearchResults(category, searchedHistory){
  searchedHistory = JSON.parse(searchedHistory)
  totalData.innerHTML = `Members Found (${searchedHistory.length})`
  if(searchedHistory.length != 0){
    barcodeData.innerHTML = ``
    let tr;
    let td;
    let trArrays = [];
    let rowData = buildBarcodeCollectionView(2, searchedHistory, tr, td, trArrays)
    rowData.forEach((eachBarcode) => barcodeData.appendChild(eachBarcode))
  }else{
    barcodeData.innerHTML = `
        <tr> <td colspan="2">Call Number is not found</td> </tr>
    `
  }
  barcodeSelection(category)
}

searchBookForm.addEventListener("reset", () => {
    sessionStorage.removeItem("searchCallNumResult")
    sessionStorage.removeItem("searchCallNumData")
    window.location.reload()
})

async function searchCallNumFunction(categoryData){
    searchBookForm.addEventListener("submit", async(e) => {
      e.preventDefault();
      localStorage.setItem("toPrintBarcode", selectedCallNums)
      let searchData = {
        category: categoryData,
        bookTitle: e.target.bookTitleInput.value,
        accNo: e.target.accNoInput.value,
        sor: e.target.authorInput.value,
        publisher: e.target.authorInput.value,
        classNo: e.target.classNoInput.value
      }
      sessionStorage.setItem("searchCallNumData", JSON.stringify(searchData))
      const result = await searchBook(searchData);
      if(!result){
        sessionStorage.setItem("searchCallNumResult", "[]")
      }else{
        sessionStorage.setItem("searchCallNumResult", JSON.stringify(result))
      }

      window.location.reload()
    })
}

function barcodeSelection(category){
    let allCallNums = document.querySelectorAll(".eachBookCallNo")

    allCallNums.forEach((eachCallNum) => {
        let objectData = JSON.stringify({
            category,
            "accNo": eachCallNum.id
        })

        if(selectedCallNums.includes(objectData) && !eachCallNum.classList.contains("selectedCallNo")){
            console.log('this conditio must be fulfilled')
            eachCallNum.classList.add("selectedCallNo")
        }

        console.log('this shoudl run ')
        eachCallNum.addEventListener('pointerdown', ()=> {
            if(selectedCallNums.includes(objectData)){
                let selectedIndex = selectedCallNums.indexOf(objectData)
                eachCallNum.classList.remove("selectedCallNo")
                selectedCallNums.splice(selectedIndex, 1)
            }else{
                eachCallNum.classList.add("selectedCallNo")
                selectedCallNums.push(objectData)
            }
            
            // console.log("this is all the call numbers " + selectedCallNums)
        })
    })
}

function cacheCategory(booleanValue = null){
    if(booleanValue !== null){
        sessionStorage.setItem("callNumCategory", booleanValue)
    }

    let cachedCategoryValue = sessionStorage.getItem("callNumCategory")
    if(cachedCategoryValue === null){
        return "english"
    }
    return cachedCategoryValue
}