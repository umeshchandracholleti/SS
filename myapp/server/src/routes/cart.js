const express = require('express');
const db = require('../db');

const router = express.Router();

async function getCart(cartId) {
  const cartResult = await db.query('SELECT id, status FROM cart WHERE id = $1', [cartId]);
  if (!cartResult.rows.length) {
    return null;
  }

  const itemsResult = await db.query(
    `SELECT ci.id, ci.quantity, ci.unit_price, p.id AS product_id, p.name, p.description, p.image_url
     FROM cart_item ci
     JOIN product p ON p.id = ci.product_id
     WHERE ci.cart_id = $1
     ORDER BY ci.created_at`,
    [cartId]
  );

  return {
    id: cartResult.rows[0].id,
    status: cartResult.rows[0].status,
    items: itemsResult.rows
  };
}

router.post('/cart/guest', async (req, res, next) => {
  try {
    const { seed } = req.query;
    const cartResult = await db.query('INSERT INTO cart DEFAULT VALUES RETURNING id');
    const cartId = cartResult.rows[0].id;

    if (seed === 'true') {
      const products = await db.query('SELECT id, price FROM product ORDER BY name LIMIT 3');
      for (const product of products.rows) {
        await db.query(
          'INSERT INTO cart_item (cart_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
          [cartId, product.id, 1, product.price]
        );
      }
    }

    const cart = await getCart(cartId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.get('/cart/:id', async (req, res, next) => {
  try {
    const cart = await getCart(req.params.id);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.post('/cart/:id/items', async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'productId and quantity required' });
    }

    const productResult = await db.query('SELECT price FROM product WHERE id = $1', [productId]);
    if (!productResult.rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existing = await db.query(
      'SELECT id, quantity FROM cart_item WHERE cart_id = $1 AND product_id = $2',
      [req.params.id, productId]
    );

    if (existing.rows.length) {
      const nextQty = existing.rows[0].quantity + Number(quantity);
      await db.query('UPDATE cart_item SET quantity = $1 WHERE id = $2', [nextQty, existing.rows[0].id]);
    } else {
      await db.query(
        'INSERT INTO cart_item (cart_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [req.params.id, productId, Number(quantity), productResult.rows[0].price]
      );
    }

    const cart = await getCart(req.params.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.patch('/cart/:id/items/:itemId', async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || Number(quantity) < 1) {
      return res.status(400).json({ error: 'quantity must be >= 1' });
    }

    await db.query(
      'UPDATE cart_item SET quantity = $1 WHERE id = $2 AND cart_id = $3',
      [Number(quantity), req.params.itemId, req.params.id]
    );

    const cart = await getCart(req.params.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.delete('/cart/:id/items/:itemId', async (req, res, next) => {
  try {
    await db.query('DELETE FROM cart_item WHERE id = $1 AND cart_id = $2', [req.params.itemId, req.params.id]);
    const cart = await getCart(req.params.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
