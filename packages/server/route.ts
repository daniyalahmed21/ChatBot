import Express from 'express';
import { chatController } from './controllers/chat.controller';
import { productController } from './controllers/product.controller';

const router = Express.Router();

router.post('/api/chat', chatController.SendMessage);

router.get('/api/products/:id/reviews', productController.GetProductReviews);

export default router;
