export function loanUIMapping(loanModel){
  const {
    _id,
    ...restOfModel
  }  = loanModel
  
  return {...restOfModel}
}

export function loanMappingInBook(loanModel){
  const {...allData} = loanModel

  return {...allData}
}