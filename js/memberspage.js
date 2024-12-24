import { getAllMembersFunction } from "../controllers/member.controller.js";
import Member from "../utils/member.model.js";
import {buildMemberNavigation} from "../utils/extra.js"
const filePath = window.imagePaths.shareFilePath();
const backToCollection = document.getElementById("backToCollection")
const memberNavigationArea = document.getElementById("memberNavigationArea");
const totalData = document.getElementById("totalData");
const addMemberBtn = document.getElementById("addMemberBtn");
const memberDataEl = document.getElementById("memberData");

let index = 1;
updateMemberData()

if(addMemberBtn){
    addMemberBtn.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("addMember.html")
    })
}

if(backToCollection){
    // console.log("doesnt this catch this function as well?")
    backToCollection.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("memberspage.html")
    })
}

async function updateMemberData(page=1){
    let result = await getAllMembersFunction(page);
    let totalLength = result.result.totalItems;
    let totalPages = result.result.totalPages;
    totalData.innerText = `Total Members: ${totalLength}`

    if(totalPages > 1) {
        if(page == 1){
            buildMemberNavigation(memberNavigationArea, false, true, index, updateMemberData, updateNewIndex)
        }else if(page === totalPages){
            buildMemberNavigation(memberNavigationArea, true, false, index, updateMemberData, updateNewIndex)
        }else{
            buildMemberNavigation(memberNavigationArea, true, true, index, updateMemberData, updateNewIndex)
        }
    }else{
        buildMemberNavigation(memberNavigationArea, false, false, index, updateMemberData, updateNewIndex)
    }

    let memberIds = [];
    let totalMemeberData = result.result.items
    
    if(totalMemeberData.length > 0){
        memberDataEl.innerHTML = ``;
        totalMemeberData.forEach((eachMember) => {
            // let memberData = new Member(eachMember);
            memberIds.push(eachMember.memberDatabaseId);
            const newRow = document.createElement("tr");
            let imagePath = filePath + eachMember.photo;
            let expiryDate = new Date(eachMember.expiryDate);
            let formattedDate = expiryDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            newRow.innerHTML = 
                `<td>${eachMember.memberId}</td>
                <td><img src="${imagePath}" alt="Member Photo" class="member-photo"></td>
                <td>${eachMember.name}</td>
                <td>${eachMember.gender}</td>
                <td>${eachMember.memberType}</td>
                <td>${eachMember.phone}</td>
                <td>${formattedDate}</td>
                <td><button class="detailedMember">View Details</button></td>
                `
            memberDataEl.appendChild(newRow);
        })
    }else{
        memberDataEl.innerHTML = `
        <tr>
            <td colspan="8">
                There are no members at the moment
            </td>
        </tr>
        `
    }
}

function updateNewIndex(newIndex){
    index = newIndex;
}