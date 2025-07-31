import axios from 'axios';

const API_URLS = [
  'https://manu.my.id/api/kontak',  // Express
  'https://kontak-api.tinagers.com/api/kontak',
  'http://localhost:5000/api/kontak' // Express localhos
];

let API;

// Fungsi cek koneksi ke API secara berurutan
async function getActiveAPI() {
  for (const url of API_URLS) {
    try {
      await axios.get(url, { timeout: 2000 });
      return axios.create({ baseURL: url });
    } catch (err) {
      // lanjut ke url berikutnya
    }
  }
  // fallback ke API lokal jika semua gagal
  return axios.create({ baseURL: API_URLS[0] });
}

// Inisialisasi API secara async
export async function getContacts() {
  if (!API) API = await getActiveAPI();
  return API.get('/');
}

export async function getContact(id) {
  if (!API) API = await getActiveAPI();
  return API.get(`/${id}`);
}

export async function createContact(data) {
  if (!API) API = await getActiveAPI();
  return API.post('/', data);
}

export async function updateContact(id, data) {
  if (!API) API = await getActiveAPI();
  return API.put(`/${id}`, data);
}

export async function deleteContact(id) {
  if (!API) API = await getActiveAPI();
  return API.delete(`/${id}`);
}

export async function uploadAvatar(formData) {
  if (!API) API = await getActiveAPI();
  return API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function updateFavorite(id, isFavorite) {
  if (!API) API = await getActiveAPI();
  return API.patch(`/${id}/favorite`, { isFavorite });
}
