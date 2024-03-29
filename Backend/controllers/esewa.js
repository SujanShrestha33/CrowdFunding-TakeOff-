

exports.verifyPayment = async (req, res, next) => {
  const data = req.query.data
  let decodedString = atob(data);
  console.log("dec_string", decodedString)
};
