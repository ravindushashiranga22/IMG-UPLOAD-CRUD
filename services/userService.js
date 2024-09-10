// services/userService.js
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

exports.addUser = async (userData, file) => {
    const user = new User({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        image: file ? file.filename : '',
    });

    return user.save();
};

exports.getAllUsers = () => {
    return User.find({ deleted: false }).exec();
};

exports.getUserById = (id) => {
    return User.findById(id).exec();
};

exports.updateUser = async (id, userData, file, oldImage) => {
    const newImage = file ? file.filename : oldImage;

    if (file && oldImage) {
        try {
            fs.unlinkSync(path.join(__dirname, '../uploads/', oldImage));
        } catch (err) {
            console.error('Error deleting old image:', err);
        }
    }

    return User.findByIdAndUpdate(id, {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        image: newImage,
    }).exec();
};

exports.deleteUser = async (id) => {
    const user = await User.findByIdAndRemove(id).exec();

    if (user && user.image) {
        try {
            fs.unlinkSync(path.join(__dirname, '../uploads/', user.image));
        } catch (err) {
            console.error('Error deleting image:', err);
        }
    }

    return user;
};
