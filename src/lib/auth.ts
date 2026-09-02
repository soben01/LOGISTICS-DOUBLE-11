export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  role: 'merchant' | 'admin';
  status: 'active' | 'suspended';
  codBalanceNpr: number;
  totalShipments?: number;
  createdAt: string;
}

const USERS_STORAGE_KEY = 'double11_users_v2';
const CURRENT_USER_KEY = 'double11_current_user_v2';

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Soben',
    email: 'soben@double11.com',
    company: 'Double 11 Logistics Command HQ',
    phone: '+977 1 4411000',
    role: 'admin',
    status: 'active',
    codBalanceNpr: 0,
    totalShipments: 128,
    createdAt: '2026-01-01',
  },
  {
    id: 'usr-merch-1',
    name: 'Pradeep Gurung',
    email: 'pradeep@himalayantech.np',
    company: 'Himalayan Tech Nepal Pvt Ltd',
    phone: '+977 98012 34567',
    role: 'merchant',
    status: 'active',
    codBalanceNpr: 45200,
    totalShipments: 14,
    createdAt: '2026-03-15',
  },
  {
    id: 'usr-merch-2',
    name: 'Elena Rostova',
    email: 'elena@pacificrobotics.com',
    company: 'Pacific Robotics Nepal',
    phone: '+977 98460 11223',
    role: 'merchant',
    status: 'active',
    codBalanceNpr: 18500,
    totalShipments: 8,
    createdAt: '2026-04-10',
  },
  {
    id: 'usr-merch-3',
    name: 'Sunita Sharma',
    email: 'sunita@koshitrade.np',
    company: 'Koshi Agro-Industrial Trade',
    phone: '+977 98112 88990',
    role: 'merchant',
    status: 'active',
    codBalanceNpr: 68400,
    totalShipments: 22,
    createdAt: '2026-05-20',
  },
];

export function getUsers(): User[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
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
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loginUser(email: string, password?: string): { success: boolean; user?: User; error?: string } {
  if (!email.trim()) {
    return { success: false, error: 'Please enter your registered email address.' };
  }

  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return {
      success: false,
      error: 'No account found with this email. Please register as a Merchant or use demo credentials.',
    };
  }

  if (user.status === 'suspended') {
    return {
      success: false,
      error: 'This merchant account has been suspended by the Admin. Please contact Double 11 support.',
    };
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('auth-change'));
  }

  return { success: true, user };
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
