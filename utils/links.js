const apiEndpoint = "http://127.0.0.1:3000/"
export const mainWebsite = "http://localhost"

export const loginEndpoint = apiEndpoint + "accounts/authentication/login"
export const checkCookieEndpoint = apiEndpoint + "cookie/check"

//book related functions
export const addBookEndpoint = `${apiEndpoint}book/addBook`
export const editBookEndpoint = `${apiEndpoint}book/editBook`
export const getBookEndpoint = (category) =>  `${apiEndpoint}book/getBook?category=${category}`
export const deleteBookEndpoint = (category, bookId) => `${apiEndpoint}book/deleteBook/?category=${category}&bookId=${bookId}`