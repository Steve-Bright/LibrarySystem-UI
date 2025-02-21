import { getBookNums } from "../controllers/book.controller.js";
import { getLoanNums } from "../controllers/loan.controller.js";
import { getMemberNums } from "../controllers/member.controller.js";

const dashboardTime = document.getElementById("dashboardTime")
let dashboardTimeValue = cacheDashboardTime()
dashboardTime.value = dashboardTimeValue;

await updateStatistics(dashboardTimeValue);

dashboardTime.addEventListener("change", async () => {
   updateStatistics(dashboardTime.value)
})

async function updateStatistics(dashboardValue){
  dashboardTimeValue = dashboardValue;
  let dashboardData = cacheDashboardTime(dashboardValue);
  let bookData = await getBookNums(dashboardValue);
  let memberData = await getMemberNums(dashboardValue)
  let loanData = await getLoanNums(dashboardValue)

  updateBookData(bookData)
  updateMemberData(memberData)
  updateLoanData(loanData)
  console.log("memberData: "+ JSON.stringify(memberData) )
  console.log("loanData: "+ JSON.stringify(loanData) )
}

function updateBookData(dataset){
  const totalBooks = document.getElementById("totalBooks")
  const mmBooks = document.getElementById("totalMMBooks")
  const engBooks = document.getElementById("totalEngBooks")
  totalBooks.innerHTML = dataset.total
  mmBooks.innerHTML = dataset.mm  
  engBooks.innerHTML = dataset.eng
}

function updateLoanData(dataset){
  const newLoans = document.getElementById("newLoans")
  const overdue = document.getElementById("overdue")
  const toReturn = document.getElementById("toReturn")
  newLoans.innerHTML = dataset.newLoans
  overdue.innerHTML = dataset.overdue 
  toReturn.innerHTML = dataset.toReturn
}

function updateMemberData(dataset){
  const totalMembers = document.getElementById("totalMembers")
  const otherMembers = document.getElementById("otherMembers")
  const students = document.getElementById("studentMembers")

  totalMembers.innerHTML = dataset.total
  otherMembers.innerHTML = dataset.teachers + dataset.staffs + dataset.public 
  students.innerHTML = dataset.students
}

// bookData: {"total":2,"mm":1,"eng":1}
// homepage.js:23 memberData: {"total":1,"teachers":0,"students":1,"staffs":0,"public":0}
// homepage.js:24 loanData: {"newLoans":1,"overdue":0,"toReturn":5}

function cacheDashboardTime(value = null){
  if(value !== null){
    sessionStorage.setItem("dashboardTime", value)
  }

  let cachedDashboardValue = sessionStorage.getItem("dashboardTime")
  if(cachedDashboardValue === null){
    return "weekly";
  }
  return cachedDashboardValue;
}