const bcrypt = require('bcrypt');
const userModel = require("../../models/userSchema");

const edit = async (req, res) => {
  const { userID, name, email, branch, batch, password, githubURL, xURL, linkedinURL, jobLocation, companyName, position, floatedProjects, floatedJobs, offeredReferrals, notifications, verificationStatus } = req.body;
    // const token = req.headers.authorization;
    // console.log(token);
    const profilePicURL = req?.file?.path;
  try {
    console.log("userId : ",userID);
    const user = await userModel.findOne({ userID });
    if (!user) {
      return res.status(401).json({ msg: "User Not Found" });
    }
    const hashedPassword = password ? await bcrypt.hash(password, 8) : user.password;
    const update = {
      name,
      email,
      password: hashedPassword,
      profilePicURL:profilePicURL,
      branch,
      batch,
      githubURL,
      xURL,
      linkedinURL,
      jobLocation,
      companyName,
      position,
      verificationStatus,
      floatedProjects: floatedProjects ? [...user.floatedProjects, ...(floatedProjects instanceof Array ? floatedProjects : [floatedProjects])] : user.floatedProjects,
      floatedJobs: floatedJobs ? [...user.floatedJobs,...(floatedJobs instanceof Array ? floatedJobs : [floatedJobs])] : user.floatedJobs,
      offeredReferrals: offeredReferrals ? [...user.offeredReferrals, ...(offeredReferrals instanceof Array ? offeredReferrals : [offeredReferrals])] : user.offeredReferrals,
      notifications: notifications ? [...user.notifications,...(notifications instanceof Array ? notifications : [notifications])] : user.notifications,
    };
    const updatedUser = await userModel.findOneAndUpdate(
      { userID },
      update,
      { new: true }
    );
    res.json({UpdatedUser:updatedUser}); // Return the updated user
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "An error occurred while updating the document", err });
  }
};

module.exports = { edit };