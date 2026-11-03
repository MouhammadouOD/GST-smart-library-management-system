const { Student, Teacher } = require('./user');

/**
 * Pattern Factory : centralise la construction des sous-types de User,
 * l'appelant n'a jamais besoin de connaître les classes concrètes.
 */
class UserFactory {
  static createUser(type, id, name) {
    switch (type) {
      case 'student':
        return new Student(id, name);
      case 'teacher':
        return new Teacher(id, name);
      default:
        throw new Error(`Unknown user type: ${type}`);
    }
  }
}

module.exports = { UserFactory };
