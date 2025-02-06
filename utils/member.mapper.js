export function memberUIMapping(bookModel) {
  const {
    _id, 
    barcode,
    createdAt,
    loanBooks,
    block,
    ...uiBookData // Include everything else
  } = bookModel;

  return { ...uiBookData };
}
