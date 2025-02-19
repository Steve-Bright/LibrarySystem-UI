export function memberUIMapping(bookModel) {
  const {
    _id, 
    barcode,
    createdAt,
    loanBooks,
    ...uiBookData // Include everything else
  } = bookModel;

  return { ...uiBookData };
}
