// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE_LOCAL;

// connect with our DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connect successfully'))
  .catch((err) => console.log(`DB connection error: ${err}`));

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// Import Data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

// Delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully!');
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
