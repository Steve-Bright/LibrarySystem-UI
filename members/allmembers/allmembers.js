import { getAllMembersFunction, searchMemberFunction } from "../../controllers/member.controller.js";
import {buildMemberNavigation} from "../../utils/extra.js"
import { buildNavArea } from "../../utils/extra.js";
const filePath = window.imagePaths.shareFilePath();
const memberType = document.getElementById("memberType")
const memberNavigationArea = document.getElementById("memberNavigationArea");
const memberDataEl = document.getElementById("memberData");
const searchMemberForm = document.getElementById("searchMemberForm")
const addMemberBtn = document.getElementById("addMemberBtn");
const pageIndex = document.getElementById("memberPageIndex")
const totalPagesUI = document.getElementById("memberTotalPages")
const collectionBackward = document.querySelectorAll(".collectionBackward")
const collectionForward = document.querySelectorAll(".collectionForward")
const buttonsForward = document.getElementById("memberButtonsForward")
const buttonsBackward = document.getElementById("memberButtonsBackward")
const navigationButtons = document.getElementById('memberNavigationButtons')
let searchedHistory = sessionStorage.getItem("searchMemberResult")
let searchedKeyword = sessionStorage.getItem("searchMemberData")
const memberCards = document.getElementById("memberCards")
let memberTypeValue = cacheMemberType()
memberType.value = memberTypeValue;
let index = Number(cachePageIndex(memberTypeValue))

await searchMemberFormFunction(memberTypeValue)

if(!searchedHistory){
  updateMemberData(memberTypeValue, index)
}else{
  placeItemsInSearchForm(searchedKeyword)
  showSearchResults(searchedHistory)
}

memberType.addEventListener("change", () => {
  updateMemberData(memberType.value, index)
  window.location.reload()
})

async function updateMemberData(memberValue, page = 1){
  memberTypeValue = memberValue;
  let memberTypeData = cacheMemberType(memberValue)
  let result = await getAllMembersFunction(memberTypeData, page);
  let totalLength = result.result.totalItems;
  let totalPages = result.result.totalPages;
  totalData.innerText = `Total Members: ${totalLength}`

  let navigationComponents = {
    resultPages: {totalPages, index, navigationButtons},
    collectionNavigation: {collectionBackward, collectionForward},
    pageValues: {pageIndex, totalPagesUI},
    category: `${memberTypeValue}Member`, 
    skipArea: {leftSkip: buttonsBackward, rightSkip: buttonsForward}
  }
  buildNavArea(navigationComponents)
  if(totalLength === 0){
    pageIndex.value = "0"
  }

  pageIndex.addEventListener("change", () => {
    let pageNumber = Number(pageIndex.value)
    if(pageNumber <= totalPages && pageNumber > 0){
        cachePageIndex(memberTypeValue, pageNumber)
        window.location.reload()
    }else{
      pageIndex.value = cachePageIndex(memberTypeValue) 
        window.showMessageApi.alertMsg("Invalid page")
    }
  })
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

addMemberBtn.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./members/addMember/addMember.html")
})

memberCards.addEventListener("click", () => {  
  window.navigationApi.toAnotherPage("./members/memberCards/memberCards.html")
})

function placeItemsInSearchForm(searchedCache){
  searchedCache = JSON.parse(searchedCache)
  searchMemberForm.email.value = searchedCache.email
  searchMemberForm.memberId.value = searchedCache.memberId
  searchMemberForm.name.value = searchedCache.name
  searchMemberForm.personalId.value = searchedCache.personalId
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

function showSearchResults(searchedHistory){
  searchedHistory = JSON.parse(searchedHistory)
  totalData.innerHTML = `Members Found (${searchedHistory.length})`
  if(searchedHistory.length != 0){
    memberDataEl.innerHTML = ""
    showEachMember(memberDataEl, searchedHistory)
  }else{
    memberDataEl.innerHTML = `
            <tr> <td colspan="8"> No members found </td> </tr>
        `
  }
}

function viewDetailedMemberFunction(){
  const detailedButtons = document.querySelectorAll(".detailedMember")
  detailedButtons.forEach((eachButton) => {
    eachButton.addEventListener("click", async() => {
      let detailedMember = {
        id: eachButton.id
      }
      sessionStorage.setItem("memberId", JSON.stringify(detailedMember))
      window.navigationApi.toAnotherPage("./members/viewMember/viewMember.html")
    })
  })
}

function updateNewIndex(newIndex){
  index = newIndex;
}

searchMemberForm.addEventListener("reset", () => {
  sessionStorage.removeItem("searchMemberResult")
  window.location.reload()
})

function cacheMemberType(booleanValue = null){
  if(booleanValue !== null){
    sessionStorage.setItem("memberType", booleanValue)
  }

  let cachedMemberTypeValue = sessionStorage.getItem("memberType")
  if(cachedMemberTypeValue === null){
    return "all"
  }
  return cachedMemberTypeValue;
}

function cachePageIndex(memberType, indexValue = null){
  let sessionData;
  switch(memberType){
    case "all": sessionData = "allMemberPageIndex"
    break;
    case "staff": sessionData = "staffMemberPageIndex"
    break;
    case "teacher": sessionData = "teacherMemberPageIndex"
    break;
    case "public": sessionData = "publicMemberPageIndex"
    break;
    case "student": sessionData = "studentMemberPageIndex"
    break;
  }
  if(indexValue !== null){
      sessionStorage.setItem(sessionData, indexValue)
  }
  let cachedPageIndexValue = sessionStorage.getItem(sessionData)
  if(cachedPageIndexValue === null){
      return 1;
  }
  return cachedPageIndexValue;
}

async function searchMemberFormFunction(memberTypeData){
  searchMemberForm.addEventListener("submit", async(e) => {
    e.preventDefault()
    let searchData = {
      memberType: memberTypeData,
      email: e.target.email.value,
      name: e.target.name.value,
      memberId: e.target.memberId.value,
      personalId: e.target.personalId.value
    }
    sessionStorage.setItem("searchMemberData", JSON.stringify(searchData))
    const result = await searchMemberFunction(searchData)
    if(!result.result){
      sessionStorage.setItem("searchMemberResult", "[]")
      
    }else{
        sessionStorage.setItem("searchMemberResult", JSON.stringify(result.result))
    }
    window.location.reload()
  })
}