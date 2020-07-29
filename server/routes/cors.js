import express from 'express';
import cors from 'cors';
const app = express();

const whitelist = [
  'http://localhost:3000', 
  'https://localhost:3443',
];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  };
  callback(null, corsOptions);
};

export const defaultCors = cors();
export const corsWithOptions = cors(corsOptionsDelegate);