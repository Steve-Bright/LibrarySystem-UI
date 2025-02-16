import Member from "../../utils/member.model.js"
import { getDetailedMember, deleteMember, editMember } from "../../controllers/member.controller.js"
import {memberUIMapping} from "../../utils/member.mapper.js"
import { capitalizeFirstLetter } from "../../utils/extra.js"

const backToCollection = document.getElementById("backToCollection")
const deleteMemberButton = document.getElementById("deleteMemberButton")
const editMemberButton = document.getElementById("editMemberButton")
const borrowMemberButton = document.getElementById("borrowMemberButton")
const editButtonsArea = document.getElementById("editButtonsArea")
const viewMemberPhoto = document.getElementById("viewMemberPhoto")
const imagePreviewArea = document.getElementById("imagePreviewArea")
const viewMemberForm = document.getElementById("viewMemberForm")
const filePath = window.imagePaths.shareFilePath();

let detailedMember = JSON.parse(sessionStorage.getItem("memberId"))
const memberData = await getDetailedMember(detailedMember.id)
let cleanedMemberData = memberUIMapping(memberData.result)

backToCollection.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./members/allmembers/memberspage.html")
})

deleteMemberButton.addEventListener("click", () => {
  window.showMessageApi.confirmMsg("Do you really want to delete this member? ")
})

borrowMemberButton.addEventListener('click', () => {
  localStorage.setItem("borrowMember", JSON.stringify(memberData.result))
  window.navigationApi.toAnotherPage("./loans/addLoan/addLoan.html")
})

 window.showMessageApi.dialogResponse(async(event, response) =>{
    if(!response){
        const result = await deleteMember(detailedMember.id)
        window.showMessageApi.alertMsg(result.msg)
        window.navigationApi.toAnotherPage("./books/allmembers/memberspage.html")
    }
})

const viewInputs = document.querySelectorAll("#viewMemberForm input, #viewMemberForm textarea")
let index = 0; 

Object.keys(cleanedMemberData).forEach((eachKey) => {
  for(let eachInput of viewInputs){
    if(eachKey == "memberType" && eachInput.id == "memberType"){
      eachInput.value = capitalizeFirstLetter(cleanedMemberData[eachKey])
    }
    else if(eachInput.id == eachKey){
      eachInput.value = cleanedMemberData[eachKey] ? cleanedMemberData[eachKey] : "-"
    }
  }

  if(eachKey == "photo"){
    viewMemberPhoto.src = filePath + cleanedMemberData[eachKey]
  }
})

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
  uiTransform(memberModification)
  updateButtonFunctionality(memberModification)

  viewInputs.forEach((eachInput) => {
    eachInput.addEventListener("input", () => {
      editedMember[eachInput.id] = eachInput.value
    })
  })

  // const memberPhoto = document.getElementById("photo")

  viewMemberForm.addEventListener("submit", async(e) => {
    e.preventDefault()
    if(document.getElementById("photo")){
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
    window.location.reload()
  })
}

function uiTransform(memberModification){
  editButtonsArea.innerHTML = `
    <button type="button" id="cancelEditButton">Cancel</button>
    <button type="submit">Save</button>
  `

  viewInputs.forEach((eachInput) => {
    eachInput.classList.remove("viewMemberFormat")
    eachInput.classList.add("addMemberFormat")
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
        let image = window.URL.createObjectURL(editedMemberPhoto)
        imagePreviewArea.innerHTML = `
                    <img src=${image} alt="MemberPhoto" id="viewMemberPhoto">
                `
      }
    })
  })
}