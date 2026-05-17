const User = require('../models/userModel');

exports.getAllUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
};

exports.getUserById = (req, res) => {
    const { id } = req.params;
    User.getById(id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
};

exports.createUser = (req, res) => {
    const { name, email } = req.body;
    const data = { name, email };

    User.create(data, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'User created', id: result.insertId });
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const data = req.body;

    User.update(id, data, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({ message: 'User updated' });
        }
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    User.delete(id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({ message: 'User deleted' });
        }
    });
};
