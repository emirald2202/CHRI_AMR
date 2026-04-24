const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const emailToPromote = process.argv[2];

if (!emailToPromote) {
    console.error('Please provide an email to promote to admin.');
    console.error('Usage: node makeAdmin.js <email>');
    process.exit(1);
}

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: emailToPromote });
        if (!user) {
            console.error(`User with email ${emailToPromote} not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();
        console.log(`Successfully promoted ${user.name} (${user.email}) to Admin!`);
        
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

run();
