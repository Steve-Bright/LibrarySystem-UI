export const loanMap = {
  loanMemberMapping: (memberModel) => {
    const {
      _id, 
      ...restOfModel
    } = memberModel;

    return { ...restOfModel}
  },

  loanBookMapping: (bookModel) => {
    const {
      _id,
      ...restOfModel
    } = bookModel;

    return { ...restOfModel}
  },

  loanDetailMapping: (loanModel) => {
    const {
      _id,
      memberId,
      bookId,
      overdue,
      ...restOfModel
    } = loanModel;

    return { ...restOfModel}
  }
}