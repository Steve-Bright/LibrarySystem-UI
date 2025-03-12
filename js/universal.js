let currentDirectory = window.sharingDataApi.currentDirectory();
const logoPath = currentDirectory + "/assets/rcs_blue_bg_transparent.png"
const barcodeScanPath = currentDirectory + '/assets/barcode-scan.png';
const dashboardPath = currentDirectory + "/assets/dashboard.png";
const bookPilePath = currentDirectory + "/assets/book-pile-white.png"
const readerPath = currentDirectory + "/assets/reader-white.png"
const clipboardPath = currentDirectory + "/assets/clipboard-white.png"
const settingsPath = currentDirectory + "/assets/settings-white.png"
const signOutPath = currentDirectory + "/assets/sign-out-white.png"
const cataloguePath = currentDirectory + "/assets/catalogue.png"
const navigationPanel = document.getElementById('navigationPanel')

navigationPanel.innerHTML = `
    <div id="logoTitle">
        <img src=${logoPath} alt="logo" id="logoImage">
    </div>
    <div id="navigationPages">
        <div id="scannerPage" class="navigationTitle">
            <div class="imageDiv"> <img src=${barcodeScanPath}></div> 
            Scanner
        </div>

        <div id="dashboardPage" class="navigationTitle">
            <div class="imageDiv"><img src=${dashboardPath}></div>
            <div>Dashboard</div>
            
        </div>
        
        <div id="collectionPage" class="navigationTitle">
            <div class="imageDiv"><img src=${bookPilePath}></div>
            Collection
        </div>

        <div id="membersPage" class="navigationTitle">
            <div class="imageDiv"><img src=${readerPath}></div>
            
            Members
        </div>

        <div id="loanPage" class="navigationTitle">
            <div class="imageDiv"><img src=${clipboardPath}></div>
            
            Loan
        </div>

        <div id="settingsPage" class="navigationTitle">
            <div class="imageDiv"><img src=${settingsPath}></div>
            
            Settings
        </div>

        <div id="signOutPage" class="navigationTitle">
            <div class="imageDiv"><img src=${signOutPath}></div>
            SignOut
        </div>
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
    "./scanner/scannerpage.html",
    "./dashboard/index.html",
    "./books/collection/collectionpage.html",
    "./members/allmembers/memberspage.html",
    "./loans/allLoans/loanpage.html",
    "./settings/settingspage.html"
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
        // pageSelector.style.textDecoration = "underline"
        pageSelector.style.backgroundColor = "#021c6f"
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
        console.log("expire date " + token[0].expirationDate)
        const currentTimestamp = Math.floor(Date.now() / 1000);

        // if(currentTimestamp > token[0].expirationDate){
        //     alert("your token is expired")
        //     window.cookieApi.signOut();
        //     // window.location.reload()
        // }
    }else{
        window.navigationApi.toAnotherPage("./auth/signIn.html")
    }
})

export default token;