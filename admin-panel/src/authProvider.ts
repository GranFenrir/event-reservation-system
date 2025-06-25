import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

export const authProvider = {
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: username,
        password,
      });

      const { token, user } = response.data;

      if (user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));

      return Promise.resolve();
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return Promise.resolve();
  },

  checkAuth: () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');

    if (token && user) {
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        return Promise.resolve();
      }
    }

    return Promise.reject();
  },

  checkError: (error: any) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getIdentity: () => {
    try {
      const user = localStorage.getItem('adminUser');
      if (user) {
        const userData = JSON.parse(user);
        return Promise.resolve({
          id: userData.id,
          fullName: userData.name,
          avatar: userData.avatar,
        });
      }
    } catch {
      // Ignore parsing errors
    }
    return Promise.reject();
  },

  getPermissions: () => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      const userData = JSON.parse(user);
      return Promise.resolve(userData.role);
    }
    return Promise.reject();
  },
};
