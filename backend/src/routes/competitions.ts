import express from 'express';
import { body, validationResult } from 'express-validator';
import { run, get, all } from '../database';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { Competition } from '../types';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = 'SELECT * FROM competitions WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY date ASC';

    const competitions = await all(query, params);
    res.json(competitions);
  } catch (error) {
    console.error('Error fetching competitions:', error);
    res.status(500).json({ error: 'Failed to fetch competitions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const competition = await get('SELECT * FROM competitions WHERE id = ?', [req.params.id]);
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    res.json(competition);
  } catch (error) {
    console.error('Error fetching competition:', error);
    res.status(500).json({ error: 'Failed to fetch competition' });
  }
});

router.post(
  '/',
  authenticateToken,
  requireAdmin,
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('date').isISO8601(),
    body('location').trim().notEmpty(),
    body('max_participants').isInt({ min: 1 }),
    body('entry_fee').isFloat({ min: 0 }),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, category, date, location, max_participants, entry_fee, image_url } = req.body;

      const result = await run(
        `INSERT INTO competitions (title, description, category, date, location, max_participants, entry_fee, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, category, date, location, max_participants, entry_fee, image_url || null]
      );

      res.status(201).json({
        message: 'Competition created successfully',
        id: (result as any).lastID,
      });
    } catch (error) {
      console.error('Error creating competition:', error);
      res.status(500).json({ error: 'Failed to create competition' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { title, description, category, date, location, max_participants, entry_fee, image_url, status } = req.body;

      await run(
        `UPDATE competitions
         SET title = COALESCE(?, title),
             description = COALESCE(?, description),
             category = COALESCE(?, category),
             date = COALESCE(?, date),
             location = COALESCE(?, location),
             max_participants = COALESCE(?, max_participants),
             entry_fee = COALESCE(?, entry_fee),
             image_url = COALESCE(?, image_url),
             status = COALESCE(?, status)
         WHERE id = ?`,
        [title, description, category, date, location, max_participants, entry_fee, image_url, status, req.params.id]
      );

      res.json({ message: 'Competition updated successfully' });
    } catch (error) {
      console.error('Error updating competition:', error);
      res.status(500).json({ error: 'Failed to update competition' });
    }
  }
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      await run('DELETE FROM competitions WHERE id = ?', [req.params.id]);
      res.json({ message: 'Competition deleted successfully' });
    } catch (error) {
      console.error('Error deleting competition:', error);
      res.status(500).json({ error: 'Failed to delete competition' });
    }
  }
);

export default router;
