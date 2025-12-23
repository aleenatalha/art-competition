export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Competition {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  max_participants: number;
  current_participants: number;
  entry_fee: number;
  image_url?: string;
  status: 'open' | 'closed' | 'completed';
  created_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  competition_id: number;
  booking_date: string;
  status: 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  artwork_title?: string;
  artwork_description?: string;
}

export interface BookingWithDetails extends Booking {
  competition_title: string;
  competition_date: string;
  competition_location: string;
  user_name: string;
  user_email: string;
}
