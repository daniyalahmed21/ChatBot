import dotenv from 'dotenv';
import express from 'express';
import router from './route.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(router);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at Port http://localhost:${PORT}`);
});
