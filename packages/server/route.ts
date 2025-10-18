import Express from 'express';
import { chatController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controller';

const router = Express.Router();

router.post('/api/chat', chatController.SendMessage);

router.get('/api/products/:id/reviews', reviewController.getReviews);

router.post('/api/products/:id/reviews/summarize', reviewController.getSummary);

export default router;
