// src/services/auth.js

const apiUrl = import.meta.env.VITE_API_URL;

export const login = async (username, password) => {
  console.log(apiUrl)
  const response = await fetch(`${apiUrl}/lms/auth/token`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }
  return await response.json();
};
