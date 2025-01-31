import { getAllMembersFunction, searchMemberFunction } from "../../controllers/member.controller.js";
import {buildMemberNavigation} from "../../utils/extra.js"
const filePath = window.imagePaths.shareFilePath();
const memberNavigationArea = document.getElementById("memberNavigationArea");
const memberDataEl = document.getElementById("memberData");
let index = 1;
let searchedHistory = sessionStorage.getItem("searchMemberResult")
let searchedKeyword = sessionStorage.getItem("searchMemberData")

if(!searchedHistory){
  updateMemberData()
}else{
  placeItemsInSearchForm(searchedKeyword)
  showSearchResults(searchedHistory)
}

async function updateMemberData(page = 1){
  let result = await getAllMembersFunction(page);
  let totalLength = result.result.totalItems;
  let totalPages = result.result.totalPages;
  totalData.innerText = `Total Members: ${totalLength}`

  if(totalPages > 1){
    if(page == 1){
       buildMemberNavigation(memberNavigationArea, false, true, index, updateMemberData, updateNewIndex)
    }else if (page === totalPages){
      buildMemberNavigation(memberNavigationArea, true, false, index, updateMemberData, updateNewIndex)
    }else{
      buildMemberNavigation(memberNavigationArea, true, true, index, updateMemberData, updateNewIndex)
    }
  }else{
     buildMemberNavigation(memberNavigationArea, false, false, index, updateMemberData, updateNewIndex)
  }

  let totalMemberData = result.result.items

  if(totalMemberData.length > 0){
    memberDataEl.innerHTML = ``
    showEachMember(memberDataEl, totalMemberData)
  }else{
    memberDataEl.innerHTML = `
      <tr>
        <td colspan="8">
          There are no members at the moment. 
        </td>
      </tr>
    `
  }
}

function showEachMember(placeDiv, memberData){
  for(let eachMember of memberData){
    const newRow = document.createElement("tr")
    let imagePath = filePath + eachMember.photo
    let expiryDate = new Date(eachMember.expiryDate)
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
       <td><button class="detailedMember" id=${eachMember._id}>View Details</button></td>
      `
    placeDiv.appendChild(newRow);

    viewDetailedMemberFunction()
  }
}

function viewDetailedMemberFunction(){
  const detailedButtons = document.querySelectorAll(".detailedMember")
  detailedButtons.forEach((eachButton) => {
    console.log
    eachButton.addEventListener("click", async() => {
      let detailedMember = {
        id: eachButton.id
      }
      sessionStorage.setItem("memberId", JSON.stringify(detailedMember))
      window.navigationApi.toAnotherPage("./memberDetail.html")
    })
  })
}

function updateNewIndex(newIndex){
  index = newIndex;
}