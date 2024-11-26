import {addBookEndpoint, getBookEndpoint, getBookDetailEndpoint, editBookEndpoint, deleteBookEndpoint} from "../utils/links.js"

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

export async function getDetailedBook(category, bookId){
    const res = await fetch(getBookDetailEndpoint(category, bookId), {
        method: "GET", 
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`,
        },
    })

    return (await res.json())
}

export async function editBook(BookFormatData){
    const res = await fetch(editBookEndpoint, {
        method: "POST", 
        headers: {
            // "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        },
        body: BookFormatData
    })

    return (await res.json())
}

export async function deleteBook(category, bookId){
    const res = await fetch(deleteBookEndpoint(category, bookId), {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        }
    })
    return (await res.json())
}