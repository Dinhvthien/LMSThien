// src/services/logout.js
const apiUrl = import.meta.env.VITE_API_URL;
export const logout = async (token) => {
  const response = await fetch(`${apiUrl}/lms/auth/logout`, {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
  return await response.json();
};
