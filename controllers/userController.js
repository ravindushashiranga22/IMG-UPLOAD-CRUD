// controllers/userController.js
const userService = require('../services/userService');

exports.addUser = async (req, res) => {
    try {
        await userService.addUser(req.body, req.file);
        req.session.message = {
            type: 'success',
            message: 'User added successfully!',
        };
        res.redirect('/');
    } catch (err) {
        console.error('Error adding user:', err);
        req.session.message = {
            type: 'danger',
            message: 'Error adding user: ' + err.message,
        };
        res.redirect('/add-user');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.render('index', {
            title: "Home Page",
            users: users,
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.json({ message: 'Error fetching users: ' + err.message });
    }
};

exports.renderAddUserPage = (req, res) => {
    res.render('add-user', { title: "Add User" });
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user || user.deleted) {
            return res.redirect('/');
        }
        res.render('edit_users', {
            title: "Edit User",
            user: user,
        });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.redirect('/');
    }
};

exports.updateUser = async (req, res) => {
    try {
        await userService.updateUser(req.params.id, req.body, req.file, req.body.old_image);
        req.session.message = {
            type: 'success',
            message: 'User updated successfully!',
        };
        res.redirect('/');
    } catch (err) {
        console.error('Error updating user:', err);
        res.json({ message: 'Error updating user: ' + err.message, type: 'danger' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        req.session.message = {
            type: 'info',
            message: 'User deleted successfully!',
        };
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.json({ message: 'Error deleting user: ' + err.message });
    }
};
