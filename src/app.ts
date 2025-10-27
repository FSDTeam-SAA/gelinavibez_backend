import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFoundError from './app/error/notFoundError';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes/routes';
import stripeWebhook from './app/modules/payment/payment.webhook';
// import { chargeController } from './app/modules/charge/charge.controller';
const app = express();

// Middlewares
<<<<<<< HEAD
app.use(cors({ origin: ['http://localhost:3000','http://localhost:3001'], credentials: true }));
=======
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://gelinavibez-admindashboard.vercel.app',
      'https://gelinavibez-frontend.vercel.app',
    ],
    credentials: true,
  }),
);
>>>>>>> 6d864d553c33daf63d2cc7882bc930e6c0cff0ae
app.use(cookieParser());

// app.post(
//   '/webhook',
//   express.raw({ type: 'application/json' }),
//   chargeController.stripeWebhook,
// );
app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes (Centralized router)
app.use('/api/v1', router);

// Root router
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the server' });
});

// Not found route
app.use(notFoundError);

// Global error handler
app.use(globalErrorHandler);

export default app;
