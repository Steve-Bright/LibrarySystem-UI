import { saveCSVFile } from "../controllers/book.controller.js";
const importCSVForm = document.getElementById("importCSVForm")
const importCSVData = document.getElementById('importCSVData')
const currentFile = window.imagePaths.shareCurrentFile();

importCSVForm.addEventListener("submit", async(e) => {
  e.preventDefault()
  const formData = new FormData()
  formData.append('csvFile', e.target.bookData.files[0])
  let result = await saveCSVFile(formData)
  localStorage.setItem("csvFileName", result.result )
      let windowFeatures = {
        "width":725,
        "height":1123
    }
    let data = {
        "fileName": currentFile+"./settings/matcher/matcher.html",
        "name": "Process CSV File",
        "windowFeatures": windowFeatures
    }
    window.navigationApi.openWindow(data);
    document.close()
})