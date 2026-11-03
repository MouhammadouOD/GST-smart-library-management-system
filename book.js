class Book {
  constructor(isbn, title, author) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.isBorrowed = false;
    this.overdue = false; // simulé via un flag, comme demandé par le brief
  }
}

module.exports = { Book };
