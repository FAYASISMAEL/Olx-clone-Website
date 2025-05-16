import express from 'express';
import url from 'url';
import cors from 'cors';
import connection from './connection.js';
import path, { dirname, join } from 'path';
import data_routes from './Router/data_routes.js';

const app = express();

const port = 3000;
const file_name = url.fileURLToPath(import.meta.url);
const __dirname = dirname(file_name);
const Client = join(__dirname, '..', 'Client');

app.use(express.static(Client));
app.use(express.json({limit: '150mb'}));
app.use(cors());
app.use('/api', data_routes);
app.use('/images',express.static(path.join(__dirname,'images')))

connection().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to connect database', err);
});