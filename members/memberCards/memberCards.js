import { getAllMembersFunction, searchMemberFunction } from "../../controllers/member.controller.js"
import { buildCardDesign, attachMemberCardToDiv, buildMemberNavigation } from "../../utils/extra.js"
import { buildNavArea } from "../../utils/extra.js";
const memberType = document.getElementById("memberType")
const backToCollection = document.getElementById("backToCollection")
const printPreview = document.getElementById("printPreview")
const totalData = document.getElementById("totalData")
const memberCardData = document.getElementById("memberCardData")
const memberNavigationArea = document.getElementById("memberNavigationArea")
const searchMemberForm = document.getElementById("searchMemberForm")
const clearSelectedMemCard = document.getElementById("clearSelectedMemCard")

const pageIndex = document.getElementById("memCardPageIndex")
const totalPagesUI = document.getElementById("memCardTotalPages")
const collectionBackward = document.querySelectorAll(".collectionBackward")
const collectionForward = document.querySelectorAll(".collectionForward")
const buttonsForward = document.getElementById("memCardButtonsForward")
const buttonsBackward = document.getElementById("memCardButtonsBackward")
const navigationButtons = document.getElementById('memCardNavigationButtons')

let searchedHistory = sessionStorage.getItem("searchMemberCardResult")
let searchedKeyword = sessionStorage.getItem("searchMemberCardData")
let memberStorage = "toPrintMemberCards"
let printMaterials = localStorage.getItem(memberStorage)
const currentFile = window.imagePaths.shareCurrentFile();
let memberTypeValue = cacheMemberType()
memberType.value = memberTypeValue;
let index = Number(cachePageIndex(memberTypeValue))

let cardIds = []
await searchMemberFormFunction()

if(printMaterials){
  cardIds = printMaterials.split(",")
}

if(!searchedHistory){
  await updateMemberCardData(memberTypeValue, index)
}else{
  placeItemsInSearchForm(searchedKeyword)
  showSearchResults(searchedHistory)
}

memberType.addEventListener("change", () => {
  if(cardIds!=[]){
    localStorage.setItem(memberStorage, cardIds)
  }else{
    localStorage.removeItem(memberStorage)
  }
  updateMemberCardData(memberType.value, index)
  window.location.reload()
})

backToCollection.addEventListener("click", () => {
  if(cardIds!=[]){
    localStorage.setItem(memberStorage, cardIds)
  }else{
    localStorage.removeItem(memberStorage)
  }
  window.navigationApi.toAnotherPage("./members/allmembers/memberspage.html")
})

printPreview.addEventListener("click",() => {

  if(cardIds!=[]){
    localStorage.setItem(memberStorage, cardIds)
  }else{
    localStorage.removeItem(memberStorage)
  }

  let windowFeatures = {
    "width":725,
    "height":1123
}

  let data = {
    "fileName": currentFile+"./members/memberCards/printPreview.html",
    "name": "Member cards print Window",
    "windowFeatures": windowFeatures
  }

  window.navigationApi.openWindow(data);
  document.close()
})

for(let eachIcon of collectionForward){
  eachIcon.addEventListener("click", () => {
      if(cardIds != []){
          localStorage.setItem(memberStorage, cardIds)
      }else{
          localStorage.removeItem(memberStorage)
      }
  })
}

for(let eachIcon of collectionBackward){
  eachIcon.addEventListener("click", () => {
      if(cardIds != []){
          localStorage.setItem(memberStorage, cardIds)
      }else{
          localStorage.removeItem(memberStorage)
      }
  })
}

clearSelectedMemCard.addEventListener("click", ()=> {
  window.showMessageApi.confirmMsg("Do you really want to remove selected items?")
})

window.showMessageApi.dialogResponse(async(event, response) =>{
  if(!response){
      localStorage.removeItem(memberStorage)
      window.location.reload()
  }
})

async function updateMemberCardData(memberValue, page = 1){
  memberTypeValue = memberValue;
  let memberTypeData = cacheMemberType(memberValue)
  let memberData  = await getAllMembersFunction(memberTypeData, page)
  let totalMembersLength = memberData.result.totalItems;
  let totalMembers = memberData.result.items;
  let totalPages = memberData.result.totalPages;
  totalData.innerHTML = `Members (${totalMembersLength})`


  memberCardData.innerHTML = ``

  let cardDesigns = buildCardDesign(totalMembers)
  attachMemberCardToDiv(memberCardData, cardDesigns)

   let navigationComponents = {
      resultPages: {totalPages, index, navigationButtons},
      collectionNavigation: {collectionBackward, collectionForward},
      pageValues: {pageIndex, totalPagesUI},
      category: `${memberTypeValue}MemberCard`,
      skipArea: {leftSkip: buttonsBackward, rightSkip: buttonsForward},
      printArray: cardIds
    }
    buildNavArea(navigationComponents)

    if(totalMembersLength === 0){
      pageIndex.value = "0"
    }

    pageIndex.addEventListener("change", () => {
      if(cardIds != []){
        localStorage.setItem(memberStorage, cardIds)
      }else{
          localStorage.removeItem(memberStorage)
      }
      let pageNumber = Number(pageIndex.value)
      if(pageNumber <= totalPages && pageNumber > 0){
          cachePageIndex(memberTypeData, pageNumber)
          window.location.reload()
      }else{
        pageIndex.value = cachePageIndex(memberTypeValue) 
          window.showMessageApi.alertMsg("Invalid page")
      }
  })
  memberCardSelection()
}

function updateNewIndex(newIndex){
  index = newIndex;
}

function placeItemsInSearchForm(searchedCache){
  searchedCache = JSON.parse(searchedCache)
  searchMemberForm.memberType.value = searchedCache.memberType
  searchMemberForm.memberId.value = searchedCache.memberId
  searchMemberForm.name.value = searchedCache.name
  searchMemberForm.personalId.value = searchedCache.personalId
}

function showSearchResults(searchedHistory){
  searchedHistory = JSON.parse(searchedHistory)
  totalData.innerHTML = `Members Found (${searchedHistory.length})`
  if(searchedHistory.length != 0){
    memberCardData.innerHTML = ``
    let cardDesigns = buildCardDesign(searchedHistory)
    attachMemberCardToDiv(memberCardData, cardDesigns)
    // showEachMember(memberDataEl, searchedHistory)
  }else{
    memberCardData.innerHTML = `
            <tr> <td colspan="2"> No member cards found </td> </tr>
        `
  }
  memberCardSelection()
}

searchMemberForm.addEventListener("reset", () => {
  sessionStorage.removeItem("searchMemberCardResult")
  sessionStorage.removeItem("searchMemberCardData")
  window.location.reload()
})

function cacheMemberType(booleanValue = null){
  if(booleanValue !== null){
    sessionStorage.setItem("memberCardMemberType", booleanValue)
  }

  let cachedMemberTypeValue = sessionStorage.getItem("memberCardMemberType")
  if(cachedMemberTypeValue === null){
    return "all"
  }

  return cachedMemberTypeValue;
}

function cachePageIndex(memberType, indexValue = null){
  // "allMemberCard": "allMemCardPageIndex",
  // "staffMemberCard": "staffMemCardPageIndex",
  // "teacherMemberCard": "teacherMemCardPageIndex",
  // "publicMemberCard": "publicMemCardPageIndex",
  // "studentMemberCard": "studentMemCardPageIndex",
  let sessionData;
  switch(memberType){
    case "all": sessionData = "allMemCardPageIndex"
    break;
    case "staff": sessionData = "staffMemCardPageIndex"
    break;
    case "teacher": sessionData = "teacherMemCardPageIndex"
    break;
    case "public": sessionData = "publicMemCardPageIndex"
    break;
    case "student": sessionData = "studentMemCardPageIndex"
    break;
  }
  // let sessionData = "memberCardPageIndex"
  if(indexValue !== null){
      sessionStorage.setItem(sessionData, indexValue)
  }
  let cachedPageIndexValue = sessionStorage.getItem(sessionData)
  if(cachedPageIndexValue === null){
      return 1;
  }
  return cachedPageIndexValue;
}

async function searchMemberFormFunction(){
  searchMemberForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    localStorage.setItem(memberStorage, cardIds)
    let searchData = {
      name: e.target.name.value,
      memberType: e.target.memberType.value,
      memberId: e.target.memberId.value,
      personalId: e.target.personalId.value
    }

    sessionStorage.setItem("searchMemberCardData", JSON.stringify(searchData))
    const result = await searchMemberFunction(searchData)
    if(!result.result){
      sessionStorage.setItem("searchMemberCardResult", "[]")
      
    }else{
      sessionStorage.setItem("searchMemberCardResult", JSON.stringify(result.result))
    }
    window.location.reload();
  })
}

function memberCardSelection(){
  let allCards = document.querySelectorAll(".cardFormat")

  allCards.forEach((eachCard) => {
    if(cardIds.includes(eachCard.id) && !eachCard.classList.contains("selectedMemberCard")){
      eachCard.classList.add("selectedMemberCard")
    }

    eachCard.addEventListener("pointerdown", () => {
      let eachCardId = eachCard.id
      if(cardIds.includes(eachCardId)){
        let selectedIndex = cardIds.indexOf(eachCardId)
        eachCard.classList.remove("selectedMemberCard")
        cardIds.splice(selectedIndex, 1)
      }else{
        eachCard.classList.add("selectedMemberCard")
        cardIds.push(eachCardId)
      }
    })
  })
}

printPreview.addEventListener("click", () => {

})