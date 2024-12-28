class Loan{
    constructor({
        loanDatabaseId,
        memberId,
        bookId,
        bookModel,
        loanDate,
        dueDate,
        duration,
        loanStatus,
        overdue
    }){
        this.loanDatabaseId = loanDatabaseId;
        this.memberId = memberId;
        this.bookId = bookId;
        this.bookModel = bookModel;
        this.loanDate = loanDate;
        this.dueDate = dueDate;
        this.duration = duration;
        this.loanStatus = loanStatus;
        this.overdue = overdue;
    }
}

export default Loan;