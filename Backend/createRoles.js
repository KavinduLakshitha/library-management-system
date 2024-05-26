const mongoose = require('mongoose');
const Role = require('./models/role'); 
require('dotenv').config();

const createRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const roles = [
      { role_name: 'user' },
      { role_name: 'admin' }
    ];

    for (const role of roles) {
      const existingRole = await Role.findOne({ role_name: role.role_name });
      if (!existingRole) {
        await new Role(role).save();
        console.log(`Role ${role.role_name} created`);
      } else {
        console.log(`Role ${role.role_name} already exists`);
      }
    }

    console.log('Roles creation completed');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating roles:', error);
  }
};

createRoles();
