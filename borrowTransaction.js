class BorrowTransaction {
  constructor(user, book, borrowDate = new Date()) {
    this.user = user;
    this.book = book;
    this.borrowDate = borrowDate;
    this.returnDate = null;
  }

  get isReturned() {
    return this.returnDate !== null;
  }

  close(returnDate = new Date()) {
    this.returnDate = returnDate;
  }
}

module.exports = { BorrowTransaction };
