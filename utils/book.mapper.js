export function bookUIMapping(bookModel) {
  const {
    _id, 
    barcode,
    createdAt,
    loanStatus,
    ...uiBookData // Include everything else
  } = bookModel;

  return { ...uiBookData };
}
