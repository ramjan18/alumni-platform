const Payment = require("../../models/paymentSchema");

const PaymentController = async(req,res) => {
    const token = req.headers.authorization;

    const user = jwt.verify(token, process.env.jwtPassword);
          console.log('decoded:', user)

}

module.exports ={PaymentController}