import { convertMMToEng, convertEngToMM } from "../utils/burmese.mapper.js"
let currentDirectory = window.sharingDataApi.currentDirectory();
let forwardButtonIcon = currentDirectory + "/assets/arrow_right.png"
let backwardButtonIcon = currentDirectory + "/assets/arrow.png"
let leftSkipIcon = currentDirectory + "/assets/jump_left.png"
let rightSkipIcon = currentDirectory + "/assets/jump_right.png"
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

    area.innerHTML += `<input type='number' id='page' class='pageInput' value=${index}>`

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

export async function buildNavArea({resultPages, collectionNavigation, pageValues, category, skipArea, printArray = null}){
    let {totalPages, index, navigationButtons} = resultPages
    let {collectionBackward, collectionForward} = collectionNavigation
    let {pageIndex, totalPagesUI} = pageValues;

    console.log("category is " + category)

    let navData = {
        "myanmar": "mmPageIndex", 
        "english": "engPageIndex",
        "myanmarCallNo": "myanmarCallNoPageIndex",
        "englishCallNo": "englishCallNoPageIndex",
        "allMember": "allMemberPageIndex",
        "staffMember": "staffMemberPageIndex",
        "teacherMember": "teacherMemberPageIndex",
        "publicMember": "publicMemberPageIndex",
        "studentMember": "studentMemberPageIndex",
        "allMemberCard": "allMemCardPageIndex",
        "staffMemberCard": "staffMemCardPageIndex",
        "teacherMemberCard": "teacherMemCardPageIndex",
        "publicMemberCard": "publicMemCardPageIndex",
        "studentMemberCard": "studentMemCardPageIndex",
        "allLoan": "allLoanPageIndex",
        "todayLoan": "todayLoanPageIndex",
        "overdueLoan": "overdueLoanPageIndex",
        "otherLoan": "otherLoanPageIndex",
        "allPrintLoan": "allPrintLoanPageIndex",
        "todayPrintLoan": "todayPrintLoanPageIndex",
        "overduePrintLoan": "overduePrintLoanPageIndex",
        "otherPrintLoan": "otherPrintLoanPageIndex",
    }

    let sessionData;
    let allNavKeys = Object.keys(navData)
    for(let eachKey of allNavKeys){
        if(eachKey === category){
            sessionData = navData[eachKey]
        }
    }

    if(!sessionData){
        sessionData = category;
    }

    navigationButtons.innerHTML = ""
    pageIndex.value =index;
    totalPagesUI.innerHTML = totalPages

    if(totalPages > 1){
        if(index == 1){
            collectionForward[0].innerHTML = `<img src=${forwardButtonIcon} class="backButton">`
            collectionForward[1].innerHTML = `<img src=${forwardButtonIcon} class="backButton">`
        }else if(index == totalPages){
            collectionBackward[0].innerHTML = `<img src=${backwardButtonIcon} class="backButton">`
            collectionBackward[1].innerHTML = `<img src=${backwardButtonIcon} class="backButton">`
        }else{
            collectionBackward[0].innerHTML = `<img src=${backwardButtonIcon} class="backButton">`
            collectionBackward[1].innerHTML = `<img src=${backwardButtonIcon} class="backButton">`
            collectionForward[0].innerHTML = `<img src=${forwardButtonIcon} class="backButton">`
            collectionForward[1].innerHTML = `<img src=${forwardButtonIcon} class="backButton">`
        }
    }else{

    }

    buildNumberButtons(sessionData, totalPages, index, navigationButtons, skipArea, category, printArray)
    buttonFunctionality(sessionData)

    function buttonFunctionality(sessionData){
         const collectionForwardButton = document.querySelectorAll(`.collectionForward img`)

         if(collectionForwardButton){
            for(let eachForwardButton of collectionForwardButton){
                eachForwardButton.addEventListener("click", ()=> {
                    let updatedIndex = index+1;
                    sessionStorage.setItem(sessionData, updatedIndex)
                    window.location.reload()
                 })
            }
         }

         const collectionBackwardButton = document.querySelectorAll(`.collectionBackward img`)
         if(collectionBackwardButton){
            for(let eachBackwardButton of collectionBackwardButton){
                eachBackwardButton.addEventListener("click", ()=> {
                    let updatedIndex = index-1;
                    sessionStorage.setItem(sessionData, updatedIndex)
                    window.location.reload()
                 })
            }
         }
    }
}
function buildNumberButtons(sessionData, pages, currentPageNum, buttonsArea, skipArea, category, printArray = null){
    let {leftSkip, rightSkip} = skipArea
    let numberString = JSON.stringify(currentPageNum)
    let lastDigit = numberString[numberString.length-1]
    let checkNumber = "";
    for(let i = 0; i < numberString.length - 1; i ++){
        checkNumber += numberString[i]
    }
    checkNumber+= "0"
    let firstNumber;
    let lastNumber;
    if(lastDigit != 0){
        firstNumber = Number(checkNumber) + 1;
        lastNumber = firstNumber + 9;
    }else{
        lastNumber = Number(checkNumber);
        firstNumber = lastNumber - 9;
    }
     
    assignNumber( firstNumber, lastNumber, currentPageNum, pages)
    rightAndLeftFunctionality()

    pageNumberFunctionality(sessionData)

    function assignNumber(firstNumber, lastNumber, currentNum, pages){

        if(firstNumber != 1){
            leftSkip.innerHTML =  `<img src=${leftSkipIcon} class="backButton">`
        }else{
            leftSkip.innerHTML = ''
        }

        if(lastNumber < pages){
            rightSkip.innerHTML =  `<img src=${rightSkipIcon} class="backButton">`
        }else{
            rightSkip.innerHTML = ""
        }
         
        let  displayButtons = Math.min(10, pages)
        if(pages >= firstNumber && pages <= lastNumber){
            lastNumber = pages;
            displayButtons = (lastNumber - firstNumber) + 1;
        }displayButtons = Math.min(10, pages)
        if(pages >= firstNumber && pages <= lastNumber){
            lastNumber = pages;
            displayButtons = (lastNumber - firstNumber) + 1;
        }
        let displayButtonsArray = Array.from({ length: displayButtons }, (_, i) => firstNumber + i);

        for (let num of displayButtonsArray) {
            let button = document.createElement("button");
            button.innerHTML = num;
            button.id = num;
            if(num == currentNum){
                button.classList.add("selectedPage")
            }
            buttonsArea.appendChild(button);
        }
    }

    function rightAndLeftFunctionality(){
        
        rightSkip.addEventListener("click", () => {
            if(lastNumber <= pages){
                buttonsArea.innerHTML = ""
                firstNumber = firstNumber + 10;
                if(pages - lastNumber  >= 10 ){
                    lastNumber = lastNumber + 10;
                }else{
                    lastNumber = lastNumber + (pages - lastNumber)
                }
                assignNumber(firstNumber, lastNumber, currentPageNum, pages)
                pageNumberFunctionality(sessionData)
            }
        })
     
        leftSkip.addEventListener('click', () => {
            if(firstNumber > 1){
                buttonsArea.innerHTML = ""
                firstNumber = firstNumber - 10;
                lastNumber = lastNumber -10; 
                assignNumber(firstNumber, lastNumber, currentPageNum, pages)
                pageNumberFunctionality (sessionData)
            }
        })
    }

    function pageNumberFunctionality(sessionData){
        let printData = {
            "myanmarCallNo": "toPrintBarcode",
            "englishCallNo": "toPrintBarcode",
            "allMemberCard": "toPrintMemberCards",
            "staffMemberCard": "toPrintMemberCards",
            "teacherMemberCard": "toPrintMemberCards",
            "publicMemberCard": "toPrintMemberCards",
            "studentMemberCard": "toPrintMemberCards",
            "allPrintLoan": "toPrintLoan",
            "todayPrintLoan": "toPrintLoan",
            "overduePrintLoan": "toPrintLoan",
            "otherPrintLoan": "toPrintLoan",
        }
        let printKeys = Object.keys(printData)
        let buttonsAreaId = buttonsArea.id;
        let buttonClicks = document.querySelectorAll(`#${buttonsAreaId} button`)
        for(let eachButton of buttonClicks){
           eachButton.addEventListener("click", () => {
               sessionStorage.setItem(sessionData, eachButton.id)
               for(let eachPrintKey of printKeys){
                if(eachPrintKey === category){
                    localStorage.setItem(printData[eachPrintKey], printArray)
                }
               }
               window.location.reload()
           })
        }
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
        let accessionNumber;
        let classNumber;

        if(totalData[i].category == "myanmar"){
            accessionNumber = convertEngToMM(totalData[i].accNo)
            classNumber = convertEngToMM(totalData[i].classNo)
        }else{
            accessionNumber = totalData[i].accNo
            classNumber = totalData[i].classNo;
        }

        let barcode = `
            <div class="eachBookCallNo" id=${totalData[i].accNo}>
                <div class="callNo">
                    ${accessionNumber} <br>
                    ${totalData[i].initial}<br>
                    ${classNumber}
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

//this is used to navigate both member and loan. 
export async function buildMemberNavigation(area, backward, forward, memberType, index, updateFunction, onIndexChange){
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
            updateFunction(memberType, index)
            onIndexChange(index)
        })
    }
    
    if(collectionBackward){
        collectionBackward.addEventListener("click", () => {
            index --;
            updateFunction(memberType, index)
            onIndexChange(index)
        })
    }
    
}

export async function buildLoanHistoryNavigation(area, backward, forward, index, updateFunction, onIndexChange){
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
    let cards = [];
    memberData.forEach((eachMember) => {
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
                    <img src="../../assets/YRC-Student-Heading.jpg">
                </div>

                <div class="cardBody">
                    <div class="photoArea">
                        <div>
                            <img src="${filePath}${eachMember.photo}" class="photoId">
                        </div>
                        <div> ${eachMember.memberId}</div>
                    </div>
                    <div class="individualData">
                        <div class="firstRow">
                            <div id="memberName">
                                <div>Name</div>
                                <div>${eachMember.name}</div>
                            </div>

                            <div id="memberPhone">
                                <div>Phone Number</div>
                                <div>${eachMember.phone}</div>
                            </div>
                        </div>
                        <div class="secondRow">
                            <div id="studentId">
                                <div>Student Id</div>
                                <div>${secondRowData1}</div>
                            </div>

                            <div id="type">
                                <div>Type</div>
                                <div>${eachMember.memberType}</div>                        
                            </div>


                        </div>

                        <div class="thirdRow">
                            <div id="memberAddress">
                                <div>Address</div>
                                <div>${eachMember.currentAddress}</div>                        
                            </div>
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

export function generateBackCardDesigns(noOfCards, language = "Myanmar"){
    let cardFormat;
    if(language=="Myanmar"){
        cardFormat = `
            <div class="cardFormat">
                <img src="../../assets/rulesYRC-mm.jpg" style="width: 100%; border-radius: 15px;">
            </div>
        `
    }else{
        cardFormat = `
            <div class="cardFormat">
                <img src="../../assets/rulesYRC-eng.jpg" style="width: 100%; border-radius: 15px;">
            </div>
        `
    }

    let allBackCards = [];
    for(let i = 0; i < noOfCards; i++){
        allBackCards.push(cardFormat)
    }

    return allBackCards;

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

        // if(tableRows.length %2 != 0 && i == finalIndexOfRow){\
        if(eachRow.children.length %2 != 0 && i == finalIndexOfRow){
            console.log("extra td here")
            let td = document.createElement("td")
            tableRows[finalIndexOfRow].appendChild(td)
        }

        table.appendChild(eachRow)
    })
}

// export function attachBackSideToDiv(table, cardData){
//     let tableRows = []
//     cardData.forEach((eachCard, i) => {
//         if(i % 2 === 0){
//             // let tr = 
//             let tr = document.createElement("tr")
//             tableRows.push(tr)
//         }

//         let finalIndex = tableRows.length - 1
//         let td = document.createElement("td")
//         td.innerHTML = eachCard
//         tableRows[finalIndex].appendChild(td)
//     }) 
// }
// export async function buildMemberCardCollectionView(views, totalData, tr, td, trArrays){

// }

export function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export const todayDate = (nextDay = 0) => {
    let today = new Date();
    today.setDate(today.getDate() + nextDay)
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today =  yyyy + "-" + mm + "-" + dd;
    return Date.parse(today);
}

export let dotImages = {
    red_dot: currentDirectory +  "/assets/red-dot.svg",
    black_dot : currentDirectory + "/assets/black-dot.svg",
    orange_dot : currentDirectory + "/assets/orange-dot.svg",
    green_dot : currentDirectory + "/assets/green-dot.svg"
  }