const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/categories', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, name, slug FROM category ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/products', async (req, res, next) => {
  try {
    const { category } = req.query;
    const params = [];
    let sql = 'SELECT p.id, p.name, p.description, p.sku, p.price, p.image_url, c.name AS category_name, c.slug AS category_slug FROM product p LEFT JOIN category c ON c.id = p.category_id WHERE p.is_active = TRUE';

    if (category) {
      params.push(category);
      sql += ' AND c.slug = $1';
    }

    sql += ' ORDER BY p.name';
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
