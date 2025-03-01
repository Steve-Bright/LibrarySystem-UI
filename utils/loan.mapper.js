export function loanUIMapping(loanModel){
  const {
    _id,
    ...restOfModel
  }  = loanModel
  
  return {...restOfModel}
}