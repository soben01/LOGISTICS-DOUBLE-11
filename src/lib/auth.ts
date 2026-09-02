export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  role: 'merchant' | 'admin';
  createdAt: string;
}

const USERS_STORAGE_KEY = 'double11_users_v1';
const CURRENT_USER_KEY = 'double11_current_user_v1';

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Soben',
    email: 'soben@double11.com',
    company: 'Double 11 Global Logistics Ltd',
    phone: '+852 2891 4401',
    role: 'admin',
    createdAt: '2026-01-01',
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    email: 'elena@pacificrobotics.com',
    company: 'Pacific Robotics Corp',
    phone: '+1 310 555 0192',
    role: 'merchant',
    createdAt: '2026-03-15',
  },
  {
    id: 'usr-3',
    name: 'David Wong',
    email: 'merchant@apextech.com',
    company: 'Apex Silicon Global',
    phone: '+852 2891 9900',
    role: 'merchant',
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
    // For a smooth startup experience, if they type an email that doesn't exist, we can prompt them to sign up
    return {
      success: false,
      error: 'No merchant account found with this email. Please switch to the Sign Up tab to create your account.',
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
  password?: string;
}): { success: boolean; user?: User; error?: string } {
  if (!params.name.trim()) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!params.email.trim() || !params.email.includes('@')) {
    return { success: false, error: 'A valid business email is required.' };
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
    id: `usr-${Date.now()}`,
    name: params.name.trim(),
    email: normalizedEmail,
    company: params.company?.trim() || 'Independent Merchant',
    phone: params.phone?.trim() || '+1 800 555 0100',
    role: 'merchant',
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

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new Event('auth-change'));
  }
}
