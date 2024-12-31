const apiEndpoint = "http://127.0.0.1:3000/"
export const mainWebsite = "http://localhost"

export const loginEndpoint = apiEndpoint + "accounts/authentication/login"
export const checkCookieEndpoint = apiEndpoint + "cookie/check"

//book related functions
export const addBookEndpoint = `${apiEndpoint}book/addBook`
export const editBookEndpoint = `${apiEndpoint}book/editBook`
export const getBookDetailEndpoint = (category, bookId) => `${apiEndpoint}book/getBook?category=${category}&bookId=${bookId}`
export const getBookFromAccNoEndpoint = (category, accNo) => `${apiEndpoint}book/getBook?category=${category}&accNo=${accNo}`
export const getBookEndpoint = (category, page) =>  `${apiEndpoint}book/getAllBooks?category=${category}&page=${page}`
export const deleteBookEndpoint = (category, bookId) => `${apiEndpoint}book/deleteBook/?category=${category}&bookId=${bookId}`
export const getLatestAccNoEndpoint = (category) => `${apiEndpoint}book/getLatestAccNo/${category}`

export const addMemberEndpoint = `${apiEndpoint}member/addMember`
export const editMemberEndpoint = `${apiEndpoint}member/editMember`
export const getMemberDetailEndpoint = (memberDatabaseId) => `${apiEndpoint}member/getMember?memberDatabaseId=${memberDatabaseId}`
export const getMemberFromMemberIdEndpoint = (memberId) => `${apiEndpoint}member/getMember?memberId=${memberId}`
export const getAllMembersEndpoint = (page) => `${apiEndpoint}member/getAllMembers?page=${page}`
export const getSpecificMembersEndpoint = (memberType, page) => `${apiEndpoint}member/getAllMembers?memberType=${memberType}page=${page}`
export const deleteMemberEndpoint = (memberDatabaseId) => `${apiEndpoint}member/deleteMember/?memberDatabaseId=${memberDatabaseId}`
export const getLatestMemberIdEndpoint = (memberType) => `${apiEndpoint}member/getLatestMemberId/${memberType}`
export const banMemberEndpoint = (memberDatabaseId, block) => `${apiEndpoint}member/banMember?memberDatabaseId=${memberDatabaseId}&block=${block}`
export const extendMembershipEndpoint = (memberDatabaseId) => `${apiEndpoint}member/extendMembership/${memberDatabaseId}`

//loan related functions
export const addLoanEndpoint = `${apiEndpoint}loan/addLoan`
export const checkLoanEndpoint = `${apiEndpoint}loan/checkLoan`
export const returnLoanEndpoint = (loanId) => `${apiEndpoint}loan/returnLoan/${loanId}`
export const deleteLoanEndpoint = (loanId) => `${apiEndpoint}loan/deleteLoan/${loanId}`
export const searchLoanEndpoint = `${apiEndpoint}loan/searchLoan`
export const extendLoanEndpoint = (loanId) => `${apiEndpoint}loan/extendLoan/${loanId}`
export const getAllLoansEndpoint = `${apiEndpoint}loan/getAllLoans`
export const getLoanDetailEndpoint = (loanId) => `${apiEndpoint}loan/getLoan/${loanId}`