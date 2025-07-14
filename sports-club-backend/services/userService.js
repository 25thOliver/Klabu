const API = import.meta.env.VITE_API_URL;

export const getProfile = async (token) => {
  return axios.get(`${API}/user/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateProfile = async (data, token) => {
  return axios.put(`${API}/user/me`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
