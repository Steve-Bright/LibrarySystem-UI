import { getAllMembersEndpoint } from "../utils/links.js";

const token = await window.cookieApi.getCookie()

export async function getAllMembersFunction(page){
    const res = await fetch(getAllMembersEndpoint(page), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`,
        }
    })

    return (await res.json())
}