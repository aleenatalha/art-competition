import bcrypt from 'bcryptjs';
import { initDatabase, run } from './database';

const seedDatabase = async () => {
  try {
    await initDatabase();
    console.log('Database initialized');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await run(
      'INSERT OR IGNORE INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
      [1, 'admin@artcompetition.com', adminPassword, 'Admin User', 'admin']
    );

    await run(
      'INSERT OR IGNORE INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
      [2, 'user@example.com', userPassword, 'John Doe', 'user']
    );

    console.log('Users created:');
    console.log('Admin - email: admin@artcompetition.com, password: admin123');
    console.log('User - email: user@example.com, password: user123');

    const competitions = [
      {
        title: 'Annual Painting Exhibition 2025',
        description: 'Showcase your best paintings in this prestigious annual exhibition. Open to all painting styles including oil, acrylic, watercolor, and mixed media.',
        category: 'Painting',
        date: '2025-06-15',
        location: 'Metropolitan Art Gallery, New York',
        max_participants: 100,
        entry_fee: 50.00,
        image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
      },
      {
        title: 'Modern Sculpture Challenge',
        description: 'Push the boundaries of contemporary sculpture. All materials welcome: metal, wood, clay, found objects, and innovative new materials.',
        category: 'Sculpture',
        date: '2025-07-20',
        location: 'City Arts Center, Los Angeles',
        max_participants: 50,
        entry_fee: 75.00,
        image_url: 'https://images.unsplash.com/photo-1551732998-9fa5c427e33e?w=800',
      },
      {
        title: 'Nature Photography Contest',
        description: 'Capture the beauty of nature through your lens. Categories include landscapes, wildlife, macro, and environmental themes.',
        category: 'Photography',
        date: '2025-08-10',
        location: 'National Photography Museum, Chicago',
        max_participants: 200,
        entry_fee: 35.00,
        image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
      },
      {
        title: 'Digital Art Showcase 2025',
        description: 'The future of art is digital. Submit your digital paintings, 3D art, animations, or generative art pieces for this cutting-edge exhibition.',
        category: 'Digital Art',
        date: '2025-09-05',
        location: 'Tech & Art Hub, San Francisco',
        max_participants: 150,
        entry_fee: 40.00,
        image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      },
      {
        title: 'Mixed Media Innovation Award',
        description: 'Break the rules and combine multiple art forms. Judges will be looking for creativity, innovation, and technical excellence in mixed media work.',
        category: 'Mixed Media',
        date: '2025-10-15',
        location: 'Contemporary Arts Institute, Miami',
        max_participants: 75,
        entry_fee: 60.00,
        image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      },
      {
        title: 'Portrait Masters Competition',
        description: 'Celebrate the art of portraiture. Traditional and contemporary approaches welcome. Includes categories for realism and abstraction.',
        category: 'Painting',
        date: '2025-11-01',
        location: 'National Portrait Gallery, Washington DC',
        max_participants: 80,
        entry_fee: 55.00,
        image_url: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800',
      },
    ];

    for (const comp of competitions) {
      await run(
        `INSERT INTO competitions (title, description, category, date, location, max_participants, entry_fee, image_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          comp.title,
          comp.description,
          comp.category,
          comp.date,
          comp.location,
          comp.max_participants,
          comp.entry_fee,
          comp.image_url,
          'open',
        ]
      );
    }

    console.log(`Seeded ${competitions.length} competitions`);
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
