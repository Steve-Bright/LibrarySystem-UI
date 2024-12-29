import { deleteLoanFunction, extendLoanFunction, getAllLoansFunction, getDetailedLoanFunction, returnLoanFunction} from "../controllers/loan.controller.js";
import Book from "../utils/book.model.mjs";
import { buildMemberNavigation } from "../utils/extra.js";
import Loan from "../utils/loan.model.mjs";
import Member from "../utils/member.model.js";
const filePath = window.imagePaths.shareFilePath();
const totalDataEl = document.getElementById("totalData");
const loanDataEl = document.getElementById("loanData");
const loanNavigationArea = document.getElementById("loanNavigationArea");
const backToCollection = document.getElementById("backToCollection");
const loanDetailForm = document.getElementById("loanDetailForm");
const viewBookCover = document.getElementById("viewBookCover")
const viewMemberPhoto = document.getElementById('viewMemberPhoto')
const borrowButton = document.getElementById("borrowBook")
const deleteLoanBtn = document.getElementById("deleteLoanBtn")
const extendLoanBtn = document.getElementById("extendLoanBtn")
const returnLoanBtn = document.getElementById("returnLoanBtn")
const searchMember = document.getElementById("searchMember")
const searchBook = document.getElementById("searchBook")
const currentFile = window.imagePaths.shareCurrentFile();
let index = 1;

if(backToCollection){
    // console.log("doesnt this catch this function as well?")
    backToCollection.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("loanpage.html")
    })
}

if(borrowButton){
    borrowButton.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("borrowBook.html")
    })
}

if(searchMember){
    searchMember.addEventListener("click", () => {
        let windowFeatures = {
            "width":794,
            "height":400
    
        }
        let data = {
            "fileName": currentFile+"/searchMembers.html",
            "name": "Print Window",
            "windowFeatures": windowFeatures
        }
        window.navigationApi.openWindow(data);
        // let previewWindow = window.open(currentFile+"/printpreview.html", "Print Window", windowFeatures);
        document.close()
    })
}

if(searchBook){
    searchBook.addEventListener("click", () => {
        let windowFeatures = {
            "width":794,
            "height":400
    
        }
        let data = {
            "fileName": currentFile+"/searchBooks.html",
            "name": "Print Window",
            "windowFeatures": windowFeatures, 
            enableDevTools: true
        }
        window.navigationApi.openWindow(data);
        // let previewWindow = window.open(currentFile+"/printpreview.html", "Print Window", windowFeatures);
        document.close()
    })
}

let buttonClick;

if(deleteLoanBtn){
    deleteLoanBtn.addEventListener("click", ()=>{
        window.showMessageApi.confirmMsg("Are you sure you want to delete the loan?")
    })
            window.showMessageApi.dialogResponse(async(event, response) => {
                // console.log("this is button click " + buttonClick)
                let loanDetail = localStorage.getItem("loanDetail")
                loanDetail = JSON.parse(loanDetail)
                if(!response){
                    const result = await deleteLoanFunction(loanDetail._id)
                    window.showMessageApi.alertMsg(result.msg)
                }
    
            })

}




if(extendLoanBtn){
    extendLoanBtn.addEventListener("click", ()=>{
        window.showMessageApi.confirmMsg2("Are you sure you want to extend the loan?")
    })
            window.showMessageApi.dialogResponse2(async(event, response) => {
                // console.log("this is button click " + buttonClick)
                let loanDetail = localStorage.getItem("loanDetail")
                loanDetail = JSON.parse(loanDetail)
                if(!response){
                    const result = await extendLoanFunction(loanDetail._id)
                    window.showMessageApi.alertMsg(result.msg)
                }
    
            })
}

if(returnLoanBtn){
    returnLoanBtn.addEventListener("click", () => {
        window.showMessageApi.confirmMsg3("Are you sure you want to return the loan?")
    })

    window.showMessageApi.dialogResponse3(async(event, response) => {
        let loanDetail = localStorage.getItem("loanDetail")
        loanDetail = JSON.parse(loanDetail)
        if(!response){
            const result = await returnLoanFunction(loanDetail._id)
            window.showMessageApi.alertMsg(result.msg)
        } 
    })
}


if(totalDataEl){
    updateLoanData()
}

if(loanDetailForm){
    updateLoanDetail()
}

async function updateLoanData(page = 1){
    let result = await getAllLoansFunction(page);
    let totalLength = result.result.totalItems;
    let totalPages = result.result.totalPages;
    totalDataEl.innerHTML = `Total Loans: ${totalLength}`;

    if(totalPages > 1){
        if(page == 1){
            buildMemberNavigation(loanNavigationArea, false, true, index, updateLoanData, updateNewIndex)
        }else if (page === totalPages){
            buildMemberNavigation(loanNavigationArea, true, false, index, updateLoanData, updateNewIndex)
        }else{
            buildMemberNavigation(loanNavigationArea, true, true, index, updateLoanData, updateNewIndex)
        }
    }else{
        buildMemberNavigation(loanNavigationArea, false, false, index, updateLoanData, updateNewIndex)
    }

    let loanIds = []
    let totalLoanData = result.result.items;

    if(totalLoanData.length > 0){
        totalDataEl.innerHTML = ``
        totalLoanData.forEach((eachLoan) => {
            // console.log("each loan " + JSON.stringify(eachLoan))
            loanIds.push(eachLoan._id)
            let loanDate = new Date(eachLoan.loanDate)
            let dueDate = new Date(eachLoan.dueDate)
            let formattedLoanDate = loanDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            let formattedDueDate = dueDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            const newRow = document.createElement("tr")
            newRow.innerHTML = `
                <td>${eachLoan.memberId.memberId}</td>
                <td>${eachLoan.memberId.name}</td>
                <td>${eachLoan.bookId.category}</td>
                <td>${eachLoan.bookId.bookTitle}</td>
                <td>${eachLoan.bookId.callNo}</td>
                <td>${formattedLoanDate}</td>
                <td>${formattedDueDate}</td>
                <td><button class="detailedLoan">View Details </button></td>
            `
            loanDataEl.appendChild(newRow)
        })

        // console.log("loan Ids", loanIds)
        viewDetailedMemberFunction(loanIds)
    }else{
        loanDataEl.innerHTML = `
            <tr>
                <td colspan="8">No Loans</td>
            </tr>
        `
    }
}

function viewDetailedMemberFunction(loanIds){
    const detailedButtons = document.querySelectorAll(".detailedLoan")
    detailedButtons.forEach((eachButton, index) => {
        eachButton.addEventListener("click", async() => {
            let detailedLoan = await getDetailedLoanFunction(loanIds[index])
            localStorage.setItem("loanDetail", JSON.stringify(detailedLoan.result))
            window.navigationApi.toAnotherPage("loanDetail.html")
            // window.location.href = `/loan/${loanIds[index]}`
        })
    })
}

function updateNewIndex(newIndex){
    index = newIndex;
}

function updateLoanDetail(){
    let loanDetail = localStorage.getItem("loanDetail")
    let loan = new Loan(JSON.parse(loanDetail))
    // console.log("this is loan detail " + JSON.stringify(loan))
    let loanBook = new Book(loan.bookId)
    // console.log("this is loan detail " + JSON.stringify(Object.keys(loanBook)))
    let loanMember = new Member(loan.memberId)
    // console.log("this is loan detail " + JSON.stringify(loanMember))
    delete loan.memberId
    delete loan.bookModel
    delete loan.bookId
    delete loan.overdue
    delete loanMember.loanBooks;
    delete loanBook.loanStatus;
    // console.log("this is loan detail " + JSON.stringify(loan))

    const viewBook = document.querySelectorAll("#bookInfo input")
    const viewMember = document.querySelectorAll("#memberInfo input")
    const viewLoan = document.querySelectorAll("#loanInfo input")
    let bookIndex = 0;
    let memberIndex = 0
    let loanIndex = 0;

    setTimeout(() => {
        Object.keys(loanMember).forEach((eachKey) => {
            // console.log("each key " + eachKey)
            if(eachKey == "photo"){
                viewMemberPhoto.src = filePath +loanMember[eachKey]
            }else if(loanMember[eachKey] != undefined && eachKey != "photo"){
                // console.log("helo? " + eachKey)
                viewMember[memberIndex].value = loanMember[eachKey]
                memberIndex++
            }
        })
        Object.keys(loanBook).forEach((eachKey) => {
            if(eachKey == "bookCover"){
                viewBookCover.src = filePath + loanBook[eachKey]
            }else if(loanBook[eachKey] != undefined && eachKey != "bookCover"){
                // console.log("view book " + eachKey)
                viewBook[bookIndex].value = loanBook[eachKey]
                bookIndex++
            }
        })

        Object.keys(loan).forEach((eachKey) => {
            // console.log("each key " + eachKey)
            if(loan[eachKey] != undefined){
                viewLoan[loanIndex].value = loan[eachKey]
                loanIndex++
            }
        })

        
    }, 300)
}
