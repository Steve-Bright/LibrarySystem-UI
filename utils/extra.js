const filePath = window.imagePaths.shareFilePath();
export async function buildCollectionNavigation(area, backward, forward, index, category, updateFunction, onIndexChange){
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
            updateFunction(category, index)
            onIndexChange(index)
        })
    }
    
    if(collectionBackward){
        collectionBackward.addEventListener("click", () => {
            index --;
            updateFunction(category, index)
            onIndexChange(index)
        })
    }
    
}

export function buildBarcodeCollectionView(views, totalData, tr, td, trArrays){
    let j = 0;
    let totalViews = views-1;
    let totalLength = totalData.length;
    for(let i = 0; i < totalLength; i++){
        if(j == 0){
            tr = document.createElement("tr")
        }

        td = document.createElement("td")
        let barcode = `
            <div class="eachBookCallNo" id=${totalData[i].accNo}>
                <div class="callNo">
                    Acc No ${totalData[i].accNo} <br>
                    ${totalData[i].initial}<br>
                    Class No ${totalData[i].classNo}
                </div>
                <div class="barcode">
                    <img src="${filePath}${totalData[i].barcode}">
                </div>
            </div>
        `
        td.innerHTML = barcode;
        tr.appendChild(td)
        if(j == totalViews){
            j = 0;
            trArrays.push(tr)
        }else{
            j++;
            if(i == totalLength - 1){
                if(totalLength == 1){
                    let td = document.createElement("td")
                    td.innerHTML = `<td></td>`
                    tr.appendChild(td)
                }
                trArrays.push(tr)
            }
        }        
        
    }

    return trArrays;
}