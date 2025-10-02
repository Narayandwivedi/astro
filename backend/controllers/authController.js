const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User.js");
const { OAuth2Client } = require('google-auth-library');
const { sendLoginAlert, sendSignupAlert, sendGoogleSignupAlert } = require('../utils/telegramNotification');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const handelUserSignup = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    let { fullName, email, password, mobile } = req.body;

    fullName = fullName?.trim();
    email = email?.trim();
    password = password?.trim();

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "missing field" });
    }

    if (mobile && (mobile < 6000000000 || mobile > 9999999999)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number",
      });
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, ...(mobile ? [{ mobile }] : [])]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      if (existingUser.mobile === mobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already exists",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUserData = {
      fullName,
      email,
      password: hashedPassword,
      ...(mobile && { mobile }),
    };

    const newUser = await userModel.create(newUserData);

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    // Send Telegram signup alert
    sendSignupAlert(newUser.fullName, newUser.email).catch(err =>
      console.error('Telegram alert error:', err.message)
    );

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      userData: userObj,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const handelUserLogin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and password are required",
      });
    }

    const isEmail = emailOrMobile.includes("@");
    const isMobile = /^[6-9]\d{9}$/.test(emailOrMobile);

    if (!isEmail && !isMobile) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email or mobile number",
      });
    }

    const query = isEmail
      ? { email: emailOrMobile }
      : { mobile: parseInt(emailOrMobile) };

    const user = await userModel.findOne(query).lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: isEmail ? "Invalid email" : "Invalid mobile number",
      });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const userObj = { ...user };
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    // Send Telegram login alert
    const loginMethod = isEmail ? 'email' : 'mobile';
    sendLoginAlert(user.fullName, loginMethod).catch(err =>
      console.error('Telegram alert error:', err.message)
    );

    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
      userData: userObj,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const handleUserLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

const generateResetPassOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "please provide email address" });
    }

    const getUser = await userModel.findOne({ email });

    if (!getUser) {
      return res.status(400).json({
        success: false,
        message: `user with this email doesn't exist`,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    getUser.resetOtp = otp;
    getUser.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await getUser.save();

    // In a real implementation, send email here
    console.log(`Password reset OTP for ${email}: ${otp}`);

    return res.json({ success: true, message: "otp sent successfully" });
  } catch (err) {
    console.error("Generate OTP Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

const submitResetPassOTP = async (req, res) => {
  try {
    const { otp, newPass, email } = req.body;

    if (!otp || !newPass || !email) {
      return res.status(400).json({ success: false, message: "missing data" });
    }

    const getUser = await userModel.findOne({ email });
    if (!getUser) {
      return res
        .status(400)
        .json({ success: false, message: "user not found try again" });
    }

    if (!getUser.resetOtp) {
      return res
        .status(400)
        .json({ success: false, message: "no otp found for this user" });
    }

    if (getUser.otpExpiresAt < Date.now()) {
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;
      await getUser.save();
      return res.status(400).json({ success: false, message: "otp expired" });
    }

    if (Number(otp) === Number(getUser.resetOtp)) {
      const newHashedPass = await bcrypt.hash(newPass, 10);
      getUser.password = newHashedPass;
      getUser.resetOtp = undefined;
      getUser.otpExpiresAt = undefined;
      await getUser.save();

      return res.json({
        success: true,
        message: "password reset successfully",
      });
    } else {
      return res.status(400).json({ success: false, message: "invalid otp" });
    }
  } catch (err) {
    console.error("Submit OTP Error:", err);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

const isloggedin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findById(decoded.userId)
      .select("-password");

    const userObj = user.toObject();
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;
    delete userObj.googleId;

    user.lastActive = new Date();
    await user.save();

    return res.status(200).json({ isLoggedIn: true, user: userObj });
  } catch (err) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "Invalid or expired token" });
  }
};

// Google OAuth Handler
const handleGoogleAuth = async (req, res) => {
  try {
    const { credential, referedBy } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name: fullName,
      picture: profilePicture,
      email_verified
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Google email not verified'
      });
    }

    // Check if user exists
    let user = await userModel.findOne({ 
      $or: [
        { email: email },
        { googleId: googleId }
      ]
    });

    if (user) {
      // User exists, update Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = profilePicture;
        user.authProvider = 'google';
        user.isEmailVerified = true;
        await user.save();
      }
    } else {
      // Create new user
      const newUserData = {
        fullName,
        email,
        googleId,
        profilePicture,
        isEmailVerified: email_verified,
        authProvider: 'google',
        // Don't set password for Google users
        // Don't set mobile for Google users (will be null)
      };

      user = new userModel(newUserData);
      await user.save();

      // Send Telegram signup alert for new Google users
      sendGoogleSignupAlert(user.fullName, user.email).catch(err =>
        console.error('Telegram alert error:', err.message)
      );
    }

    // Generate JWT token (no expiration)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
      // No expiration
    );

    // Set cookie (no expiration)
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year - user stays logged in forever
    });

    // Prepare user data for response
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;
    delete userObj.googleId;
    delete userObj.__v;

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      userData: userObj
    });

  } catch (error) {
    console.error('Google authentication error:', error.message);
    
    return res.status(400).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message
    });
  }
};


module.exports = {
  handelUserSignup,
  handelUserLogin,
  handleUserLogout,
  generateResetPassOTP,
  submitResetPassOTP,
  isloggedin,
  handleGoogleAuth,
};