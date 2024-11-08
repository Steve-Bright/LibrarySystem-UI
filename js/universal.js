const navigationPanel = document.getElementById('navigationPanel')

navigationPanel.innerHTML = `
    <div id="logoTitle">Kayin Gyi <br> Library</div>
    <div id="navigationPages">
        <div class="navigationTitle">Dashboard</div>
        <div class="navigationTitle">Collection</div>
        <div class="navigationTitle">Members</div>
        <div class="navigationTitle">Lists</div>
        <div class="navigationTitle">Settings</div>
        <div class="navigationTitle">SignOut</div>
    </div>
    <div id="whiteSpace"></div>
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