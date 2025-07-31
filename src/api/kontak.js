import axios from 'axios';

const API_URLS = [
  'https://manu.my.id/api/kontak',  // Express
  'https://kontak-api.tinagers.com/api/kontak',
  'http://localhost:5000/api/kontak' // Express localhost
];

let API;

// Fungsi cek koneksi ke API secara berurutan
async function getActiveAPI() {
  console.log('🔍 Testing API connections...');
  
  for (const url of API_URLS) {
    try {
      console.log(`⏳ Trying: ${url}`);
      await axios.get(url, { timeout: 3000 });
      console.log(`✅ SUCCESS: ${url}`);
      return axios.create({ baseURL: url });
    } catch (err) {
      console.log(`❌ FAILED: ${url}`, err.message);
      // lanjut ke url berikutnya
    }
  }
  // fallback ke API pertama jika semua gagal
  console.log(`🔄 Using fallback API: ${API_URLS[0]}`);
  return axios.create({ baseURL: API_URLS[0] });
}

// Transform response untuk menyesuaikan format
function transformContact(contact) {
  return {
    _id: contact._id,
    nama: contact.nama || '',
    email: contact.email || '',
    no_hp: contact.no_hp || '',
    alamat: contact.alamat || '',
    grup: contact.grup || '',
    favorite: contact.isfavorite || contact.favorite || false, // Handle both formats
    avatar: contact.avatar || '',
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt
  };
}

// Inisialisasi API secara async
export async function getContacts() {
  try {
    if (!API) API = await getActiveAPI();
    console.log('📡 Fetching contacts...');
    
    const response = await API.get('/');
    console.log('✅ Raw API Response:', response.data);
    
    // Langsung return response, biar ContactPage yang handle
    return response;
    
  } catch (error) {
    console.error('❌ getContacts error:', error);
    throw error;
  }
}

export async function getContact(id) {
  try {
    if (!API) API = await getActiveAPI();
    const response = await API.get(`/${id}`);
    
    if (response.data.success && response.data.data) {
      return {
        ...response,
        data: transformContact(response.data.data)
      };
    }
    
    return response;
  } catch (error) {
    console.error('❌ getContact error:', error);
    throw error;
  }
}

export async function createContact(data) {
  try {
    if (!API) API = await getActiveAPI();
    console.log('📡 Creating contact:', data);
    
    const response = await API.post('/', data);
    console.log('✅ Contact created:', response.data);
    
    if (response.data.success && response.data.data) {
      return {
        ...response,
        data: transformContact(response.data.data)
      };
    }
    
    return response;
  } catch (error) {
    console.error('❌ createContact error:', error);
    throw error;
  }
}

export async function updateContact(id, data) {
  try {
    if (!API) API = await getActiveAPI();
    console.log('📡 Updating contact:', id, data);
    
    const response = await API.put(`/${id}`, data);
    console.log('✅ Contact updated:', response.data);
    
    if (response.data.success && response.data.data) {
      return {
        ...response,
        data: transformContact(response.data.data)
      };
    }
    
    return response;
  } catch (error) {
    console.error('❌ updateContact error:', error);
    throw error;
  }
}

export async function deleteContact(id) {
  try {
    if (!API) API = await getActiveAPI();
    console.log('📡 Deleting contact:', id);
    
    const response = await API.delete(`/${id}`);
    console.log('✅ Contact deleted:', response.data);
    
    return response;
  } catch (error) {
    console.error('❌ deleteContact error:', error);
    throw error;
  }
}

export async function uploadAvatar(formData) {
  try {
    if (!API) API = await getActiveAPI();
    console.log('📡 Uploading avatar...');
    
    const response = await API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('✅ Avatar uploaded:', response.data);
    
    return response;
  } catch (error) {
    console.error('❌ uploadAvatar error:', error);
    throw error;
  }
}

export async function updateFavorite(id, isFavorite) {
  try {
    if (!API) API = await getActiveAPI();
    console.log('📡 Updating favorite:', id, isFavorite);
    
    // Format data sesuai API backend
    const payload = { isfavorite: isFavorite }; // Backend uses 'isfavorite'
    
    const response = await API.patch(`/${id}/favorite`, payload);
    console.log('✅ Favorite updated:', response.data);
    
    if (response.data.success && response.data.data) {
      return {
        ...response,
        data: transformContact(response.data.data)
      };
    }
    
    return response;
  } catch (error) {
    console.error('❌ updateFavorite error:', error);
    throw error;
  }
}
