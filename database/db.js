const mongoose = require("mongoose");

exports.connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    
    });
    console.log(`Database connected`);
  } catch (error) {
    console.log(error);
  }
};
