/**
 * Test MongoDB Connection
 * Author: hoangedu773
 */

import { connectMongoDB, closeMongoDB } from './src/config/mongodb.js';

async function testConnection() {
  console.log('🚀 Starting MongoDB connection test...\n');
  
  try {
    // Test connection
    console.log('1️⃣ Testing connection...');
    const db = await connectMongoDB();
    console.log('   ✅ Connected successfully!\n');
    
    // Test insert
    console.log('2️⃣ Testing INSERT operation...');
    const testCollection = db.collection('test');
    const insertResult = await testCollection.insertOne({
      message: 'Hello from O An Quan Game!',
      timestamp: new Date(),
      author: 'hoangedu773'
    });
    console.log('   ✅ Inserted document ID:', insertResult.insertedId.toString());
    
    // Test find
    console.log('\n3️⃣ Testing FIND operation...');
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('   ✅ Found document:');
    console.log('   📄 Message:', foundDoc.message);
    console.log('   ⏰ Timestamp:', foundDoc.timestamp);
    console.log('   👤 Author:', foundDoc.author);
    
    // Test delete
    console.log('\n4️⃣ Testing DELETE operation...');
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('   ✅ Test document deleted');
    
    // Close connection
    await closeMongoDB();
    
    console.log('\n✅ ALL TESTS PASSED!');
    console.log('🎉 MongoDB Atlas is ready to use!');
    console.log('\n📝 Next steps:');
    console.log('   - Update App.jsx to use MongoDB services');
    console.log('   - Replace mockAuthService with mongoAuthService');
    console.log('   - Replace mockMatchService with mongoMatchService');
    console.log('   - Test the web app: npm run dev');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check connection string in src/config/mongodb.js');
    console.error('   2. Verify password is correct (no <password> placeholder)');
    console.error('   3. Check IP whitelist in MongoDB Atlas');
    console.error('   4. Ensure mongodb package is installed: npm install mongodb');
    process.exit(1);
  }
}

testConnection();
