    // src/services/logout.js
  const apiUrl = import.meta.env.VITE_API_URL;
export const introspect = async (token) => {
  const response = await fetch(`${apiUrl}/lms/auth/introspect`, {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('failed');
  }
  return await response.json();
};


    // src/services/logout.js
export const refresh = async (token) => {
  const response = await fetch(`${apiUrl}/lms/auth/refresh`, {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('failed');
  }
  return await response.json();
};
