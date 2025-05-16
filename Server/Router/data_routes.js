import express from 'express';
import { post,load,preview ,like,offer } from '../Controller/data_controller.js';
import upload from '../multer/multer.config.js';

const data_routes = express.Router();

data_routes.post('/post', upload.array('file', 10), post);
data_routes.get('/load', load);
data_routes.get("/loadpreview/:id",preview)
data_routes.post("/like/:id",like)
data_routes.post("/offer",offer)

export default data_routes;