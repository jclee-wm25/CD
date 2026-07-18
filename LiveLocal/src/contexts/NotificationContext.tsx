// ============================================
// LiveLocal - Notification Context
// ============================================
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppNotification } from '../types';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    userId: 'user-001',
    type: 'new_discount',
    title: '🎉 New Discount Near You!',
    message: 'FoodieAmy just posted a 10% discount at Nasi Kandar Line Clear in Penang!',
    relatedId: 'rest-001',
    isRead: false,
    createdAt: '2026-07-15T14:00:00Z',
  },
  {
    id: 'notif-002',
    userId: 'user-001',
    type: 'new_trending',
    title: '🔥 Trending Restaurant',
    message: 'Selera Kampung Nasi Lemak in JB is trending with 5 new reviews this week!',
    relatedId: 'rest-004',
    isRead: false,
    createdAt: '2026-07-14T10:00:00Z',
  },
  {
    id: 'notif-003',
    userId: 'user-001',
    type: 'spot_approved',
    title: '✅ Your Spot Was Approved!',
    message: 'Kedai Kopi Hainan has been approved and is now live on LiveLocal!',
    relatedId: 'spot-001',
    isRead: true,
    createdAt: '2026-07-10T08:00:00Z',
  },
  {
    id: 'notif-004',
    userId: 'user-003',
    type: 'review_flagged',
    title: '⚠️ Review Flagged',
    message: 'A review on Indie Brew Café has been flagged for inappropriate content.',
    relatedId: 'spot-006',
    isRead: false,
    createdAt: '2026-07-13T16:00:00Z',
  },
  {
    id: 'notif-005',
    userId: 'user-002',
    type: 'influencer_approved',
    title: '🎊 Welcome, Partner!',
    message: 'Your influencer application has been approved! You can now add restaurant listings.',
    isRead: true,
    createdAt: '2026-07-01T12:00:00Z',
  },
];

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  getNotificationsForUser: (userId: string) => AppNotification[];
  markAsRead: (notifId: string) => void;
  markAllAsRead: (userId: string) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const getNotificationsForUser = (userId: string) => {
    return notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = (userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, isRead: true } : n))
    );
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        getNotificationsForUser,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
