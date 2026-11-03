const { NotificationService } = require('./notificationService');
const { BorrowTransaction } = require('./borrowTransaction');

let instance = null;

/**
 * Pattern Singleton : une seule instance pour tout le programme, accessible
 * uniquement via LibrarySystem.getInstance(). Le constructeur est bloqué
 * si une instance existe déjà.
 */
class LibrarySystem {
  constructor() {
    if (instance) {
      throw new Error('LibrarySystem is a singleton, use getInstance() instead');
    }
    this.users = [];
    this.books = [];
    this.transactions = [];
    this.notificationService = new NotificationService();
  }

  static getInstance() {
    if (!instance) {
      instance = new LibrarySystem();
    }
    return instance;
  }

  // Exposé uniquement pour isoler les tests les uns des autres.
  static resetInstance() {
    instance = null;
  }

  addUser(user) {
    this.users.push(user);
    this.notificationService.subscribe(user);
  }

  addBook(book) {
    this.books.push(book);
  }

  borrowBook(userId, isbn) {
    const user = this.users.find((u) => u.id === userId);
    const book = this.books.find((b) => b.isbn === isbn);
    if (!user) throw new Error(`Unknown user: ${userId}`);
    if (!book) throw new Error(`Unknown book: ${isbn}`);
    if (book.isBorrowed) throw new Error(`Book already borrowed: ${isbn}`);
    if (user.borrowedBooks.length >= user.maxBooks) {
      throw new Error(`${user.name} has reached their borrowing limit`);
    }

    book.isBorrowed = true;
    user.borrowedBooks.push(book);
    const transaction = new BorrowTransaction(user, book);
    this.transactions.push(transaction);
    return transaction;
  }

  returnBook(userId, isbn) {
    const transaction = this.transactions.find(
      (t) => t.user.id === userId && t.book.isbn === isbn && !t.isReturned
    );
    if (!transaction) throw new Error(`No active loan for ${userId} / ${isbn}`);

    transaction.close();
    transaction.book.isBorrowed = false;
    transaction.book.overdue = false;
    transaction.user.borrowedBooks = transaction.user.borrowedBooks.filter(
      (b) => b.isbn !== isbn
    );
    return transaction;
  }

  viewBorrowedBooks(userId) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error(`Unknown user: ${userId}`);
    return [...user.borrowedBooks];
  }

  markOverdue(isbn) {
    const book = this.books.find((b) => b.isbn === isbn);
    if (!book) throw new Error(`Unknown book: ${isbn}`);
    book.overdue = true;
    this.notificationService.notifyOverdue(book);
  }
}

module.exports = { LibrarySystem };
