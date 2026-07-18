// ============================================
// LiveLocal - Mock User Data
// ============================================
import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Ahmad Tourist',
    email: 'tourist@livelocal.my',
    password: 'password123',
    role: 'tourist',
    bio: 'Exploring the hidden gems of Malaysia 🇲🇾',
    location: 'Kuala Lumpur',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'user-002',
    name: 'FoodieAmy',
    email: 'influencer@livelocal.my',
    password: 'password123',
    role: 'influencer',
    bio: 'Malaysian food content creator 🍜 200K followers on TikTok',
    location: 'Pulau Pinang',
    socialMedia: {
      tiktok: '@foodieamy',
      instagram: '@foodieamy.my',
    },
    influencerStatus: 'approved',
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'user-003',
    name: 'Admin LiveLocal',
    email: 'admin@livelocal.my',
    password: 'admin123',
    role: 'admin',
    bio: 'LiveLocal Platform Administrator',
    createdAt: '2025-12-01T00:00:00Z',
  },
  {
    id: 'user-004',
    name: 'MakanKingMY',
    email: 'makanking@livelocal.my',
    password: 'password123',
    role: 'influencer',
    bio: 'I eat so you don\'t have to guess 🔥 150K TikTok',
    location: 'Johor',
    socialMedia: {
      tiktok: '@makankingmy',
      instagram: '@makankingmy',
    },
    influencerStatus: 'approved',
    createdAt: '2026-03-10T12:00:00Z',
  },
  {
    id: 'user-005',
    name: 'Sarah Chen',
    email: 'sarah@email.com',
    password: 'password123',
    role: 'tourist',
    bio: 'Travel enthusiast from Singapore 🇸🇬',
    location: 'Singapore',
    createdAt: '2026-05-20T14:00:00Z',
  },
];
