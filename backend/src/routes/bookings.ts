import express from 'express';
import { body, validationResult } from 'express-validator';
import { run, get, all } from '../database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Competition, Booking, BookingWithDetails } from '../types';

const router = express.Router();

router.get('/my-bookings', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const bookings = await all(
      `SELECT b.*, c.title as competition_title, c.date as competition_date, c.location as competition_location
       FROM bookings b
       JOIN competitions c ON b.competition_id = c.id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC`,
      [req.user!.id]
    );

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const bookings = await all(
      `SELECT b.*, c.title as competition_title, c.date as competition_date,
              c.location as competition_location, u.name as user_name, u.email as user_email
       FROM bookings b
       JOIN competitions c ON b.competition_id = c.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.booking_date DESC`
    );

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.post(
  '/',
  authenticateToken,
  [
    body('competition_id').isInt(),
    body('artwork_title').optional().trim(),
    body('artwork_description').optional().trim(),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { competition_id, artwork_title, artwork_description } = req.body;

      const competition = await get('SELECT * FROM competitions WHERE id = ?', [competition_id]) as Competition | undefined;
      if (!competition) {
        return res.status(404).json({ error: 'Competition not found' });
      }

      if (competition.status !== 'open') {
        return res.status(400).json({ error: 'Competition is not open for bookings' });
      }

      if (competition.current_participants >= competition.max_participants) {
        return res.status(400).json({ error: 'Competition is fully booked' });
      }

      const existingBooking = await get(
        'SELECT * FROM bookings WHERE user_id = ? AND competition_id = ?',
        [req.user!.id, competition_id]
      );

      if (existingBooking) {
        return res.status(400).json({ error: 'You have already booked this competition' });
      }

      await run('BEGIN TRANSACTION');

      const result = await run(
        `INSERT INTO bookings (user_id, competition_id, artwork_title, artwork_description)
         VALUES (?, ?, ?, ?)`,
        [req.user!.id, competition_id, artwork_title || null, artwork_description || null]
      );

      await run(
        'UPDATE competitions SET current_participants = current_participants + 1 WHERE id = ?',
        [competition_id]
      );

      await run('COMMIT');

      res.status(201).json({
        message: 'Booking created successfully',
        id: (result as any).lastID,
      });
    } catch (error) {
      await run('ROLLBACK');
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  }
);

router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const booking = await get('SELECT * FROM bookings WHERE id = ?', [req.params.id]) as Booking | undefined;

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user_id !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    await run('BEGIN TRANSACTION');

    await run('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', req.params.id]);

    await run(
      'UPDATE competitions SET current_participants = current_participants - 1 WHERE id = ?',
      [booking.competition_id]
    );

    await run('COMMIT');

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    await run('ROLLBACK');
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;
