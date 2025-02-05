import { getLatestMemberId, generateBarCode, addMemberFunction} from "../../controllers/member.controller.js";
import Member from "../../utils/member.model.js";

const backToCollection = document.getElementById("backToCollection")
const memberType = document.getElementById("memberType");
const memberId = document.getElementById("memberId")
const gradeArea = document.getElementById('gradeArea')
const memberPhoto = document.getElementById("memberPhoto")
const addMemberImageArea = document.getElementById("addMemberImageArea")
const addMemberForm = document.getElementById("addMemberForm")

//NRC number control
const regionNumber = document.getElementById("regionNumber")
const nrcPlace = document.getElementById("nrcPlace")
const mainNum = document.getElementById("mainNum")
const nrcType = document.getElementById("nrcType")

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
      placeOpt.innerHTML = result[i].name_en
      placeDiv.appendChild(placeOpt)
    }
}


addMemberForm.addEventListener("submit", async(e) => {
  const nrcPlaceValue = document.querySelector('input[list="nrcPlace"]');
  console.log("this is the member data submitted ")
  e.preventDefault()
  let nrcData = `${regionNumber.value}/${nrcPlaceValue.value}(${nrcType.value})${mainNum.value}`
  let barcodeImage = await generateBarCode(e.target.memberId.value);
  const newMember = new Member({
    photo: document.getElementById("memberPhoto").files[0],
    memberType:e.target.memberType.value,

    personalId:e.target.personalId.value,
    memberId:e.target.memberId.value,
    name:e.target.name.value,
    nrc: nrcData,
    gender:e.target.gender.value,
    phone:e.target.phone.value,
    email:e.target.email.value,
    permanentAddress:e.target.permanentAddress.value,
    currentAddress:e.target.currentAddress.value,
    note:e.target.note.value,
    barcode:barcodeImage
  })

  if(e.target.grade){
    newMember.grade = e.target.grade.value;
  }

  for (const [key, value] of Object.entries(newMember)) {
    if(value == "" || !value){
        delete newMember[key]
    }
  }

  delete newMember.loanBooks

  const formData = new FormData();

  for(let key in newMember){
    if(newMember.hasOwnProperty(key)){
        if(newMember[key] !== undefined){
            formData.append(key, newMember[key]);
        }
    }
  }
  
  const result = await addMemberFunction(formData);
  window.showMessageApi.alertMsg(result.msg)
  
})
