class Book {
    constructor({
      category,
      bookId,
      accNo,
      bookTitle,
      subTitle,
      parallelTitle,
      initial,
      classNo,
      callNo,
      bookCover,
      sor,
      isbn,
      authorOne,
      authorTwo,
      authorThree,
      other,
      translator,
      pagination,
      size,
      illustrationType,
      seriesTitle,
      seriesNo,
      includeCD,
      subjectOne,
      subjectTwo,
      subjectThree,
      edition,
      editor,
      place,
      publisher,
      year,
      keywords,
      summary,
      notes,
      source,
      price,
      donor,
      catalogOwner,
      barcode,
      loanStatus = 0,
    }) {
      this.category = category;
      this.bookId = bookId;
      this.accNo = accNo;
      this.bookTitle = bookTitle;
      this.subTitle = subTitle;
      this.parallelTitle = parallelTitle;
      this.initial = initial;
      this.classNo = classNo;
      this.callNo = callNo;
      this.bookCover = bookCover;
      this.sor = sor;
      this.isbn = isbn;
      this.authorOne = authorOne;
      this.authorTwo = authorTwo;
      this.authorThree = authorThree;
      this.other = other;
      this.translator = translator;
      this.pagination = pagination;
      this.size = size;
      this.illustrationType = illustrationType;
      this.seriesTitle = seriesTitle;
      this.seriesNo = seriesNo;
      this.includeCD = includeCD;
      this.subjectOne = subjectOne;
      this.subjectTwo = subjectTwo;
      this.subjectThree = subjectThree;
      this.edition = edition;
      this.editor = editor;
      this.place = place;
      this.publisher = publisher;
      this.year = year;
      this.keywords = keywords;
      this.summary = summary;
      this.notes = notes;
      this.source = source;
      this.price = price;
      this.donor = donor;
      this.catalogOwner = catalogOwner;
      this.barcode = barcode;
      this.loanStatus = loanStatus;
    }
  
  }
  
  export default Book;
  