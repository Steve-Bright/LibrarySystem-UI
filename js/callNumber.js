import { getAllBooksFunction } from "../controllers/book.controller.js"
const backToCollection = document.getElementById("backToCollection")
const totalData = document.getElementById("totalData")
const collectionCategory = document.getElementById("collectionCategory")
const barcodeData = document.getElementById("barcodeData")

let category = true

updateBookData(category)

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

async function updateBookData(booleanValue, page = 1){
    let categoryData = booleanValue ? "english" : "myanmar"; 
    let result = await getAllBooksFunction(categoryData, page)
    console.log(JSON.stringify(result.result))
    let totalLength = result.result.totalItems;
    let eachBookData = result.result.items;
    let totalPages = result.result.totalPages;
    totalData.innerHTML = `Books (${totalLength})`

    barcodeData.innerHTML = ``;
    let j = 0;
    let tr;
    let trArrays = [];
    for(let i = 0; i < eachBookData.length; i++){
        // console.log("each book " + JSON.stringify(eachBookData[i].accNo))
        if(j == 0){
            tr = document.createElement("tr")
        }

        let td = document.createElement("td")
        td.innerHTML = `
            <div class="eachBookCallNo">
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
    // barcodeData.appendChild(trArrays[0])
}