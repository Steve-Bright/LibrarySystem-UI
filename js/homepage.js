import { checkCookie } from "../utils/cookie.js"
import { checkCookieEndpoint } from "../utils/links.js"

// document.addEventListener("DOMContentLoaded", async() => {
//     const {statusCode, response} = await checkCookie(checkCookieEndpoint)
//     if(statusCode == 200){
//         alert("you have token")
//     }else{
//         alert("you don't have token")
//     }
// })


// const test_button = document.getElementById("test_button")
//         test_button.addEventListener("click", ()=> {
//             window.windowapi.sendMessage("navigate-to-page", "index.html")
// })

const borrowsEl = document.getElementById("borrows")
// borrowsEl.innerHTML = window.sharingDataApi.receiveData();

const collectionPage = document.getElementById("collectionPage")
const membersPage = document.getElementById("membersPage")
const listsPage = document.getElementById("listsPage")
const settingsPage = document.getElementById("settingsPage")

collectionPage.addEventListener('click', () => {
    window.navigationApi.toAnotherPage("collectionpage.html")
})
