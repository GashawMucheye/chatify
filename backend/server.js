import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import colors from 'colors';
import connectDb from './lib/db.js';
import { ENV } from './lib/env.js';
import authRoute from './routes/authRoutes.js';
import messageRoute from './routes/messageRoute.js';
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());
const PORT = ENV.PORT || 8080;
app.use(express.json());
app.use('/auth', authRoute);
app.use('/messages', messageRoute);
app.listen(PORT, () => {
  console.log(
    `Server running on port: http://localhost:${PORT}`.bgYellow.underline
  );
  connectDb();
});
