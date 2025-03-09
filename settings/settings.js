import { importCSVFile } from "../controllers/book.controller.js";
const importCSVForm = document.getElementById("importCSVForm")
const importCSVData = document.getElementById('importCSVData')
const currentFile = window.imagePaths.shareCurrentFile();
const importStatus = document.getElementById("importStatus")

importCSVForm.addEventListener("submit", async(e) => {
  e.preventDefault()
  const formData = new FormData()
  formData.append("category", e.target.category.value)
  importStatus.innerHTML = "Data is importing ....... please wait"
  formData.append('csvFile', e.target.bookData.files[0])
  let result = await importCSVFile(formData)
  if(result.msg){
    importStatus.innerHTML = "Data import completed"
  }else{
    importStatus.innerHTML = "Something went wrong"
  }
  alert(result.msg)
})