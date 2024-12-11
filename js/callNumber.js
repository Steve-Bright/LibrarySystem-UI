import { getAllBooksFunction } from "../controllers/book.controller.js"
import {buildCollectionNavigation} from "../utils/extra.js"
const backToCollection = document.getElementById("backToCollection")
const totalData = document.getElementById("totalData")
const collectionCategory = document.getElementById("collectionCategory")
const barcodeData = document.getElementById("barcodeData")
const barcodeNavigationArea = document.getElementById("barcodeNavigationArea")
const printPreview = document.getElementById("printPreview")

let category = true
let index = 1;
let selectedCallNums = [];

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
    window.printApi.printPage();
})

async function updateBookData(booleanValue, page = 1){
    let categoryData = booleanValue ? "english" : "myanmar"; 
    let result = await getAllBooksFunction(categoryData, page)
    let totalLength = result.result.totalItems;
    let eachBookData = result.result.items;
    let totalPages = result.result.totalPages;
    totalData.innerHTML = `Books (${totalLength})`

    barcodeData.innerHTML = ``;
    let j = 0;
    let tr;
    let trArrays = [];
    let barcodes = [];
    for(let i = 0; i < eachBookData.length; i++){
        if(j == 0){
            tr = document.createElement("tr")
        }

        let td = document.createElement("td")
        let barcode = `
            <div class="eachBookCallNo" id=${eachBookData[i].accNo}>
                <div class="callNo">
                    Acc No ${eachBookData[i].accNo} <br>
                    ${eachBookData[i].initial}<br>
                    Class No ${eachBookData[i].classNo}
                </div>
                <div class="barcode">
                    <img src="./assets/dummy-barcode.png"
                </div>
            </div>
        `
        td.innerHTML = barcode;
        barcodes.push(barcode)
        tr.appendChild(td)
        if(j == 1){
            j = 0;
            trArrays.push(tr)
        }else{
            j++;
            if(i == totalLength - 1){
                trArrays.push(tr)
            }
        }        
        
    }
    trArrays.forEach((eachBarcode) => barcodeData.appendChild(eachBarcode))

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

    barcodeSelection()

}

function updateNewIndex(newIndex){
    index = newIndex;
}

function barcodeSelection(){
    let allCallNums = document.querySelectorAll(".eachBookCallNo")

    allCallNums.forEach((eachCallNum) => {
        eachCallNum.addEventListener('click', ()=> {
            if(selectedCallNums.includes(eachCallNum.id)){
                eachCallNum.classList.remove("selectedCallNo")
                selectedCallNums.pop(eachCallNum.id)
            }else{
                eachCallNum.classList.add("selectedCallNo")
                selectedCallNums.push(eachCallNum.id)
            }
            
            console.log("this is all the call numbers " + selectedCallNums)
        })
    })
}