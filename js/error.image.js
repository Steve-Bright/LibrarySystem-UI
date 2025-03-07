let currentDirectory = window.sharingDataApi.currentDirectory();
const errorImage = currentDirectory + "/assets/error.png"
const errorBookImage = currentDirectory + "/assets/error_book.png"

export default function showErrorImage(book = null){
  let images = document.querySelectorAll("img")
  for(let eachImage of images){
      eachImage.addEventListener("error", function() {
          if(!book){
            this.src = errorImage
          }else{
            this.src = errorBookImage
          }
      })
  }
  
}
