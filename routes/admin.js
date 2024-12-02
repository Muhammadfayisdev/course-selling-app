const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

const adminRouter = Router();

const { adminModel, courseModel, userModel } = require("../db");

adminRouter.post("/signup", async function (req, res) {
  // TODO : add dcrypt and zod validation
  const { email, password, firstName, lastName } = req.body;
  try {
    await adminModel.create({
      email,
      password,
      firstName,
      lastName,
    });
    res.status(200).json({
      message: "admin sign up successfull",
    });
  } catch (e) {
    res.status(403).json({
      message: "admin sign up failed",
    });
  }
});

adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  const admin = await adminModel.findOne({
    email: email,
    password: password,
  });
  if (admin) {
    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
    res.status(200).json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Invalid credentials",
    });
  }
});

adminRouter.post("/course", adminMiddleware, async function (req, res) {
  const adminId = req.userId;
  const { title, description, price, imageUrl } = req.body;
  try {
    const course = await courseModel.create({
      title,
      description,
      price,
      imageUrl,
      creatorId: adminId,
    });
    res.status(200).json({
      message: "course is created",
      courseId: course._id,
    });
  } catch (e) {
    res.status(403).json({
      message: "course creation failed",
    });
  }
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
  const adminId = req.userId;
  const { title, description, price, imageUrl, courseId } = req.body;
  try {
    // early return

    // const course=await courseModel.findOne({
    //     _id:courseId,
    //     creatorId:adminId
    // })

    // if(!course){
    //     res.status(400).json({
    //         message:"Course doesn't exist"
    //     })
    // }

    const course = await courseModel.updateOne(
      { _id: courseId, creatorId: adminId },
      {
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
      }
    );
    res.status(200).json({
      message: "course is created",
      courseId: course._id,
    });
  } catch (e) {
    res.status(403).json({
      message: "course creation failed",
    });
  }
});

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
  const adminId = req.userId;
  try {
    const courses = await userModel.find({
      creatorId: adminId,
    });
    res.status(200).json({
      courses: courses,
    });
  } catch (e) {
    res.status(403).json({
      message: "course fetching failed",
    });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
