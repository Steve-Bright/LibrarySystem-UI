class Loan{
    constructor({
        loanDatabaseId,
        bookDatabaseId,
        memberDatabaseId,
        accNo,
        category,
        callNo,
        bookTitle,
        bookCover,
        memberId,
        name,
        memberType,
        phone,
        photo,
        bookModel,
        loanDate,
        dueDate,
        duration,
        loanStatus,
        returnDate,
        overdue
    }){
        this.loanDatabaseId = loanDatabaseId;
        this.bookDatabaseId = bookDatabaseId;
        this.memberDatabaseId = memberDatabaseId;
        this.accNo = accNo;
        this.category = category;
        this.callNo = callNo;
        this.bookTitle = bookTitle;
        this.bookCover = bookCover;
        this.memberId = memberId;
        this.name = name;
        this.memberType = memberType;
        this.phone = phone;
        this.photo = photo;
        this.bookModel = bookModel;
        this.loanDate = loanDate;
        this.dueDate = dueDate;
        this.duration = duration;
        this.loanStatus = loanStatus;
        this.returnDate = returnDate;
        this.overdue = overdue;
    }
}

export default Loan;