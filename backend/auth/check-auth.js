const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share_please');
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    throw new Error(err)
  }

};


  // const timeInt = new Date(parseInt(verify.iat) * 1000)
  // const timeExp = new Date(parseInt(verify.exp) * 1000)
