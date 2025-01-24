import {addBookEndpoint, getBookEndpoint, getBookDetailEndpoint, editBookEndpoint, deleteBookEndpoint, getLatestAccNoEndpoint, getBookFromAccNoEndpoint, searchBookEndpoint} from "../utils/links.js"

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

export async function getDetailedBookFromAccNo(category, accNo){
    const res = await fetch(getBookFromAccNoEndpoint(category, accNo), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`,
        }
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

export async function getLatestAccNo(category){
    const res = await fetch(getLatestAccNoEndpoint(category), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        }
    })
    const response = await res.json()
    return response.result;
}

export async function generateBarCode(category, accNo){
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        // let bookCategory;
        // if(category == "english"){
        //     bookCategory = "eng"   
        // }else{
        //     bookCategory = "mm"
        // }
        // let storedData = `${ bookCategory +","+ accNo }`;
        let storedData = `${ category +","+ accNo }`;
        
        JsBarcode(canvas, storedData, { displayValue: false });

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `${category}-${accNo}.png`, { type: "image/png" });
                resolve(file); // Resolves the Promise with the URL
            } else {
                reject(new Error("Failed to create Blob from canvas."));
            }
        });
    });
}

export async function searchBook(searchData){
    const res = await fetch(searchBookEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        },
        body: JSON.stringify(searchData)
    })


    const response = await res.json()
    return response.result;
}