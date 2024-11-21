import {addBookEndpoint, getBookEndpoint} from "../utils/links.js"

const token = await window.cookieApi.getCookie()

export async function addBookFunction(BookFormatData){
    const res = await fetch(addBookEndpoint, {
        method: "POST",
        headers: {
            // "Content-Type": "application/json",
             authorization: `Bearer ${token[0].value}`,
        },
        body: BookFormatData
    })

    return (await res.json());
}

export async function getAllBooksFunction(category, page){
    const res = await fetch(getBookEndpoint(category, page), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`,
        }
    })

    return (await res.json())
}