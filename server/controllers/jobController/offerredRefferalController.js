const User = require("../../models/userSchema"); // adjust the path as needed

// POST /api/referrals/respond
const handleReferralRequest = async (req, res) => {
  try {
    const { alumniId, studentId, referralId, action } = req.body;

    // if (!["accept", "decline"].includes(action)) {
    //   return res.status(400).json({ message: "Invalid action" });
    // }

    const alumni = await User.findOne({ userID: alumniId });
    const student = await User.findOne({ userID: studentId });

    if (!alumni || !student) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the referral notification from alumni's notifications
    // Remove the referral notification from alumni's notifications
    console.log("Before filter:", alumni.notifications);

    alumni.notifications = alumni.notifications.filter((n) => {
        // console.log("inside : ", n);
        console.log("type :" ,n.type)
        console.log(n.userID ,"=> " , studentId);
         console.log(n.objID, "=> ", referralId);
      return !(
        n.type === "Referral Request" &&
        n.userID.toString() === studentId.toString() &&
        n.objID.toString() === referralId.toString()
      );
    });

    // Add referral info if accepted
    if (action === "accept") {
      // Add to offeredReferrals
      alumni.offeredReferrals.push({
        userID: studentId,
        objID: referralId,
      });

      // Notify student of acceptance
      student.notifications.push({
        type: "ReferralAccepted",
        name: `Your referral request was accepted by ${alumni.name}.`,
        userID: alumniId,
        objID: referralId,
      });
    } else {
      // Notify student of rejection
      student.notifications.push({
        type: "ReferralDeclined",
        name: `Your referral request was declined by ${alumni.name}.`,
        userID: alumniId,
        objID: referralId,
      });
    }

    await alumni.save();
    await student.save();

    res
      .status(200)
      .json({ message: `Referral request ${action}ed successfully.` });
  } catch (error) {
    console.error("Error handling referral request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { handleReferralRequest };
