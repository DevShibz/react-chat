const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error creating user' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id,username:user.username }, "test@123", { expiresIn: '1h' });
    res.status(200).send({ token, username: user.username });
  } catch (error) {
    res.status(500).send({ message: 'Error logging in user' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send({ message: 'Error resetting password' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send({ message: 'Invalid current password' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).send({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error changing password' });
  }
};

module.exports = { registerUser, loginUser, resetPassword, changePassword };
