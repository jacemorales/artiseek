const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../database');
const sendEmail = require('../utils/email');
const auth = require('../middleware/auth');

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { firstName, surname, email, password, userType } = req.body;

  try {
    let user = await db.findUserByEmail(email);

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.createUser({
      firstName,
      surname,
      email,
      password: hashedPassword,
      userType,
    });

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    await db.updateUser(newUser.id, {
      emailVerificationToken: hashedToken,
    });

    // Send verification email
    const verificationURL = `${req.protocol}://${req.get(
      'host'
    )}/api/users/verify/${verificationToken}`;

    const message = `Please verify your email by clicking on the following link: \n\n ${verificationURL}`;

    try {
      await sendEmail({
        email: newUser.email,
        subject: 'Email Verification',
        message,
      });

      res.status(200).json({ msg: 'Verification email sent' });
    } catch (err) {
      console.error(err.message);
      // If email sending fails, we should probably handle it better,
      // maybe by deleting the user or allowing them to resend the email.
      // For now, we'll just send an error.
      await db.deleteUser(newUser.id);
      return res.status(500).send('Error sending verification email');
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await db.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.isEmailVerified) {
        return res.status(400).json({ msg: 'Please verify your email first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        const { password, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/verify/:token
// @desc    Verify email
// @access  Public
router.get('/verify/:token', async (req, res) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    try {
        const db_data = await db.readDB();
        const user = db_data.users.find(u => u.emailVerificationToken === hashedToken);

        if (!user) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        await db.updateUser(user.id, {
            isEmailVerified: true,
            emailVerificationToken: null,
        });

        res.status(200).json({ msg: 'Email verified successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   PUT api/users/onboarding
// @desc    Update user onboarding data
// @access  Private
router.put('/onboarding', auth, async (req, res) => {
    const { phone, dob, location, userSpecificType, nin, bvn, driversLicense } = req.body;
    const userId = req.user.id;

    try {
        const user = await db.findUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const updatedData = {
            phone,
            dob,
            location,
            nin,
            bvn,
            driversLicense,
            onboardingComplete: true,
        };

        if (user.userType === 'Client') {
            updatedData.clientType = userSpecificType;
        } else {
            updatedData.freelancerType = userSpecificType;
        }

        const updatedUser = await db.updateUser(userId, updatedData);
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   GET api/users/me
// @desc    Get current user's data
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await db.findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
