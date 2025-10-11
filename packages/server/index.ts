import dotenv from 'dotenv';
import express from 'express';
import { chatController } from './controllers/chat.controller.js';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/chat', chatController.SendMessage);

app.listen(PORT, () => {
    console.log(`Server running at Port http://localhost:${PORT}`);
});
