

const navigationPanel = document.getElementById('navigationPanel')

navigationPanel.innerHTML = `
    <div id="logoTitle">KayinGyi <br> Library</div>
    <div id="navigationPages">
        <div id="scannerPage" class="navigationTitle">
            <div class="imageDiv"> <img src="./assets/barcode-scan.png"></div> 
            Scanner
        </div>

        <div id="dashboardPage" class="navigationTitle">
            <div class="imageDiv"><img src="./assets/dashboard.png"></div>
            <div>Dashboard</div>
            
        </div>
        
        <div id="collectionPage" class="navigationTitle">
            <div class="imageDiv"><img src="./assets/book-pile-white.png"></div>
            Collection
        </div>

        <div id="membersPage" class="navigationTitle">
            <div class="imageDiv"><img src="./assets/reader-white.png"></div>
            
            Members
        </div>

        <div id="loanPage" class="navigationTitle">
            <div class="imageDiv"><img src="./assets/clipboard-white.png"></div>
            
            Loan
        </div>

        <div id="settingsPage" class="navigationTitle">
            <div class="imageDiv"><img src="./assets/settings-white.png"></div>
            
            Settings
        </div>

        <div id="signOutPage" class="navigationTitle">
            <div class="imageDiv"><img src="./assets/sign-out-white.png"></div>
            SignOut
        </div>
    </div>
    <div id="whiteSpace">
        Server Status
    </div>
`

const pageIds = [
    "scannerPage",
    "dashboardPage",
    "collectionPage",
    "membersPage",
    "loanPage",
    "settingsPage",
];
const pageHtmls = [
    "scannerpage.html",
    "index.html",
    "collectionpage.html",
    "memberspage.html",
    "loanpage.html",
    "settingspage.html"
]
const pageSelectors = [
    ".scannerSelector",
    ".dashboardSelector",
    ".collectionSelector",
    ".membersSelector",
    ".loansSelector",
    ".settingsSelector",
  ];

pageIds.forEach((pageId, i) => {
    const pageButton = document.getElementById(pageId)
    // console.log(pageId, pageButton); 
    pageButton.addEventListener("click", ()=> {
        window.navigationApi.toAnotherPage(pageHtmls[i])
    })
})

pageSelectors.forEach((pageSelector, i) => {
    const selectedPage = document.querySelector(pageSelector)
    if(selectedPage){
        const pageSelector = document.querySelector(`#navigationPages #${pageIds[i]}`)
        pageSelector.style.textDecoration = "underline"
    }
})

const signOutButton = document.getElementById('signOutPage')
signOutButton.addEventListener('click', ()=> {
        window.location.reload();
        window.cookieApi.signOut();
    })
let token;
document.addEventListener("DOMContentLoaded", async() => {
    const {statusCode} = window.cookieApi.checkCookie();
    if(statusCode == 200){
        token = await window.cookieApi.getCookie()
        // window.showMessageApi.alertMsg("you have a token")
    }else{
        // window.showMessageApi.alertMsg("you don't have a token")
        window.navigationApi.toAnotherPage("signIn.html")
    }
})

export default token;