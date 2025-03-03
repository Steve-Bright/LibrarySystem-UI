export function memberUIMapping(bookModel) {
  const {
    _id, 
    barcode,
    createdAt,
    ...uiBookData // Include everything else
  } = bookModel;

  return { ...uiBookData };
}
