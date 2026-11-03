/**
 * Pattern Observer : les users s'enregistrent, et sont notifiés quand un
 * livre qu'ils ont emprunté passe en retard. Aucun couplage direct entre
 * LibrarySystem et un user particulier.
 */
class NotificationService {
  constructor() {
    this.subscribers = new Set();
  }

  subscribe(user) {
    this.subscribers.add(user);
  }

  unsubscribe(user) {
    this.subscribers.delete(user);
  }

  notifyOverdue(book) {
    for (const user of this.subscribers) {
      const isBorrower = user.borrowedBooks.some((b) => b.isbn === book.isbn);
      if (isBorrower) {
        user.notify(`"${book.title}" is overdue`);
      }
    }
  }
}

module.exports = { NotificationService };
