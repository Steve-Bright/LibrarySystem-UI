import { getAllMembersFunction, searchMemberFunction } from "../../controllers/member.controller.js"
import { buildCardDesign, attachMemberCardToDiv, buildMemberNavigation } from "../../utils/extra.js"

const memberType = document.getElementById("memberType")
const backToCollection = document.getElementById("backToCollection")
const printPreview = document.getElementById("printPreview")
const totalData = document.getElementById("totalData")
const memberCardData = document.getElementById("memberCardData")
const memberNavigationArea = document.getElementById("memberNavigationArea")
const searchMemberForm = document.getElementById("searchMemberForm")
let index = 1;
let searchedHistory = sessionStorage.getItem("searchMemberCardResult")
let searchedKeyword = sessionStorage.getItem("searchMemberCardData")
let printMaterials = localStorage.getItem("toPrintMemberCards")
const currentFile = window.imagePaths.shareCurrentFile();
let memberTypeValue = cacheMemberType()
memberType.value = memberTypeValue;

let cardIds = []
await searchMemberFormFunction()

if(printMaterials){
  cardIds = printMaterials.split(",")
}

if(!searchedHistory){
  await updateMemberCardData(memberTypeValue)
}else{
  placeItemsInSearchForm(searchedKeyword)
  showSearchResults(searchedHistory)
}

memberType.addEventListener("change", () => {
  updateMemberCardData(memberType.value)
})

backToCollection.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./members/allmembers/memberspage.html")
})

printPreview.addEventListener("click",() => {

  if(cardIds!=[]){
    localStorage.setItem("toPrintMemberCards", cardIds)
  }else{
    localStorage.removeItem("toPrintMemberCards")
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

  if(totalMembersLength > 1){
    if(page == 1){
      buildMemberNavigation(memberNavigationArea, false, true, memberTypeValue,  index, updateMemberCardData, updateNewIndex)
    }else if(page == totalPages){
      buildMemberNavigation(memberNavigationArea, true, false, memberTypeValue, index, updateMemberCardData, updateNewIndex)
    }else{
      buildMemberNavigation(memberNavigationArea, true, true, memberTypeValue, index, updateMemberCardData, updateNewIndex)
    }
  }else{
    buildMemberNavigation(memberNavigationArea, false, false, memberTypeValue, index,  updateMemberCardData, updateNewIndex)
  }
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

async function searchMemberFormFunction(){
  searchMemberForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    localStorage.setItem("toPrintMemberCards", cardIds)
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