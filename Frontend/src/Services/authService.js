const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const register = async (data) => {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const uploadSignedPdf = async (file, metadata) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', metadata.signature);
  formData.append('position', JSON.stringify(metadata.position));
  formData.append('page', metadata.page.toString());
  formData.append('signedAt', metadata.signedAt);

  const res = await fetch(`${API}/upload-signed-pdf`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Upload failed');
  }

  return res.json();
};
