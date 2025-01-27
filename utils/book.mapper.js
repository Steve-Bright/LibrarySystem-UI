export function bookUIMapping(bookModel) {
  const {
    _id, 
    barcode,
    createdAt,
    ...uiBookData // Include everything else
  } = bookModel;

  return { ...uiBookData };
}
