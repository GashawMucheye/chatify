import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import colors from 'colors';
import connectDb from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import { ENV } from './lib/env.js';
const app = express();
const PORT = ENV.PORT || 8080;
connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);

app.listen(() =>
  console.log(
    `server running on port:http://localhost:${PORT}`.bgYellow.underline
  )
);
