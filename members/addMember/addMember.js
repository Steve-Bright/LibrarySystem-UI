import { getLatestMemberId } from "../../controllers/member.controller.js";

const backToCollection = document.getElementById("backToCollection")
const memberType = document.getElementById("memberType");
const memberId = document.getElementById("memberId")
const gradeArea = document.getElementById('gradeArea')
const memberPhoto = document.getElementById("memberPhoto")
const addMemberImageArea = document.getElementById("addMemberImageArea")

//NRC number control
const regionNumber = document.getElementById("regionNumber")
const nrcPlace = document.getElementById("nrcPlace")
const mainNum = document.getElementById("mainNum")

backToCollection.addEventListener("click", () => {
    window.navigationApi.toAnotherPage("./members/allmembers/memberspage.html")
})

memberType.addEventListener("change", async() => {
  memberId.value = await getLatestMemberId(memberType.value)
  toggleGrade(memberType.value)
})

nrcControl()

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
      placeOpt.innerHTML = result[i].name_mm
      placeDiv.appendChild(placeOpt)
    }
}