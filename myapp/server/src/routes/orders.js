const express = require('express');
const crypto = require('crypto');
const db = require('../db');

const router = express.Router();

function generateOrderNumber() {
  const stamp = Date.now().toString().slice(-8);
  const rand = crypto.randomInt(1000, 9999);
  return `ORD-${stamp}-${rand}`;
}

router.post('/orders', async (req, res, next) => {
  try {
    const {
      cartId,
      customerName,
      email,
      phone,
      addressLine,
      city,
      state,
      pincode,
      paymentMethod,
      discount = 0
    } = req.body;

    if (!cartId || !customerName || !email || !phone || !addressLine || !city || !state || !pincode || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const itemsResult = await db.query(
      `SELECT ci.quantity, ci.unit_price
       FROM cart_item ci
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (!itemsResult.rows.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const subtotal = itemsResult.rows.reduce(
      (sum, item) => sum + Number(item.unit_price) * Number(item.quantity),
      0
    );
    const tax = subtotal * 0.18;
    const shipping = subtotal > 5000 ? 0 : 100;
    const total = subtotal + tax + shipping - Number(discount || 0);

    const orderNumber = generateOrderNumber();
    const orderResult = await db.query(
      `INSERT INTO customer_order
        (order_number, cart_id, customer_name, email, phone, address_line, city, state, pincode, payment_method, subtotal, tax, shipping, discount, total)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING id, order_number, total`,
      [
        orderNumber,
        cartId,
        customerName,
        email,
        phone,
        addressLine,
        city,
        state,
        pincode,
        paymentMethod,
        subtotal,
        tax,
        shipping,
        Number(discount || 0),
        total
      ]
    );

    const orderId = orderResult.rows[0].id;
    await db.query(
      'INSERT INTO order_tracking_event (order_id, status, note) VALUES ($1, $2, $3)',
      [orderId, 'confirmed', 'Order confirmed']
    );

    await db.query('UPDATE cart SET status = $1, updated_at = NOW() WHERE id = $2', ['converted', cartId]);

    res.json({
      orderId: orderId,
      orderNumber: orderResult.rows[0].order_number,
      total: orderResult.rows[0].total
    });
  } catch (err) {
    next(err);
  }
});

router.get('/orders/:orderNumber/tracking', async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const orderResult = await db.query(
      `SELECT id, order_number, customer_name, address_line, city, state, pincode, created_at, status
       FROM customer_order
       WHERE order_number = $1`,
      [orderNumber]
    );

    if (!orderResult.rows.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];
    const eventsResult = await db.query(
      `SELECT status, note, occurred_at
       FROM order_tracking_event
       WHERE order_id = $1
       ORDER BY occurred_at`,
      [order.id]
    );

    res.json({
      orderNumber: order.order_number,
      status: order.status,
      createdAt: order.created_at,
      address: `${order.address_line}, ${order.city}, ${order.state} ${order.pincode}`,
      events: eventsResult.rows
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
