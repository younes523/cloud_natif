const db = require('../config/db');

class User {
    static getAll(callback) {
        db.query('SELECT * FROM users', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM users WHERE id = ?', [id], callback);
    }

    static create(data, callback) {
        db.query('INSERT INTO users SET ?', data, callback);
    }

    static update(id, data, callback) {
        db.query('UPDATE users SET ? WHERE id = ?', [data, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM users WHERE id = ?', [id], callback);
    }
}

module.exports = User;
