import express from 'express';

import 'express-async-errors';
import 'dotenv/config';
import 'colors';

import * as swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';
const swaggerDocument = yaml.load('./swagger.yaml');

import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import errorHandler from './middleware/error';
import auth from './middleware/auth';
import notFound from './middleware/notFound';

import authRouter from './routes/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import seedRouter from './routes/seed';
import uploadRouter from './routes/upload';
import paymentRouter from './routes/payment';
import cartRouter from './routes/cart';
import messagesRouter from './routes/messages';

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send(`<h1><a href="/docs">Go to Docs</a></h1>`);
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', auth, ordersRouter);
app.use('/api/seed', seedRouter);
app.use('/api/upload', auth, uploadRouter);
app.use('/api/payment', auth, paymentRouter);
app.use('/api/cart', auth, cartRouter);
app.use('/api/messages', auth, messagesRouter);

app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}`.green.bold)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
