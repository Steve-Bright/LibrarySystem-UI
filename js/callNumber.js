import { getAllBooksFunction } from "../controllers/book.controller.js"
import {buildCollectionNavigation, buildBarcodeCollectionView} from "../utils/extra.js"
const backToCollection = document.getElementById("backToCollection")
const totalData = document.getElementById("totalData")
const collectionCategory = document.getElementById("collectionCategory")
const barcodeData = document.getElementById("barcodeData")
const barcodeNavigationArea = document.getElementById("barcodeNavigationArea")
const printPreview = document.getElementById("printPreview")

const filePath = window.imagePaths.shareFilePath();
const currentFile = window.imagePaths.shareCurrentFile();
// localStorage.removeItem("toPrintBarcode");
let category = true
let index = 1;
let selectedCallNums = [];


    localStorage.removeItem("toPrintBarcode");

updateBookData(category)

if(collectionCategory){
    collectionCategory.addEventListener("change", () => {
        category = !category;
        updateBookData(category)
    })
}

if(backToCollection){
    backToCollection.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("collectionpage.html")
    })
}

printPreview.addEventListener("click", () => {
    if(selectedCallNums != []){
        localStorage.setItem("toPrintBarcode", selectedCallNums)
    }else{
        localStorage.removeItem("toPrintBarcode")
    }
     
    let windowFeatures = {
        "width":794,
        "height":1123,
        "alwaysOnTop": true

    }
    let data = {
        "fileName": currentFile+"/printpreview.html",
        "name": "Print Window",
        "windowFeatures": windowFeatures
    }
    window.navigationApi.openWindow(data);
    // let previewWindow = window.open(currentFile+"/printpreview.html", "Print Window", windowFeatures);
    document.close()
})

async function updateBookData(booleanValue, page = 1){
    let categoryData = booleanValue ? "english" : "myanmar"; 
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

function barcodeSelection(category){
    let allCallNums = document.querySelectorAll(".eachBookCallNo")

    allCallNums.forEach((eachCallNum) => {
        eachCallNum.addEventListener('pointerdown', ()=> {
            let objectData = JSON.stringify({
                category,
                "accNo": eachCallNum.id
            })
            if(selectedCallNums.includes(objectData)){
                eachCallNum.classList.remove("selectedCallNo")
                selectedCallNums.pop(objectData)
            }else{
                eachCallNum.classList.add("selectedCallNo")
                selectedCallNums.push(objectData)
            }
            
            console.log("this is all the call numbers " + selectedCallNums)
        })
    })
}