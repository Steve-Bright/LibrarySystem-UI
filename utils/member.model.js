class Member {
    constructor({
        memberDatabaseId,
        memberType,
        department,
        personalId,
        memberId,
        name,
        nrc,
        gender,
        phone,
        email,
        permanentAddress,
        currentAddress,
        note,
        photo,
        issueDate,
        extendDate,
        expiryDate,
        block,
        barcode,
        loanBooks = 0
    }){
        this.memberDatabaseId = memberDatabaseId;
        this.memberType = memberType;
        this.department = department;
        this.personalId = personalId;
        this.memberId = memberId;
        this.name = name;
        this.nrc = nrc;
        this.gender = gender;
        this.phone = phone;
        this.email = email;
        this.permanentAddress = permanentAddress;
        this.currentAddress = currentAddress;
        this.photo = photo;
        this.note = note;
        this.issueDate = issueDate;
        this.extendDate = extendDate;
        this.expiryDate = expiryDate;
        this.block = block;
        this.barcode = barcode;
        this.loanBooks = loanBooks;
    }
}

export default Member;