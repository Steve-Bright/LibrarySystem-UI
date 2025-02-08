import { getAllMembersFunction } from "../../controllers/member.controller.js"
import { buildCardDesign, attachMemberCardToDiv } from "../../utils/extra.js"

const printPreview = document.getElementById("printPreview")
const totalData = document.getElementById("totalData")
const memberCardData = document.getElementById("memberCardData")

await updateMemberCardData(1)

async function updateMemberCardData(page = 1){
  let memberData  = await getAllMembersFunction(page)
  let totalMembersLength = memberData.result.totalItems;
  let totalMembers = memberData.result.items;
  let totalPages = memberData.result.totalPages;
  totalData.innerHTML = `Members (${totalMembersLength})`


  memberCardData.innerHTML = ``
  let tr;
  let td;
  let trArrays = [];

  let cardDesigns = buildCardDesign(totalMembers)
  attachMemberCardToDiv(memberCardData, cardDesigns)
  // let rowData = buildMemberCardCollectionView()
}

printPreview.addEventListener("click", () => {

})