import { getAllLoansEndpoint, getLoanDetailEndpoint } from "../utils/links.js";

const token = await window.cookieApi.getCookie()

export async function getAllLoansFunction(){
    const res = await fetch(getAllLoansEndpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`,
        }
    })

    return (await res.json())
}

export async function getDetailedLoanFunction(loanId){
    const res = await fetch(getLoanDetailEndpoint(loanId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`,
        }
    })

    return (await res.json())
}