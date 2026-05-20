const express= require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const app= express();
const cors = require('cors');

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/' , authRouter);
app.use('/' , profileRouter);
app.use('/' , requestRouter);
app.use('/'  , userRouter);
connectDB()
  .then(() => {
    console.log('Connected to MongoDB');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });