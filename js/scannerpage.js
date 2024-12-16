// const testInput = document.getElementById("testInput")
// testInput.focus();
// document.addEventListener("input", function (e) {
//     console.log("Input detected:", e.data); // Logs the raw input
//     // window.navigationApi.toAnotherPage("settingspage.html")
// });

import {getDetailedBookFromAccNo} from "../controllers/book.controller.js"

const inputField = document.getElementById("testInput");
inputField.focus();
inputField.addEventListener("change", async () => {
    console.log("Scanned:", inputField.value);
    let searchData = inputField.value.split(",")
    
    let category = searchData[0]
    let accNo = searchData[1]

    let detailedBook = await getDetailedBookFromAccNo(category, accNo)
    console.log("searched data " + JSON.stringify(detailedBook))
    localStorage.setItem("detailedBookData", JSON.stringify(detailedBook.result)) 
    window.navigationApi.toAnotherPage("viewBook.html")
});
