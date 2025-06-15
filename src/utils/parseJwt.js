function parseJwt(token) {
  if (!token) return null;

  const base64Url = token.split('.')[1]; // phần payload
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  try {
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Token giải mã sai định dạng:", e);
    return null;
  }
}
export default parseJwt;