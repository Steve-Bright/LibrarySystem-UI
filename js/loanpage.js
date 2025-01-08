import { addLoanFunction, deleteLoanFunction, extendLoanFunction, getAllLoansFunction, getDetailedLoanFunction, returnLoanFunction} from "../controllers/loan.controller.js";
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
const clearLoan = document.getElementById("clearLoan")
const addMemberArea = document.getElementById('addMemberArea')
const addBookArea = document.getElementById("addBookArea")
const initateBookBtn = document.getElementById("initateBookBtn")
const currentFile = window.imagePaths.shareCurrentFile();
let index = 1;

if(addMemberArea){
    let borrowMember = localStorage.getItem("borrowMember")
    borrowMember = JSON.parse(borrowMember)
    if(borrowMember){
        addMemberArea.classList.add("borrowBookDesign")
        addMemberArea.innerHTML = `
            <h2>Member Info </h2>
            <span id="goToMemberDetails">Details</span>
            <br>
            
            <div id="memberContents">
                <div id="memberCover">
                    <img src=${filePath + borrowMember.photo} id="memberPhotoSize">
                </div>

                <div id="memberDetailInfo">
                    
                    <label for="memberId">Member Id</label>
                    <input type="text" value="${borrowMember.memberId}" readonly>
                    <br>

                    <label for="memberName">Name</label>
                    <input type="text" value="${borrowMember.name}" readonly>
                    <br>
                    <label for="memberType">Member Type </label>
                    <input type="text" value="${borrowMember.memberType}" readonly>
                    <br>
                    <label for="memberPhone">Phone</label>
                    <input type="text" value="${borrowMember.phone}" readonly>
                </div>
            </div>
        `
    }

    const goToMemberDetailsBtn = document.getElementById("goToMemberDetails")
    if(goToMemberDetailsBtn){
        goToMemberDetailsBtn.addEventListener("click", () => {
            localStorage.setItem("detailedMemberData", JSON.stringify(borrowMember))
            window.navigationApi.toAnotherPage("memberDetail.html")
        })
    }
    

}

if(addBookArea){
    let borrowBook = localStorage.getItem("borrowBook")
    borrowBook = JSON.parse(borrowBook)
    if(borrowBook){
        addBookArea.classList.add("borrowBookDesign")
        addBookArea.innerHTML = `
            <h2>Book Info</h2>
            <span id="goToBookDetails">Details</span>
            <br>
            
            <div id="bookContents">
                <div id="bookCover">
                    <img src=${filePath + borrowBook.bookCover} id="bookCoverSize">
                </div>

                <div id="bookDetailInfo">
                    
                    <label for="bookCategory">Category</label>
                    <input type="text" value="${borrowBook.category}" readonly>
                    <br>

                    <label for="callNo">Call No </label>
                    <input type="text" value="${borrowBook.callNo}" readonly>
                    <br>
                    <label for="bookTitle">Book Title </label>
                    <input type="text" value="${borrowBook.bookTitle}" readonly>
                </div>
            </div>
            
        `

        const goToBookDetailsBtn = document.getElementById("goToBookDetails")
        if(goToBookDetailsBtn){
            goToBookDetailsBtn.addEventListener("click", () => {
                localStorage.setItem("detailedBookData", JSON.stringify(borrowBook))
                window.navigationApi.toAnotherPage("viewBook.html")
            })
        }
        
    }
}

if(initateBookBtn){
    initateBookBtn.addEventListener("click", async()=> {
        let loanBookDetail = localStorage.getItem("borrowBook")
        let loanMemberDetail = localStorage.getItem("borrowMember")

        if(loanBookDetail && loanMemberDetail){
            // console.log("inside  the loaning function " + loanBookDetail + loanMemberDetail)
            let loanBook = JSON.parse(loanBookDetail)
            let loanMember = JSON.parse(loanMemberDetail)

            // let loanDetail = 
            let loan = new Loan({
                // category: loanBook.category,
                bookId: loanBook._id,
                memberId: loanMember._id
            })
            loan.category = loanBook.category;
            let loanResult = await addLoanFunction(loan);
            window.showMessageApi.alertMsg(loanResult.msg)
            if(loanResult.con === true){
                localStorage.removeItem("borrowBook")
                localStorage.removeItem("borrowMember")
                window.location.reload()
            }
        }

    })
}

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

if(clearLoan){
    clearLoan.addEventListener("click", () => {
        localStorage.removeItem("borrowBook")
        localStorage.removeItem("borrowMember")
        window.showMessageApi.alertMsg("Cleared!")
        window.location.reload()
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
            "name": "Search Member",
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
            "name": "Search Book",
            "windowFeatures": windowFeatures,
        }
        
        window.navigationApi.openWindow(data);
        // let previewWindow = window.open(currentFile+"/printpreview.html", "Print Window", windowFeatures);
        // document.close()
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
