import {
  CalendarDays,
  Crown,
  LayoutDashboard,
  LineChart,
  PackageCheck,
  Settings,
  UsersRound,
} from 'lucide-react'

export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    eyebrow: 'Overview',
    title: 'Admin Dashboard',
    description: 'Monitor revenue, occupancy, and the day-to-day pulse.',
  },
  {
    label: 'Bookings',
    path: '/bookings',
    icon: CalendarDays,
    eyebrow: 'Reservations',
    title: 'Bookings',
    description: 'Track arrivals, payment status, and upcoming stays in one place.',
  },
  {
    label: 'Customers',
    path: '/customers',
    icon: UsersRound,
    eyebrow: 'Guests',
    title: 'Customers',
    description: 'See guest activity, booking value, and customer health at a glance.',
  },
  {
    label: 'Inventory',
    path: '/inventory',
    icon: PackageCheck,
    eyebrow: 'Rooms',
    title: 'Inventory',
    description: 'Track room availability, occupancy, and live inventory pressure.',
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: LineChart,
    eyebrow: 'Analytics',
    title: 'Reports',
    description: 'Review performance trends, provider revenue, and customer insights.',
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    eyebrow: 'Preferences',
    title: 'Settings',
    description: 'Manage admin profile details and operating preferences.',
  },
]

export const FALLBACK_PAGE_META = {
  eyebrow: 'Workspace',
  title: 'Castle Admin',
  description: 'Stay on top of operations with a clear and reliable control surface.',
}

export const BRAND_ICON = Crown
