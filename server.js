// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;
const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connect successfully'))
  .catch((err) => console.log(`DB connection error: ${err}`));

/**
 * Start server
 */
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App runing on port ${port}...`);
});
