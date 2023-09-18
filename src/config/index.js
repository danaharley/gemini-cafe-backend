import dotenv from "dotenv";

dotenv.config();

// const ORIGIN = "http://localhost:3001";
const ORIGIN = [
  "https://gemini-cafe-frontend.vercel.app",
  "https://d2f3dnusg0rbp7.cloudfront.net",
  "https://app.sandbox.midtrans.com",
];

const PORT = process.env.PORT || 3000;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_URL = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.kn2szfj.mongodb.net/?retryWrites=true&w=majority`;

const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;
const ACCESS_TOKEN_EXPIRES_IN = 15;
const REFRESH_TOKEN_EXPIRES_IN = 59;

const MIDTRANS_IS_PRODUCTION = false;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

const IMAGE_PATH = "public/assets/products/images";

export const config = {
  server: {
    origin: ORIGIN,
    port: PORT,
    accessTokenKey: ACCESS_TOKEN_KEY,
    refreshTokenKey: REFRESH_TOKEN_KEY,
    accessTokenExp: ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExp: REFRESH_TOKEN_EXPIRES_IN,
  },

  mongodb: {
    url: MONGODB_URL,
  },

  midtrans: {
    isProduction: MIDTRANS_IS_PRODUCTION,
    clientKey: MIDTRANS_CLIENT_KEY,
    serverKey: MIDTRANS_SERVER_KEY,
  },

  img: {
    path: IMAGE_PATH,
  },
};
