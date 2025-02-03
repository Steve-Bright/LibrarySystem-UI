import { getLatestMemberId } from "../../controllers/member.controller.js";

const backToCollection = document.getElementById("backToCollection")
const memberType = document.getElementById("memberType");
const memberId = document.getElementById("memberId")
const gradeArea = document.getElementById('gradeArea')
const memberPhoto = document.getElementById("memberPhoto")
const addMemberImageArea = document.getElementById("addMemberImageArea")

backToCollection.addEventListener("click", () => {
    window.navigationApi.toAnotherPage("./members/allmembers/memberspage.html")
})

memberType.addEventListener("change", async() => {
  memberId.value = await getLatestMemberId(memberType.value)
  toggleGrade(memberType.value)
})

memberId.value = await getLatestMemberId(memberType.value)

memberPhoto.addEventListener("change", (event) => {
  let memberPhotoAdded = memberPhoto.files[0]
  if(memberPhotoAdded){
    let image = window.URL.createObjectURL(memberPhotoAdded)
    addMemberImageArea.innerHTML = `
      <img src=${image} alt="Book Cover">
    `
  }
})

function toggleGrade(memberType){
  switch (memberType){
    case "student": 
      gradeArea.innerHTML = `
        <label for="Grade">Grade</label>
        <input type="text" name="grade" id="grade" class="addMemberFormat">
      `
      break;
    default: 
      gradeArea.innerHTML = ``
      break;
  }
}