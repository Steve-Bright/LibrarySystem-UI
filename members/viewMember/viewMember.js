import Member from "../../utils/member.model.js"
import { getDetailedMember, deleteMember, editMember, toggleBan, checkBannedUntil, extendMembership } from "../../controllers/member.controller.js"
import {memberUIMapping} from "../../utils/member.mapper.js"
import { capitalizeFirstLetter } from "../../utils/extra.js"

const backToCollection = document.getElementById("backToCollection")
const deleteMemberButton = document.getElementById("deleteMemberButton")
const editMemberButton = document.getElementById("editMemberButton")
const borrowMemberButton = document.getElementById("borrowMemberButton")
const editButtonsArea = document.getElementById("editButtonsArea")
const viewMemberPhoto = document.getElementById("viewMemberPhoto")
const imagePreview = document.querySelector("#imagePreviewArea div")
const extendMemberBtn = document.getElementById('extendMemberButton')
// const imagePreviewArea = document.getElementById("imagePreviewArea")
const viewMemberForm = document.getElementById("viewMemberForm")
const filePath = window.imagePaths.shareFilePath();
const loanHistory = document.getElementById("loanHistory")
const regionNumber = document.getElementById("regionNumber")
const nrcPlace = document.getElementById("nrcPlace")
const nrcPlaceView = document.getElementById("nrcPlaceView")
const mainNum = document.getElementById("mainNum")
const nrcType = document.getElementById("nrcType")

let detailedMember = JSON.parse(sessionStorage.getItem("memberId"))
const memberData = await getDetailedMember(detailedMember.id)
let cleanedMemberData = memberUIMapping(memberData.result)

let photoChange = false;
backToCollection.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./members/allmembers/memberspage.html")
})

extendMemberBtn.addEventListener("click", () => {
  window.showMessageApi.confirmMsg4("Do you want to extend membership?")
})

window.showMessageApi.dialogResponse4(async(event, response) =>{
  if(!response){
      const result = await extendMembership(detailedMember.id)
      window.showMessageApi.alertMsg(result.msg)
      window.location.reload()
  }
})

deleteMemberButton.addEventListener("click", () => {
  window.showMessageApi.confirmMsg("Do you really want to delete this member? ")
})

loanHistory.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./members/loanHistory/loanHistory.html")
})

borrowMemberButton.addEventListener('click', () => {
  localStorage.setItem("borrowMember", JSON.stringify(memberData.result))
  window.navigationApi.toAnotherPage("./loans/addLoan/addLoan.html")
})

 window.showMessageApi.dialogResponse(async(event, response) =>{
    if(!response){
        const result = await deleteMember(detailedMember.id)
        window.showMessageApi.alertMsg(result.msg)
        window.navigationApi.toAnotherPage("./members/allmembers/memberspage.html")
    }
})

nrcControl()

let viewInputs = document.querySelectorAll("#viewMemberForm input, #viewMemberForm textarea, #membershipDetail input, #viewMemberForm select, #viewMemberForm dataList")


Object.keys(cleanedMemberData).forEach((eachKey) => {
  for(let eachInput of viewInputs){
    if(eachKey == "memberType" && eachInput.id == "memberType"){
      eachInput.value = cleanedMemberData[eachKey]
    }else if((eachKey == "issueDate" && eachInput.id == "issueDate")|| (eachKey == "expiryDate" && eachInput.id == "expiryDate")){
      let date = new Date(cleanedMemberData[eachKey])
      eachInput.value = date.toDateString();
    }
    else if(eachInput.id == eachKey){
      eachInput.value = cleanedMemberData[eachKey] ? cleanedMemberData[eachKey] : "-"
    }
  }

  if(eachKey == "photo"){
    viewMemberPhoto.src = filePath + cleanedMemberData[eachKey]
  }

  if(eachKey == "nrc" && eachKey != ""){
    console.log("nrc value " + cleanedMemberData[eachKey])
    let separateNumbers = cleanedMemberData[eachKey].split("/")
    regionNumber.value = separateNumbers[0]

    let separateNRCPlace = separateNumbers[1].split("(")
    nrcPlaceView.value = separateNRCPlace[0];

    let separateNRCType = separateNRCPlace[1].split(")")
    nrcType.value = separateNRCType[0];

    mainNum.value = separateNRCType[1]
  }
})

if(cleanedMemberData.block){
  const bannedArea = document.getElementById("banArea")
    bannedArea.classList.remove('removedArea')
    bannedArea.classList.add("bannedBanner")
    await unbanFunctionality(detailedMember.id)
}

async function unbanFunctionality(memberId){
  const unbanButton = document.getElementById("unbanButton")
  const banPeriod = document.getElementById("banPeriod")
  
  let bannedPeriod = await checkBannedUntil(memberId)
  banPeriod.innerHTML = new Date(bannedPeriod).toDateString()
  unbanButton.addEventListener("click", () => {
    window.showMessageApi.confirmMsg3("Do you want to unban this member?")
  })

  window.showMessageApi.dialogResponse3(async(event, response) =>{
    if(!response){
        const result = await toggleBan(detailedMember.id, false)
        window.showMessageApi.alertMsg(result.msg)
        window.location.reload()
    }
  })
}

editMemberButton.addEventListener("click", () => {
  updateMemberUi()
})

function updateMemberUi(){
  let editedMember = new Member({
    memberDatabaseId: detailedMember.id,
    memberType: cleanedMemberData.memberType
  })
  delete editedMember.loanBooks;
  delete editedMember.barcode;
  const memberModification = document.getElementById("memberModification")
  uiTransform(cleanedMemberData.memberType, memberModification)
  updateButtonFunctionality(memberModification)

  viewInputs.forEach((eachInput) => {
    eachInput.addEventListener("change", () => {
      editedMember[eachInput.id] = eachInput.value
    })
  })

  // const memberPhoto = document.getElementById("photo")

  viewMemberForm.addEventListener("submit", async(e) => {
    e.preventDefault()
    if(photoChange){
      editedMember.editedPhoto = true;
      editedMember.photo = document.getElementById("photo").files[0]
    }

    const formData = new FormData()

    for(let key in editedMember){
      if(editedMember.hasOwnProperty(key)){
        if(editedMember[key] !== undefined){
            formData.append(key, editedMember[key])
        }
      }
    }

    const result = await editMember(formData)
    window.showMessageApi.alertMsg(result.msg)
    if(result.con){
      window.location.reload()
    }
  })
}

function uiTransform(memberType, memberModification){

  editButtonsArea.innerHTML = `
    <button type="button" id="blockButton"> Block </button>
    <button type="button" id="cancelEditButton">Cancel</button>
    <button type="submit">Save</button>
  `

  viewInputs.forEach((eachInput, i) => {
    eachInput.classList.remove("viewMemberFormat")
    eachInput.classList.add("addMemberFormat")

    if(eachInput.classList.contains("viewNRCFormat")){
      if(memberType == "student"){
        eachInput.classList.remove("viewNRCFormat")
      }
    }
  })

  const removeImageButton = document.createElement("button");
  removeImageButton.id = "removeImage";
  removeImageButton.textContent = "Remove Image";
  memberModification.appendChild(removeImageButton)

}

function updateButtonFunctionality(memberModification){
  const cancelButton = document.getElementById("cancelEditButton")
  cancelButton.addEventListener("click", () => {
    window.location.reload()
  })

  const blockButton = document.getElementById("blockButton")
  blockButton.addEventListener("click", () => {
    window.showMessageApi.confirmMsg2("Do you want to block this member?")
  })

  window.showMessageApi.dialogResponse2(async(event, response) =>{
    if(!response){
        const result = await toggleBan(detailedMember.id, true)
        window.showMessageApi.alertMsg(result.msg)
        window.location.reload()
        // window.navigationApi.toAnotherPage("./members/allmembers/memberspage.html")
    }
  })

  const removeImageBtn = document.getElementById("removeImage")
  removeImageBtn.addEventListener("click", () => {
    viewMemberPhoto.remove()
    memberModification.innerHTML = `
      <input type="file" id="photo" name="photo" class="addBookFormat">
    `

    const memberPhoto = document.getElementById("photo")
    memberPhoto.addEventListener("change", (e) => {
      let editedMemberPhoto = memberPhoto.files[0]
      if(editedMemberPhoto){
        photoChange = true;
        let image = window.URL.createObjectURL(editedMemberPhoto)
        imagePreview.innerHTML = `
                    <img src=${image} alt="MemberPhoto" id="viewMemberPhoto">
                `
      }
    })
  })
}

function nrcControl(){
  addRegionNumber(),
  changePlace(nrcPlace, "1")
  regionNumber.addEventListener("change", () => {
    changePlace(nrcPlace, regionNumber.value)
  })
}

function addRegionNumber(){
  for(let i = 1; i < 15; i++){
    let opt = document.createElement("option")
    opt.value = i
    opt.innerHTML = i
    regionNumber.appendChild(opt)
  }
}

function changePlace(placeDiv, regionNum){
  placeDiv.innerHTML = ``
    let result = window.sharingDataApi.searchNRC(regionNum)
    result = JSON.parse(result)
    for(let i = 0; i < result.length; i ++){
      let placeOpt = document.createElement("option")
      placeOpt.value = result[i].name_en
      placeOpt.innerHTML = result[i].name_en
      placeDiv.appendChild(placeOpt)
    }
}