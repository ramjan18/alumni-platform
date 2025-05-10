const mongoose = require('mongoose');
const currentYear = new Date().getFullYear();// Required for calculating batch year max limit. 

//------------------------------------------------Subschema for notifications----------------------------------------
const notificationSchema = new mongoose.Schema({
    type: String,
    name: String,
    userID: String,
    objID: String
  });


  //---------------------------------------------Refferal Subschema ------------------------------------------
  const referralSchema = new mongoose.Schema({
    userID: String,
    objID: String,
  });
//------------------------------------------------Default Notifications----------------------------------------------
const defaultNotification = {
    type: "Account Creation",
    name: "Yahoo! Account Created.",
    objID: "Yahoo! Account Created."
  };


//-------------------------------------------------Defining User Schema------------------------------------------------
const userSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rank: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3],
  },
  verificationStatus: {
    type: Number,
    enum: [-1, 0, 1],
  },
  profilePicURL: {
    type: String,
    default: "",
  },
  githubURL: {
    type: String,
    default: "",
    // unique: true
  },
  xURL: {
    type: String,
    default: "",
    // unique: true
  },
  linkedinURL: {
    type: String,
    default: "",
    // unique: true
  },
  branch: {
    type: String,
    default: "",
  },
  batch: {
    type: Number,
    min: 2020,
    max: currentYear + 4,
    default: null,
  },
  notifications: {
    type: [notificationSchema],
    default: [defaultNotification],
  },
  jobLocation: {
    type: String,
    default: "",
  },
  companyName: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  floatedProjects: {
    type: [String],
  },
  floatedJobs: {
    type: [String],
  },
  offeredReferrals: {
    type: [referralSchema],
    default: [],
  },
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;