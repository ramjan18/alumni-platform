const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../../models/userSchema');
const otpModel = require('../../models/otpSchema');

const verify = async (req,res) =>
{
  var otp;
  const { email, otpAttempt, rank, name, password} = req.body;

    otp = await otpModel.findOne({email:email});
    console.log(otp)

  if(otp===null){
    return res.status(404).json({msg:"OTP Expired or Wrong E-Mail."});// 404 Not Found
  }
  if(otp.otp != otpAttempt)
  {
    await otpModel.deleteOne({email:email});
    return res.status(401).json({msg:"Incorrect OTP."});// 401 Unauthorized
  }
  else{
    await otpModel.deleteOne({email:email});
    switch (rank) {
        case 0: // Admin
        {
          bcrypt.hash(password, 8, async (err, hash) => {
            if (err) {
              return res.status(500).json({ msg: "Error Hashing Password:", err }); // 500 Internal Server Error
            }
            try {
              await userModel.create({
                name:name,
                email:email,
                password: hash,
                rank: rank,
              });
              try {
                const token = jwt.sign({ email:email, rank:rank }, process.env.jwtPassword, {
                  expiresIn: "4d"
                  });
                  return res.status(201).json({ msg: "Admin Created Successfully", token }); // 201 Created with token
                } catch (err) {
                  return res.status(500).json({ msg: "Error Generating JWT:", err }); // 500 Internal Server Error
                }
              } catch (err) {
                if (err.name === "ValidationError") {
                  return res.status(422).json({ msg: err.message }); // 422 Unprocessable Entity
                } else if (err.code === 11000 && err.keyPattern.email) {
                  return res.status(409).json({ msg: "Email already exists." }); // 409 Conflict
                } else {
                  return res.status(500).json({ msg: "Internal Server Error:", err }); // 500 Internal Server Error
                }
              }
            });
            break;
          }
          case 1: //Verified alumni
          {
     
          {
            const { name, email, password,linkedinURL } = req.body;
            const account = await userModel.findOne({email : email});
            if (account) {
              return res.status(422).json({ msg: "Email Already In Use." }); //404 Not Found
            }
            bcrypt.hash(password, 8, async (err, hash) => {
              if (err) {
                return res.status(500).json({ msg: "Error Hashing Password:", err }); //500 Internal Server Error
              } else {
                try{
                  var accDetails = { name: "", email: "", password: "", linkedinURL: "",verificationStatus:0, rank:1 };
                  accDetails.name = name;
                  accDetails.email = email;
                  accDetails.password = hash;
                  accDetails.linkedinURL = linkedinURL
                  try{
                    const newUser = new userModel(accDetails);
                    newUser.save();
                    return res.status(201).json({ msg: "Account Info Sent to Admin. Wait for Verification." });//201 Created
                  }
                  catch(err){
                    return res.status(422).json({ msg: "Unable to make notification object to send to admin:", err });//422 Unprocessable Entity
                  }
                }
                catch(err){
                  return res.status(500).json({ msg: "Internal Server Error:", err });//500 Internal Server Error
                }
              }
            });
          }
          break;
        }
        
        case 2: // Verified student
{
  const { name, email, password, batch, branch } = req.body; // Extract batch and branch
  // if (!batch || !branch) {
  //   return res.status(400).json({ msg: "Batch and Branch are required." }); // 400 Bad Request
  // }

  bcrypt.hash(password, 8, async (err, hash) => {
    if (err) {
      return res.status(500).json({ msg: "Error Hashing Password:", err }); // 500 Internal Server Error
    } else {
      try {
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
          return res.status(409).json({ msg: "Email already exists." }); // 409 Conflict
        }

        await userModel.create({
          name: name,
          password: hash,
          email: email,
          rank: rank,
          batch: batch, // Use batch from the request body
          branch: branch, // Use branch from the request body
        });

        try {
          const token = jwt.sign({ email: email, rank: rank }, process.env.jwtPassword, {
            expiresIn: "4d",
          });
          return res.status(201).json({ msg: "User Created Successfully", token }); // 201 Created with token
        } catch (err) {
          return res.status(500).json({ msg: "Error Generating JWT:", err }); // 500 Internal Server Error
        }
      } catch (err) {
        return res.status(422).json({ msg: "Unable to create user object:", err }); // 422 Unprocessable Entity
      }
    }
  });
  break;
}


         case 3: //Unauthorized account
        {
          const { name, email, password } = req.body;
          bcrypt.hash(password, 8, async (err, hash) => {
            if (err) {
              return res.status(500).json({ msg: "Error Hashing Password:", err }); // 500 Internal Server Error
            }
            try {
              await userModel.create({
                name: name,
                password: hash,
                email: email,
                rank: rank,
              });
            } catch (err) {
              if (err.name === 'ValidationError') { // Check for validation errors
                return res.status(422).json({ msg: err.message }); // 422 Unprocessable Entity
              } else {
                return res.status(500).json({ msg: "Internal Server Error:", err }); // 500 Internal Server Error
              }
            }
            try {
              const token = jwt.sign({ email: email, rank:rank }, process.env.jwtPassword, {
                expiresIn: "4d"
              });
              return res.status(201).json({ msg: "User Created Successfully",token: token }); // 201 Created with token
            } catch (err) {
              return res.status(500).json({ msg: "Error Generating JWT:", err }); // 500 Internal Server Error
            }
          });
          break;
        }
      }
    }
}
module.exports = { verify };