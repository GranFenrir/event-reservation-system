import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const dataProvider = {
  getList: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      ...params.filter,
      _page: page,
      _limit: perPage,
      _sort: field,
      _order: order,
    };

    const response = await apiClient.get(`/${resource}`, { params: query });

    return {
      data: response.data,
      total: parseInt(
        response.headers['x-total-count'] || response.data.length
      ),
    };
  },

  getOne: async (resource: string, params: any) => {
    const response = await apiClient.get(`/${resource}/${params.id}`);
    return { data: response.data };
  },

  getMany: async (resource: string, params: any) => {
    const query = {
      id: params.ids,
    };
    const response = await apiClient.get(`/${resource}`, { params: query });
    return { data: response.data };
  },

  getManyReference: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      ...params.filter,
      [params.target]: params.id,
      _page: page,
      _limit: perPage,
      _sort: field,
      _order: order,
    };

    const response = await apiClient.get(`/${resource}`, { params: query });

    return {
      data: response.data,
      total: parseInt(
        response.headers['x-total-count'] || response.data.length
      ),
    };
  },

  create: async (resource: string, params: any) => {
    const response = await apiClient.post(`/${resource}`, params.data);
    return { data: response.data };
  },

  update: async (resource: string, params: any) => {
    const response = await apiClient.put(
      `/${resource}/${params.id}`,
      params.data
    );
    return { data: response.data };
  },

  updateMany: async (resource: string, params: any) => {
    const responses = await Promise.all(
      params.ids.map((id: string) =>
        apiClient.put(`/${resource}/${id}`, params.data)
      )
    );
    return { data: responses.map(response => response.data) };
  },

  delete: async (resource: string, params: any) => {
    await apiClient.delete(`/${resource}/${params.id}`);
    return { data: params.previousData };
  },

  deleteMany: async (resource: string, params: any) => {
    await Promise.all(
      params.ids.map((id: string) => apiClient.delete(`/${resource}/${id}`))
    );
    return { data: params.ids };
  },
};
