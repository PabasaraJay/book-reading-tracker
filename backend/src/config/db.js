const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/book-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.log('\nPlease make sure:');
    console.log('1. MongoDB is installed on your system');
    console.log('2. MongoDB service is running');
    console.log('3. You can start MongoDB service using:');
    console.log('   - Windows: Open Services app and start MongoDB service');
    console.log('   - Or run: mongod --dbpath="C:/data/db" (create the directory if it doesn\'t exist)');
    process.exit(1);
  }
};

module.exports = connectDB; 