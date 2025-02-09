import { getAllMembersFunction, searchMemberFunction } from "../../controllers/member.controller.js"
import { buildCardDesign, attachMemberCardToDiv, buildMemberNavigation } from "../../utils/extra.js"

const printPreview = document.getElementById("printPreview")
const totalData = document.getElementById("totalData")
const memberCardData = document.getElementById("memberCardData")
const memberNavigationArea = document.getElementById("memberNavigationArea")
const searchMemberForm = document.getElementById("searchMemberForm")
let index = 1;
let searchedHistory = sessionStorage.getItem("searchMemberCardResult")
let searchedKeyword = sessionStorage.getItem("searchMemberCardData")

let cardIds = []
await searchMemberFormFunction()

if(!searchedHistory){
  await updateMemberCardData()
}else{
  placeItemsInSearchForm(searchedKeyword)
  showSearchResults(searchedHistory)
}

async function updateMemberCardData(page = 1){
  let memberData  = await getAllMembersFunction(page)
  let totalMembersLength = memberData.result.totalItems;
  let totalMembers = memberData.result.items;
  let totalPages = memberData.result.totalPages;
  totalData.innerHTML = `Members (${totalMembersLength})`


  memberCardData.innerHTML = ``

  let cardDesigns = buildCardDesign(totalMembers)
  attachMemberCardToDiv(memberCardData, cardDesigns)

  if(totalMembersLength > 1){
    if(page == 1){
      buildMemberNavigation(memberNavigationArea, false, true, index, updateMemberCardData, updateNewIndex)
    }else if(page == totalPages){
      buildMemberNavigation(memberNavigationArea, true, false, index, updateMemberCardData, updateNewIndex)
    }else{
      buildMemberNavigation(memberNavigationArea, true, true, index, updateMemberCardData, updateNewIndex)
    }
  }else{
    buildMemberNavigation(memberNavigationArea, false, false, index,  updateMemberCardData, updateNewIndex)
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
}

searchMemberForm.addEventListener("reset", () => {
  sessionStorage.removeItem("searchMemberCardResult")
  sessionStorage.removeItem("searchMemberCardData")
  window.location.reload()
})

async function searchMemberFormFunction(){
  searchMemberForm.addEventListener("submit", async(e) => {
    e.preventDefault();
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