const User = require('../../models/userSchema');

const editProfilePic =async (req , res)=>{

    try {
        const { id } = req.params;
        const profilePicURL = req?.file?.path;

        if (!profilePicURL) {
          return res.status(404).json({
            msg: "No file selected",
          });
        }

        const updatedPic = await User.findByIdAndUpdate(id, {
          profilePicURL: profilePicURL || User.profilePicURL,
        });

        return res.status(200).json({
          msge: "Profile pic updated Successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msge : "failed to update ProfilePic"
        })
    }
   
}