import { importCSVFile } from "../controllers/book.controller.js";
const importCSVForm = document.getElementById("importCSVForm")
const importCSVData = document.getElementById('importCSVData')
const currentFile = window.imagePaths.shareCurrentFile();

importCSVForm.addEventListener("submit", async(e) => {
  e.preventDefault()
  const formData = new FormData()
  formData.append("category", e.target.category.value)
  formData.append('csvFile', e.target.bookData.files[0])
  let result = await importCSVFile(formData)
  alert(result.msg)
})