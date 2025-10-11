import Express from 'express';
import { chatController } from './controllers/chat.controller';

const router = Express.Router();

router.post('/api/chat', chatController.SendMessage);

export default router;
