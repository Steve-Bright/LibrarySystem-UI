let currentDirectory = window.sharingDataApi.currentDirectory();
let forwardButtonIcon = currentDirectory + "/assets/arrow_right.png"
let backwardButtonIcon = currentDirectory + "/assets/arrow.png"
const filePath = window.imagePaths.shareFilePath();
export async function buildCollectionNavigation(area, backward, forward, index, category, updateFunction, onIndexChange){
    area.innerHTML = ``

    if(backward == true){
        const backwardButton = document.createElement("img")
        backwardButton.src = backwardButtonIcon
        backwardButton.classList.add("backButton")
        backwardButton.id = "collectionBackward"
        area.appendChild(backwardButton)
    } 

    if(forward == true){
        const forwardButton = document.createElement("img")
        forwardButton.src = forwardButtonIcon
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

export async function buildMemberNavigation(area, backward, forward, index, updateFunction, onIndexChange){
    area.innerHTML = ``

    if(backward == true){
        const backwardButton = document.createElement("img")
        backwardButton.src = backwardButtonIcon
        backwardButton.classList.add("backButton")
        backwardButton.id = "collectionBackward"
        area.appendChild(backwardButton)
    } 

    if(forward == true){
        const forwardButton = document.createElement("img")
        forwardButton.src = forwardButtonIcon
        forwardButton.classList.add("backButton")
        forwardButton.id = "collectionForward"
        area.appendChild(forwardButton)
    }

    const collectionBackward = document.getElementById("collectionBackward")
    const collectionForward = document.getElementById("collectionForward")
    
    if(collectionForward){
        collectionForward.addEventListener("click", () => {
            index++;
            updateFunction(index)
            onIndexChange(index)
        })
    }
    
    if(collectionBackward){
        collectionBackward.addEventListener("click", () => {
            index --;
            updateFunction(index)
            onIndexChange(index)
        })
    }
    
}

export function buildCardDesign(memberData){
    // console.log("this is member data " + memberData.expiryDate)
    let cards = [];




    memberData.forEach((eachMember) => {
        // console.log("this is expirty date " + eachMember.expiryDate)
        let secondRowData1;
        let secondRowData2 = "";
        switch(eachMember.memberType){
            case "student": 
                    secondRowData1 = eachMember.personalId
                    secondRowData2 = eachMember.grade
                    break;
            default: 
                    secondRowData1 = eachMember.nrc;
                    break;
        }
        let expireDate = (new Date(eachMember.expiryDate)).toDateString().split(" ")
        let card = `
            <div class="cardFormat" id="${eachMember._id}">
                <div class="cardHeading">
                    <div class="logoArea">
                        <img src="../../assets/YGW.png"> 
                    </div>
                    <div class="logoTitle">
                        <h1>Yellow Generation Wave</h1>
                    </div>

                </div>

                <div class="cardBody">
                    <div class="photoArea">
                        <img src="${filePath}${eachMember.photo}" class="photoId">
                            ${eachMember.memberId}
                    </div>
                    <div class="individualData">
                        <div class="firstRow">
                            <div>${eachMember.name}</div>
                            <div>${eachMember.phone}</div>
                        </div>
                        <div class="secondRow">
                            <div>${secondRowData1}</div>
                            <div>${secondRowData2}</div>
                        </div>

                        <div class="thirdRow">
                            <div>${eachMember.currentAddress}</div>
                            <div></div>
                        </div>
                        <div class="barcode">
                            <img src="${filePath}${eachMember.barcode}" class="barcodeId">
                            <div class="footLine">
                                <div></div>
                                <div>${expireDate[2]} ${expireDate[1]} ${expireDate[3]}</div>
                            </div>
                        </div>

                    </div>  
                </div>
            </div>
        `
        cards.push(card)
    })
    return cards;
}

export function attachMemberCardToDiv(table, cardData){
    // console.log("These are card data " + cardData)
    let tableRows = []

    cardData.forEach((eachCard, i) => {
        if(i % 2 === 0){
            // let tr = 
            let tr = document.createElement("tr")
            tableRows.push(tr)
        }

        let finalIndex = tableRows.length - 1
        let td = document.createElement("td")
        td.innerHTML = eachCard
        tableRows[finalIndex].appendChild(td)
    }) 

    let finalIndexOfRow = tableRows.length -1
    tableRows.forEach((eachRow, i) => {

        if(tableRows.length %2 != 0 && i == finalIndexOfRow){
            let td = document.createElement("td")
            tableRows[finalIndexOfRow].appendChild(td)
        }

        table.appendChild(eachRow)
    })
}

// export async function buildMemberCardCollectionView(views, totalData, tr, td, trArrays){

// }

export function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}