const { Router } = require("express");
const userRouter = Router();
const { userModel, courseModel, purchaseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

userRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;
  try {
    await userModel.create({
      email,
      password,
      firstName,
      lastName,
    });
    res.status(200).json({
      message: "user sign up successfull",
    });
  } catch (e) {
    res.status(403).json({
      message: "user signup failed",
    });
  }
});
userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email: email,
    password: password,
  });
  if (user) {
    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
    res.status(200).json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "invalid credentials",
    });
  }
});
userRouter.post("/purchases", userMiddleware, async function (req, res) {
  const userId = req.userId;

  try {
    const purchases = await purchaseModel.find({
      userId: userId,
    });

    const courseData = await courseModel.find({
      _id: { $in: purchases.map((x) => x.courseId) },
    });

    res.status(200).json({
      purchases,
      courseData,
    });
  } catch (e) {
    res.status(403).json({
      message: "failed to fetch courses",
    });
  }
});

module.exports = {
  userRouter: userRouter,
};
