export const getToken = () => localStorage.getItem("token");

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const isTokenExpired = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (_e) {
    return true;
  }
};

export const getDecodedToken = () => {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return null;
  }

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch (_e) {
    localStorage.removeItem("token");
    return null;
  }
};

export const getUserRole = () => {
  const decoded = getDecodedToken();
  return decoded?.role || null;
};

export const getUser = () => {
  const localUser = localStorage.getItem("user");
  if (!localUser) return null;

  try {
    return JSON.parse(localUser);
  } catch (_e) {
    localStorage.removeItem("user");
    return null;
  }
};

export const updateToken = (newToken) => {
  localStorage.setItem("token", newToken);
  window.dispatchEvent(new Event("userUpdated"));
};
