import { loginEndpoint } from "../utils/links.js";

const loginForm = document.getElementById("loginForm")
loginForm.addEventListener("submit", async(e) => {
    e.preventDefault()
    const email = e.target.email.value;
    const password = e.target.password.value;
    const {statusCode, response} = await login(email, password)
    alert(response.msg)
    if(statusCode == 200){
        
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