/**
 * Classe abstraite : on ne peut pas faire `new User(...)` directement,
 * seulement passer par Student/Teacher (ou la UserFactory).
 */
class User {
  constructor(id, name) {
    if (new.target === User) {
      throw new TypeError('User is abstract and cannot be instantiated directly');
    }
    this.id = id;
    this.name = name;
    this.borrowedBooks = [];
  }

  // Overridden par chaque sous-classe : nombre max de livres empruntables en même temps.
  get maxBooks() {
    throw new Error('maxBooks must be implemented by subclass');
  }

  // Appelé par NotificationService (pattern Observer) quand un livre est en retard.
  notify(message) {
    this.lastNotification = message;
  }
}

class Student extends User {
  get maxBooks() {
    return 3;
  }
}

class Teacher extends User {
  get maxBooks() {
    return 10;
  }
}

module.exports = { User, Student, Teacher };
