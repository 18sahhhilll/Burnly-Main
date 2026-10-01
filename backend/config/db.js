import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js DNS resolver to use Google Public DNS (8.8.8.8) to bypass ISP/Router SRV query blocks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (dnsErr) {
  console.warn('DNS setServers notice:', dnsErr.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/burnly');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
