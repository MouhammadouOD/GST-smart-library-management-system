const assert = require('assert');
const { User, Student, Teacher } = require('./user');
const { UserFactory } = require('./userFactory');
const { Book } = require('./book');
const { LibrarySystem } = require('./librarySystem');

const TOTAL_TESTS = 13;
let passed = 0;
function test(name, fn) {
  LibrarySystem.resetInstance();
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

console.log('User / Factory');
{
  test('User est abstraite : instanciation directe lève une erreur', () => {
    assert.throws(() => new User('u1', 'Alice'), TypeError);
  });

  test('UserFactory crée le bon sous-type selon le paramètre', () => {
    const student = UserFactory.createUser('student', 's1', 'Alice');
    const teacher = UserFactory.createUser('teacher', 't1', 'Bob');
    assert.ok(student instanceof Student);
    assert.ok(teacher instanceof Teacher);
    assert.strictEqual(student.maxBooks, 3);
    assert.strictEqual(teacher.maxBooks, 10);
  });

  test('UserFactory rejette un type inconnu', () => {
    assert.throws(() => UserFactory.createUser('ghost', 'g1', 'X'));
  });
}

console.log('LibrarySystem (Singleton)');
{
  test('getInstance() renvoie toujours la même instance', () => {
    const a = LibrarySystem.getInstance();
    const b = LibrarySystem.getInstance();
    assert.strictEqual(a, b);
  });

  test('le constructeur refuse une 2e instance tant que la 1ère existe', () => {
    LibrarySystem.getInstance();
    assert.throws(() => new LibrarySystem());
  });

  test('deux `new LibrarySystem()` directs (sans getInstance) lèvent une erreur au 2e appel', () => {
    new LibrarySystem();
    assert.throws(() => new LibrarySystem());
  });
}

console.log('Emprunt / retour');
{
  test('emprunter un livre le marque indisponible et l\'ajoute à la liste du user', () => {
    const lib = LibrarySystem.getInstance();
    const alice = UserFactory.createUser('student', 's1', 'Alice');
    const book = new Book('ISBN-1', 'Clean Code', 'Robert C. Martin');
    lib.addUser(alice);
    lib.addBook(book);

    lib.borrowBook('s1', 'ISBN-1');

    assert.strictEqual(book.isBorrowed, true);
    assert.deepStrictEqual(lib.viewBorrowedBooks('s1'), [book]);
  });

  test('emprunter un livre déjà emprunté échoue (preuve que le check est réel)', () => {
    const lib = LibrarySystem.getInstance();
    const alice = UserFactory.createUser('student', 's1', 'Alice');
    const bob = UserFactory.createUser('student', 's2', 'Bob');
    const book = new Book('ISBN-1', 'Clean Code', 'Robert C. Martin');
    lib.addUser(alice);
    lib.addUser(bob);
    lib.addBook(book);

    lib.borrowBook('s1', 'ISBN-1');
    assert.throws(() => lib.borrowBook('s2', 'ISBN-1'));
  });

  test('un Student ne peut pas dépasser sa limite de 3 livres', () => {
    const lib = LibrarySystem.getInstance();
    const alice = UserFactory.createUser('student', 's1', 'Alice');
    lib.addUser(alice);
    ['A', 'B', 'C', 'D'].forEach((isbn) => lib.addBook(new Book(isbn, isbn, 'Author')));

    lib.borrowBook('s1', 'A');
    lib.borrowBook('s1', 'B');
    lib.borrowBook('s1', 'C');
    assert.throws(() => lib.borrowBook('s1', 'D'));
  });

  test('rendre un livre le rend de nouveau empruntable et vide la liste du user', () => {
    const lib = LibrarySystem.getInstance();
    const alice = UserFactory.createUser('student', 's1', 'Alice');
    const book = new Book('ISBN-1', 'Clean Code', 'Robert C. Martin');
    lib.addUser(alice);
    lib.addBook(book);

    lib.borrowBook('s1', 'ISBN-1');
    lib.returnBook('s1', 'ISBN-1');

    assert.strictEqual(book.isBorrowed, false);
    assert.deepStrictEqual(lib.viewBorrowedBooks('s1'), []);

    // le livre redevient réellement empruntable, pas juste marqué comme tel
    const teacher = UserFactory.createUser('teacher', 't1', 'Bob');
    lib.addUser(teacher);
    assert.doesNotThrow(() => lib.borrowBook('t1', 'ISBN-1'));
  });

  test('rendre un livre non emprunté échoue', () => {
    const lib = LibrarySystem.getInstance();
    const alice = UserFactory.createUser('student', 's1', 'Alice');
    const book = new Book('ISBN-1', 'Clean Code', 'Robert C. Martin');
    lib.addUser(alice);
    lib.addBook(book);

    assert.throws(() => lib.returnBook('s1', 'ISBN-1'));
  });
}

console.log('Overdue (Observer)');
{
  test('markOverdue notifie uniquement les users qui ont réellement ce livre', () => {
    const lib = LibrarySystem.getInstance();
    const alice = UserFactory.createUser('student', 's1', 'Alice');
    const bob = UserFactory.createUser('student', 's2', 'Bob');
    const book = new Book('ISBN-1', 'Clean Code', 'Robert C. Martin');
    lib.addUser(alice);
    lib.addUser(bob);
    lib.addBook(book);
    lib.borrowBook('s1', 'ISBN-1');

    lib.markOverdue('ISBN-1');

    assert.strictEqual(book.overdue, true);
    assert.ok(alice.lastNotification && alice.lastNotification.includes('Clean Code'));
    assert.strictEqual(bob.lastNotification, undefined);
  });

  test('rendre un livre en retard efface le flag overdue', () => {
    const lib = LibrarySystem.getInstance();
    const alice = UserFactory.createUser('student', 's1', 'Alice');
    const book = new Book('ISBN-1', 'Clean Code', 'Robert C. Martin');
    lib.addUser(alice);
    lib.addBook(book);
    lib.borrowBook('s1', 'ISBN-1');
    lib.markOverdue('ISBN-1');

    lib.returnBook('s1', 'ISBN-1');

    assert.strictEqual(book.overdue, false);
  });
}

assert.strictEqual(passed, TOTAL_TESTS, `attendu ${TOTAL_TESTS}, ${passed} exécutés`);
console.log(`\n${passed}/${TOTAL_TESTS} tests passent`);
