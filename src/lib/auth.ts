export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  role: 'merchant' | 'admin';
  subRole?: string;
  status: 'active' | 'suspended';
  codBalanceNpr: number;
  totalShipments?: number;
  createdAt: string;
}

const USERS_STORAGE_KEY = 'double11_users_v3';
const CURRENT_USER_KEY = 'double11_current_user_v3';

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Soben',
    email: 'soben@double11.com',
    company: 'Double 11 Logistics Command HQ',
    phone: '+977 1 4411000',
    role: 'admin',
    subRole: 'Command HQ / Super Admin',
    status: 'active',
    codBalanceNpr: 0,
    totalShipments: 0,
    createdAt: '2026-01-01',
  },
];

export function getUsers(): User[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    // Purge legacy storage versions
    localStorage.removeItem('double11_users_v2');
    localStorage.removeItem('double11_users');
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    localStorage.removeItem('double11_current_user_v2');
    localStorage.removeItem('double11_current_user');
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loginUser(email: string, password?: string, subRole?: string): { success: boolean; user?: User; error?: string } {
  if (!email.trim()) {
    return { success: false, error: 'Please enter your registered email address.' };
  }

  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return {
      success: false,
      error: 'No account found with this email. Please check your spelling or register a new Merchant account.',
    };
  }

  if (user.status === 'suspended') {
    return {
      success: false,
      error: 'This merchant account has been suspended by the Admin. Please contact Double 11 support.',
    };
  }

  if (subRole) {
    user.subRole = subRole;
  } else if (!user.subRole) {
    user.subRole = user.role === 'admin' ? 'Command HQ / Super Admin' : 'Merchant Consignor / Shipper';
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('auth-change'));
  }

  return { success: true, user };
}

export function updateUserSubRole(subRole: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getCurrentUser();
  if (!current) return false;

  current.subRole = subRole;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));

  const users = getUsers();
  const idx = users.findIndex(u => u.id === current.id);
  if (idx !== -1) {
    users[idx].subRole = subRole;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  window.dispatchEvent(new Event('auth-change'));
  return true;
}

export function signupUser(params: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  role?: 'merchant' | 'admin';
  password?: string;
}): { success: boolean; user?: User; error?: string } {
  if (!params.name.trim()) {
    return { success: false, error: 'Full name or company representative name is required.' };
  }
  if (!params.email.trim() || !params.email.includes('@')) {
    return { success: false, error: 'A valid email address is required.' };
  }

  const users = getUsers();
  const normalizedEmail = params.email.trim().toLowerCase();
  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (existing) {
    return {
      success: false,
      error: 'An account with this email already exists. Please Sign In instead.',
    };
  }

  const newUser: User = {
    id: `usr-merch-${Date.now()}`,
    name: params.name.trim(),
    email: normalizedEmail,
    company: params.company?.trim() || 'Verified Nepal Merchant',
    phone: params.phone?.trim() || '+977 98000 00000',
    role: params.role || 'merchant',
    status: 'active',
    codBalanceNpr: 0,
    totalShipments: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };

  const updatedUsers = [...users, newUser];

  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    window.dispatchEvent(new Event('auth-change'));
  }

  return { success: true, user: newUser };
}

export function updateMerchantStatus(id: string, status: 'active' | 'suspended'): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;

  users[index].status = status;
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    // If updating current user, refresh current user state too
    const current = getCurrentUser();
    if (current && current.id === id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[index]));
    }
    window.dispatchEvent(new Event('auth-change'));
  }
  return true;
}

export function recordMerchantRemittance(id: string, amountToRemit: number): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;

  const currentBal = users[index].codBalanceNpr || 0;
  users[index].codBalanceNpr = Math.max(0, currentBal - amountToRemit);

  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    const current = getCurrentUser();
    if (current && current.id === id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[index]));
    }
    window.dispatchEvent(new Event('auth-change'));
  }
  return true;
}

export function deleteMerchant(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('auth-change'));
  }
  return true;
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new Event('auth-change'));
  }
}

export function findUserByEmail(email: string): User | undefined {
  if (!email || !email.trim()) return undefined;
  const normalized = email.trim().toLowerCase();
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === normalized);
}

export interface PortalConfig {
  role: 'admin' | 'merchant';
  portalPath: '/admin' | '/merchant';
  portalName: string;
  badgeLabel: string;
  description: string;
}

export function getMatchingPortal(userOrRole: User | 'merchant' | 'admin'): PortalConfig {
  const role = typeof userOrRole === 'string' ? userOrRole : userOrRole.role;
  if (role === 'admin') {
    return {
      role: 'admin',
      portalPath: '/admin',
      portalName: 'Admin Control Tower',
      badgeLabel: 'ADMIN CONSOLE',
      description: 'Central operations, telemetry, hub management & fleet dispatch control',
    };
  }
  return {
    role: 'merchant',
    portalPath: '/merchant',
    portalName: 'Merchant Portal',
    badgeLabel: 'MERCHANT HUB',
    description: 'COD remittance ledger, tracking, cargo manifest & consignment dispatch',
  };
}

export function resolveMatchedRedirect(user: User, redirectParam?: string | null): string {
  const matched = getMatchingPortal(user);
  if (!redirectParam || redirectParam.startsWith('/login')) {
    return matched.portalPath;
  }

  // Must be relative root path
  if (!redirectParam.startsWith('/')) {
    return matched.portalPath;
  }

  if (user.role === 'admin') {
    // Admins can navigate to any section except falling into raw merchant redirect
    if (redirectParam.startsWith('/merchant')) {
      return '/admin';
    }
    return redirectParam;
  } else {
    // Merchants cannot access /admin
    if (redirectParam.startsWith('/admin')) {
      return '/merchant';
    }
    return redirectParam;
  }
}

