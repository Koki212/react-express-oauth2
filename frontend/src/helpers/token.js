export function isTokenValid() {
  let accessToken = localStorage.getItem("access_token") || "";
  const tokenParts = accessToken.split(".");
  if (tokenParts.length === 3) {
    const tokenData = JSON.parse(atob(tokenParts[1]));
    if (tokenData.exp >= Date.now()) {
      return true;
    }
  }
  return false;
}
