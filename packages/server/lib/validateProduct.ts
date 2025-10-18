import type { Request, Response } from 'express';

/**
 * Utility function to validate product ID.
 * Returns number if valid, otherwise sends a 400 response and returns null.
 */

export function validateProductId(req: Request, res: Response): number | null {
    const id = req.params.id;
    const productId = Number(id);

    if (!id) {
        res.status(400).json({ error: 'Product ID is required' });
        return null;
    }

    if (isNaN(productId) || productId <= 0) {
        res.status(400).json({ error: 'Product ID must be a positive number' });
        return null;
    }

    return productId;
}
