const navigationPanel = document.getElementById('navigationPanel')

navigationPanel.innerHTML = `
    <span id="dashboardPage">Dashboard</span>
    <span id="collectionPage">Collection</span>
    <span id="membersPage">Members</span>
    <span id="listsPage">Lists</span>
    <span id="settingsPage">Settings</span>
    <span id="signOut">SignOut</span>
`


const collectionPage = document.getElementById("collectionPage")
const membersPage = document.getElementById("membersPage")
const listsPage = document.getElementById("listsPage")
const settingsPage = document.getElementById("settingsPage")
const signOut = document.getElementById("signOut")

collectionPage.addEventListener('click', () => {
    window.navigationApi.toAnotherPage("collectionpage.html")
})

signOut.addEventListener('click', ()=> {
    window.location.reload();
    window.cookieApi.signOut();
})

document.addEventListener("DOMContentLoaded", async() => {
    const {statusCode} = window.cookieApi.checkCookie();
    console.log("This is your status code " + statusCode)
    // const {statusCode, response} = await checkCookie(checkCookieEndpoint)
    if(statusCode == 200){
        window.showMessageApi.alertMsg("you have a token")
    }else{
        window.showMessageApi.alertMsg("you don't have a token")
        window.navigationApi.toAnotherPage("signIn.html")
    }
})