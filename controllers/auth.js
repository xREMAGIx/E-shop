const crypto = require("crypto");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const sendEmail = require("../utils/sendEmail");

// @des Register User
// @route POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  console.log(1);
  const user = await User.create(req.body);
  console.log(2);

  // Get confirm token
  const confirmToken = user.getConfirmEmailToken();

  await user.save({ validateBeforeSave: false });

  // Create confirm url
  const confirmUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/confirm-email/${confirmToken}`;

  console.log(confirmUrl);

  const message = `Click on the link below to confirm your email: \n\n ${confirmUrl}`;

  try {
    //await sendEmail({ email: user.email, subject: "CONFIRM EMAIL", message });

    return res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    console.log(error);

    return next(new ErrorResponse("Email could not be sent"));
  }
});

// @des Confirm email
// @route GET /api/auth/confirm-email/:confirmToken
// @access  Public
exports.confirmEmail = asyncHandler(async (req, res, next) => {
  // Get hash token
  const authenticationToken = crypto
    .createHash("sha256")
    .update(req.params.confirmToken)
    .digest("hex");

  const user = await User.findOne({
    authenticationToken,
    confirmEmailExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.isAuthentication = true;
  user.authenticationToken = undefined;
  user.confirmEmailExpire = undefined;

  await user.save();
  sendTokenResponse(user, 200, res);
});

// @des Login User
// @route POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Wrong email", 401));
  }

  // CHeck password
  const isMatch = await user.matchPassword(password);

  console.log(5);
  if (!isMatch) return next(new ErrorResponse("Wrong password", 401));

  if (!user.isAuthentication) {
    return next(
      new ErrorResponse("Check your email to confirm your account", 400)
    );
  }

  // Set cart session
  let cart = await Cart.findOne({ user: user._id });
  if (!cart) cart = await Cart.create({ user: user._id });
  req.session.cart = cart;

  // console.log("req.session.cart ", cart);
  sendTokenResponse(user, 200, res);
});

// @des Get current logged in user
// @route POST /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  console.log(1);
  console.log(req.user);
  const user = await User.findById(req.user.id);

  console.log("Get me " + user);
  return res.status(200).json({ success: true, data: user });
});

// @des Get Reset password
// @route GET /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// @des Forgot password
// @route POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There os no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetpassword/${resetToken}`;

  const message = `Click on the link below to reset password to 123456: \n\n ${resetUrl}`;

  try {
    await sendEmail({ email: user.email, subject: "RESET PASSWORD", message });

    return res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.password = 123456;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent"));
  }
});

// @des Get confirm Email token
// @route POST /api/auth/authenication/:email
// @access  Public
exports.activeAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const authToken = user.getConfirmEmailToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const activeUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/confirm-email/${authToken}`;

  const message = `Click on the link below to acctive your account: \n\n ${activeUrl}`;

  try {
    //await sendEmail({ email: user.email, subject: "ACTIVE ACCOUNT", message });

    return res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    console.log(error);

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent"));
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = false;
  }
  return res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

// @des Logout and clear cookie
// @route POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return res.status(200).json({ success: true, data: {} });
});
