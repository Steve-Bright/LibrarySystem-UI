
export function cacheBookData(bookData){
  localforage.setItem("addbookCache", bookData).then(function(value) {
    return value;
  }).catch(function(error){
    window.showMessageApi.alertMsg("Book Caching error " + error)
  })
}

export async function getBookCache(){
  try{
    const bookCache = await localforage.getItem("addbookCache")
    return bookCache
  }catch(error){
    window.showMessageApi.alertMsg("Getting book cache error " + error)
  }
}