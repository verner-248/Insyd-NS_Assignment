const mongoose = require('mongoose');
require('dotenv').config();

const { seedUsers } = require('./userSeeder');
const { seedPosts } = require('./postSeeder');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://rohitspringtemp:V2p4NENn3Vmvp6qB@cluster0.iw7vuvu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📦 Connected to MongoDB');

    // Seed users first
    console.log('👥 Seeding users...');
    await seedUsers();

    // Seed posts
    console.log('📝 Seeding posts...');
    await seedPosts();

    console.log('✅ Database seeded successfully!');
    console.log('🎉 You can now run the application with real data');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase }; 