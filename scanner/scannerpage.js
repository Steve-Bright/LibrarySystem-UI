// const testInput = document.getElementById("testInput")
// testInput.focus();
// document.addEventListener("input", function (e) {
//     console.log("Input detected:", e.data); // Logs the raw input
//     // window.navigationApi.toAnotherPage("settingspage.html")
// });

import {getDetailedBookFromAccNo} from "../controllers/book.controller.js"
import { getDetailedMemberFromMemberId } from "../controllers/member.controller.js";

const inputField = document.getElementById("testInput");
inputField.focus();
inputField.addEventListener("change", async () => {
    console.log("Scanned:", inputField.value);
    let inputData = inputField.value;

    let category;
    let accNo;
    let memberId;
    let notFound = false;
    if(inputData.includes(",")){
        let searchData = inputField.value.split(",")
        category = searchData[0]
        accNo = searchData[1]
    }else{
        memberId = inputData;
    }
    
    if(category && accNo){
        let result = await getDetailedBookFromAccNo(category, accNo)
        if(result.result){
            let detailedBook = result.result
            sessionStorage.setItem("bookId", JSON.stringify({category, id: detailedBook._id})) 
            window.navigationApi.toAnotherPage("./books/viewBook/viewBook.html")
        }else{
            window.showMessageApi.alertMsg("Book not found.")
        }
    }else if(memberId){
        let result = await getDetailedMemberFromMemberId(memberId);
        if(result.result){
            let detailedMember = result.result;
            sessionStorage.setItem("memberId", JSON.stringify({id: detailedMember._id}))
            window.navigationApi.toAnotherPage("./members/viewMember/viewMember.html")
        }else{
            window.showMessageApi.alertMsg("Member not found")
        }
    }
    inputField.value = ""
    // window.location.reload()
    
});
