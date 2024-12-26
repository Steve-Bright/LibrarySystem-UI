import { getAllMembersFunction, addMemberFunction, generateBarCode, getLatestMemberId, getDetailedMember, deleteMember, editMember } from "../controllers/member.controller.js";
import Member from "../utils/member.model.js";
import {buildMemberNavigation} from "../utils/extra.js"
const filePath = window.imagePaths.shareFilePath();
const backToCollection = document.getElementById("backToCollection")
const memberNavigationArea = document.getElementById("memberNavigationArea");
const totalData = document.getElementById("totalData");
const addMemberBtn = document.getElementById("addMemberBtn");
const memberDataEl = document.getElementById("memberData");
const addMemberFormEl = document.getElementById("addMemberForm")
const memberType = document.getElementById("memberType");
const memberId = document.getElementById("memberId")
const departmentArea = document.getElementById("departmentArea")
const viewMemberForm = document.getElementById("viewMemberForm")
const photoArea = document.getElementById("photoArea")
const viewMemberPhoto = document.getElementById("viewMemberPhoto")
const deleteMemberButton = document.getElementById("deleteMemberButton")
const editMemberButton = document.getElementById("editMemberButton")
const editButtonsArea = document.getElementById("editButtonsArea")

let index = 1;
if(totalData){
    localStorage.removeItem("detailedMemberData")
    updateMemberData()
}

if(viewMemberForm){
    updateMemberDetail()
}

if(addMemberBtn){
    addMemberBtn.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("addMember.html")
    })
}

if(backToCollection){
    // console.log("doesnt this catch this function as well?")
    backToCollection.addEventListener("click", () => {
        window.navigationApi.toAnotherPage("memberspage.html")
    })
}

if(deleteMemberButton){
    deleteMemberButton.addEventListener("click", async() => {
        window.showMessageApi.confirmMsg("Are you sure you want to delete this member?")
    })

    window.showMessageApi.dialogResponse(async(event, response) =>{
            // console.log("this is their response "+ response)
            let memberDetail = localStorage.getItem("detailedMemberData")
            memberDetail = JSON.parse(memberDetail)
            if(!response){
                const result = await deleteMember(memberDetail._id)
                window.showMessageApi.alertMsg(result.msg)
            }
        })
}
if(editMemberButton){
    editMemberButton.addEventListener("click", () => {
        updateEditMemberUi();
    })
}

if(addMemberFormEl){

    let memberTypeValue = "student";
    let memberIdValue;
    memberType.addEventListener("change", async(e) => {
        // console.log("member is changed " + memberType.value)
        memberTypeValue = memberType.value;
        memberIdValue = await updateMemberId(memberTypeValue)
        memberId.value = memberIdValue;

        if(memberTypeValue != "student"){
            departmentArea.innerHTML = `
                <label for="department">Department</label>
                <select id="department" name="department">
                    <option value="Chinese">Chinese</option>
                    <option value="English">English</option>
                </select> 
            `
        }else{
            departmentArea.innerHTML = "";
        }
    })

    memberIdValue = await updateMemberId(memberTypeValue)
    memberId.value = memberIdValue;
    addMemberFormEl.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        let barcodeImage = await generateBarCode(e.target.memberId.value);
        const newMember = new Member({
            photo: document.getElementById("photo").files[0],
            memberType:e.target.memberType.value,

            personalId:e.target.personalId.value,
            memberId:e.target.memberId.value,
            name:e.target.name.value,
            nrc:e.target.nrc.value,
            gender:e.target.gender.value,
            phone:e.target.phone.value,
            email:e.target.email.value,
            permanentAddress:e.target.permanentAddress.value,
            currentAddress:e.target.currentAddress.value,
            note:e.target.note.value,
            barcode:barcodeImage
        })

        if(e.target.department){
            newMember.department = e.target.department.value;
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

        for (let key of formData.keys()) {
            console.log("value of " + key + " is " + formData.get(key));
        }

        const result = await addMemberFunction(formData);
        window.showMessageApi.alertMsg(result.msg)

    } )  
}

async function updateMemberData(page=1){
    let result = await getAllMembersFunction(page);
    let totalLength = result.result.totalItems;
    let totalPages = result.result.totalPages;
    totalData.innerText = `Total Members: ${totalLength}`

    if(totalPages > 1) {
        if(page == 1){
            buildMemberNavigation(memberNavigationArea, false, true, index, updateMemberData, updateNewIndex)
        }else if(page === totalPages){
            buildMemberNavigation(memberNavigationArea, true, false, index, updateMemberData, updateNewIndex)
        }else{
            buildMemberNavigation(memberNavigationArea, true, true, index, updateMemberData, updateNewIndex)
        }
    }else{
        buildMemberNavigation(memberNavigationArea, false, false, index, updateMemberData, updateNewIndex)
    }

    let memberIds = [];
    let totalMemeberData = result.result.items
    
    if(totalMemeberData.length > 0){
        memberDataEl.innerHTML = ``;
        totalMemeberData.forEach((eachMember) => {
            // let memberData = new Member(eachMember);
            memberIds.push(eachMember._id);
            const newRow = document.createElement("tr");
            let imagePath = filePath + eachMember.photo;
            let expiryDate = new Date(eachMember.expiryDate);
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
                <td><button class="detailedMember">View Details</button></td>
                `
            memberDataEl.appendChild(newRow);
        })
        viewDetailedMemberFunction(memberIds);
        console.log("member ids " + memberIds)
    }else{
        memberDataEl.innerHTML = `
        <tr>
            <td colspan="8">
                There are no members at the moment
            </td>
        </tr>
        `
    }
}

function updateNewIndex(newIndex){
    index = newIndex;
}

function viewDetailedMemberFunction(memberIds){
    const detailedButtons = document.querySelectorAll(".detailedMember");
    detailedButtons.forEach((eachButton, index) => {
        eachButton.addEventListener("click", async() => {
            let detailedMemberData = await getDetailedMember(memberIds[index]);
            console.log("detailed member data " + JSON.stringify(detailedMemberData.result))
            localStorage.setItem("detailedMemberData", JSON.stringify(detailedMemberData.result));
            window.navigationApi.toAnotherPage("memberDetail.html", memberIds[index])
        })
    })
}

async function updateMemberId(memberType){
    let result = await getLatestMemberId(memberType);
    return result.result;
}

function updateMemberDetail(){
    let memberDetail = localStorage.getItem("detailedMemberData");
    let memberData = new Member(JSON.parse(memberDetail));
    const memberDepartment = document.getElementById("viewDepartmentArea");
    delete memberData.memberDatabaseId
    delete memberData.block;
    delete memberData.barcode;
    delete memberData.loanBooks;
    if(memberData.memberType != "student"){
        memberDepartment.innerHTML = `
            <label for="department">Department</label>
            <input type="text" name="department" value="${memberData.department}" disabled>
        `
    }else{
        delete memberData.department;
    }
    const viewInputs = document.querySelectorAll("#viewMemberForm input, #viewMemberForm textarea")
    let index = 0;
    setTimeout(() => {
        Object.keys(memberData).forEach((eachKey) => {
            console.log("each key and value " + eachKey + " " + memberData[eachKey])
            if(eachKey == "photo"){
                viewMemberPhoto.src=filePath + memberData[eachKey];
            }else if(eachKey == "department"){
                const department = document.getElementById("viewDepartmentArea");
                department.value = memberData
                index++
            }
            else{
                viewInputs[index].value = memberData[eachKey] ? memberData[eachKey] : "-";
                index++;
            }
        })
    }, 300)
}

function updateEditMemberUi(){
    viewMemberForm.id=""
    viewMemberForm.id = "editMemberForm"

    editButtonsArea.innerHTML = `<button type="submit">Edit</button>`
    const removeImageButton = document.createElement("button");
    removeImageButton.id = "removeImage";
    removeImageButton.textContent = "remove";
    photoArea.appendChild(removeImageButton);

    const editMemberForm = document.getElementById("editMemberForm");
    const removeImage = document.getElementById("removeImage")
    const editMemberFormField = document.querySelectorAll("#editMemberForm input,  textarea")

    let newMember = new Member({})
    delete newMember.memberDatabaseId
    delete newMember.photo;
    delete newMember.barcode;
    delete newMember.loanBooks;

    const memberKeys = Object.keys(newMember)

    
    removeImage.addEventListener("click", () => {
        viewMemberPhoto.remove()
        photoArea.innerHTML = `<input type="file" name="photo" id="photo">`

        const memberPhoto = document.getElementById("photo")
        memberPhoto.addEventListener("change", () => {
            newMember.photo = memberPhoto.files[0];
        })
    })

    editMemberFormField.forEach((eachInput, i) => {
       eachInput.addEventListener("change", () => {
            newMember[memberKeys[i]] = eachInput.value;
       })
    })

    let memberDetail = localStorage.getItem("detailedMemberData");
    memberDetail = JSON.parse(memberDetail)
    newMember.memberDatabaseId = memberDetail._id;
    newMember.memberType = memberDetail.memberType;

    editMemberForm.addEventListener("submit", async(e) => {
        // console.log("edit member form " + JSON.stringify(newMember))
        e.preventDefault()
        const formData = new FormData();
        for(let key in newMember){
            if(newMember.hasOwnProperty(key)){
                if(newMember[key] !== undefined){
                    formData.append(key, newMember[key]);
                }
            }
        }
        for (let key of formData.keys()) {
            console.log("value of " + key + " is " + formData.get(key));
        }
        let result = await editMember(formData);
        window.showMessageApi.alertMsg(result.msg)
    })

}