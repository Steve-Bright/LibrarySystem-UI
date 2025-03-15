import { deleteTemp } from "../controllers/book.controller.js";
import { checkLoanFunction } from "../controllers/loan.controller.js";
import { checkBannedMembers } from "../controllers/member.controller.js";
import { loginEndpoint, cacheLocalLink} from "../utils/links.js";
const linkToSeverInput  = document.getElementById("linkToServer")
let localKey;
linkToSeverInput.addEventListener("change", () => {
    localKey = linkToSeverInput.value;
    cacheLocalLink(linkToSeverInput.value)
})

const loginForm = document.getElementById("loginForm")
loginForm.addEventListener("submit", async(e) => {
    e.preventDefault()
    const email = e.target.email.value;
    const password = e.target.password.value;
    const {statusCode, response} = await login(email, password)
    window.showMessageApi.alertMsg(response.msg)

    if(statusCode === 200){
        localStorage.clear()
        sessionStorage.clear();
        window.cookieApi.setCookie(response.result.token)
        window.sharingDataApi.sendData(response.result.userData)
        await checkBannedMembers();
        await checkLoanFunction()
        await deleteTemp()
        cacheLocalLink(localKey)
        window.navigationApi.toAnotherPage("./dashboard/index.html")
    }
 
})

async function login(email, password){
    const res =  await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email, password
        })
    })
    const response = await res.json();
    if (res.status === 200) {
        return { statusCode: 200, response };
    } else {
        return { statusCode: res.status, response };
    }
}

// i need to use ipc main and ipc renderer