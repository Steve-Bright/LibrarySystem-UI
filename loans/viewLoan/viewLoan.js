import { deleteLoanFunction, extendLoanFunction, getDetailedLoanFunction, returnLoanFunction } from "../../controllers/loan.controller.js";
import Book from "../../utils/book.model.mjs";
import Loan from "../../utils/loan.model.mjs";
import Member from "../../utils/member.model.js";
const backToCollection = document.getElementById("backToCollection");

backToCollection.addEventListener("click", () => {
  window.navigationApi.toAnotherPage("./loans/allLoans/loanpage.html")
})

