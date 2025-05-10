const router = require("express").Router();
const { jwtAuth } = require('../middlewares/jwtAuth');
const { signup } = require('../controllers/userController/signupController');
const { login } = require('../controllers/userController/loginController');
const { get } = require('../controllers/userController/getController');
const { getAll } = require('../controllers/userController/getAllController');
const { edit } = require('../controllers/userController/editController');
const { remove } = require('../controllers/userController/deleteController');
const { verify } = require('../controllers/userController/otpController');
const { getByToken } = require('../controllers/userController/getByTokenController');
const { getPending } = require('../controllers/userController/getPendingController');
const { upload } = require("../config/multer");


router.post("/signup", signup); // User Signup
router.post("/login", login); // User Login
router.post("/get", get); // Get User By ID
router.get("/get",jwtAuth, getByToken); // Get User By ID via header token
router.get("/getPending",jwtAuth, getPending); // Get Alumni with pending verification
router.get("/getAll",jwtAuth, getAll); // Get All Users
router.put("/edit", jwtAuth, upload.single("profileImage"), edit); // Edit User Info
router.post("/delete",jwtAuth, remove);// Delete User
router.post("/signup/verify",verify); // OTP Verification
module.exports = router;
