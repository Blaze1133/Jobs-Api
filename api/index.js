require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// extra secuirty packages
const helmet  =require('helmet')
const cors = require('cors');
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const auth = require('../middleware/authentication');

//connect db
const connectDB = require('../db/connect');

//routers
const authRouter = require('../routes/auth');
const jobRouter = require('../routes/jobs');


// error handler
const notFoundMiddleware = require('../middleware/not-found');
const errorHandlerMiddleware = require('../middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs 
}))

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

app.get('/', (req, res) => { // dummy api just for testing purposes
  res.send('jobs api');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', auth,jobRouter);
// routes

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async()=>{
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to DB");
    app.listen(port, () => {
      console.log(`Server started on ${port}`)});
  } catch (error) {
    console.log('error')
  }
}

start();

const serverless = require('serverless-http'); 
module.exports = serverless(app);
