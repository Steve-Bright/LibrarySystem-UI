import { getAllMembersEndpoint, getLatestMemberIdEndpoint, addMemberEndpoint, getMemberDetailEndpoint, deleteMemberEndpoint, editMemberEndpoint, getMemberFromMemberIdEndpoint, searchMemberEndpoint, getMemberLoanHistoryEndpoint, banMemberEndpoint, checkBannedUntilEndpoint, extendMembershipEndpoint, getMemberNumsEndpoint} from "../utils/links.js";

const token = await window.cookieApi.getCookie()

export async function getAllMembersFunction(memberType, page){
    const res = await fetch(getAllMembersEndpoint(memberType, page), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`,
        }
    })

    return (await res.json())
}

export async function getLatestMemberId(memberType){
    const res = await fetch(getLatestMemberIdEndpoint(memberType), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`,
        }
    })

    let result = await res.json()
    return (result.result)
}

export async function getDetailedMember(memberDatabaseId){
    const res = await fetch(getMemberDetailEndpoint(memberDatabaseId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`,
        }
    })

    return (await res.json())
}

export async function getDetailedMemberFromMemberId(memberId){
    const res = await fetch(getMemberFromMemberIdEndpoint(memberId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`,
        }
    })

    return (await res.json())
}

export async function addMemberFunction(MemberFormatData){
    const res = await fetch(addMemberEndpoint, {
        method: "POST",
        headers: {
            // "Content-Type": "application/json",
             authorization: `Bearer ${token[0].value}`,
        },
        body: MemberFormatData
    })

    return (await res.json());
    
}

export async function generateBarCode(memberId){
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        // let bookCategory;
        // if(category == "english"){
        //     bookCategory = "eng"   
        // }else{
        //     bookCategory = "mm"
        // }
        // let storedData = `${ bookCategory +","+ accNo }`;
        let storedData = `${ memberId }`;
        
        JsBarcode(canvas, storedData, { displayValue: false });

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `${memberId}.png`, { type: "image/png" });
                resolve(file); // Resolves the Promise with the URL
            } else {
                reject(new Error("Failed to create Blob from canvas."));
            }
        });
    });
}

export async function deleteMember(memberDatabaseId){
    const res = await fetch(deleteMemberEndpoint(memberDatabaseId), {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        }
    })
    return (await res.json())
}

export async function editMember(memberFormatData){
    const res = await fetch(editMemberEndpoint, {
        method: "PUT", 
        headers: {
            // "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        },
        body: memberFormatData
    })

    return (await res.json())
}

export async function searchMemberFunction(memberData){
    const res = await fetch(searchMemberEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        },
        body: JSON.stringify(memberData)
    })
    return (await res.json())
}

export async function getMemLoanHis(memberDatabaseId, page) {
    const res = await fetch(getMemberLoanHistoryEndpoint(memberDatabaseId, page), {
        method: "GET", 
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        }
    })

    return (await res.json())
}

export async function toggleBan(memberDatabaseId, block){
    const res = await fetch(banMemberEndpoint(memberDatabaseId, block), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        }
    })

    return (await res.json())
}

export async function checkBannedUntil(memberDatabaseId){
    const res = await fetch(checkBannedUntilEndpoint(memberDatabaseId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        }
    })

    let result = await res.json()
    return result.result.banUntil;
}

export async function extendMembership(memberDatabaseId){
    const res = await fetch(extendMembershipEndpoint(memberDatabaseId), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        }
    })

    return (await res.json())
}

export async function getMemberNums(duration){
    const res = await fetch(getMemberNumsEndpoint(duration), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token[0].value}`
        }
    })

    let result = await res.json()
    return (result.result)
}