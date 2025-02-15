import { addLoanEndpoint, deleteLoanEndpoint, extendLoanEndpoint, getAllLoansEndpoint, getLoanDetailEndpoint, returnLoanEndpoint, searchLoanEndpoint } from "../utils/links.js";

const token = await window.cookieApi.getCookie()

export async function getAllLoansFunction(loanType, page){
    const res = await fetch(getAllLoansEndpoint(loanType, page), {
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

export async function extendLoanFunction(loanId){
    const res = await fetch(extendLoanEndpoint(loanId), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        }
    })

    return (await res.json())
}

export async function returnLoanFunction(loanId){
    const res = await fetch(returnLoanEndpoint(loanId), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        }
    })

    return (await res.json())
}

export async function deleteLoanFunction(loanId){
    const res = await fetch(deleteLoanEndpoint(loanId), {
        method: "DELETE", 
        headers: {
             "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        }
    })

    return (await res.json())
}
 
export async function addLoanFunction(loanData){
    const res = await fetch(addLoanEndpoint, {
        method: "POST",
        headers: {
             "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        },
        body: JSON.stringify(loanData)
    })
    return (await res.json())
}

export async function searchLoan(loanType, searchData){
    const res = await fetch(searchLoanEndpoint(loanType), {
        method: "POST",
        headers: {
             "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        },
        body: JSON.stringify(searchData)
    })
    const response = await res.json();
    return response.result;
}

// export async function 