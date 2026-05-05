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
    disabled: true,
  },
  {
    label: 'Inventory',
    path: '/inventory',
    icon: PackageCheck,
    disabled: true,
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: LineChart,
    disabled: true,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    disabled: true,
  },
]

export const FALLBACK_PAGE_META = {
  eyebrow: 'Workspace',
  title: 'Castle Admin',
  description: 'Stay on top of operations with a clear and reliable control surface.',
}

export const BRAND_ICON = Crown
