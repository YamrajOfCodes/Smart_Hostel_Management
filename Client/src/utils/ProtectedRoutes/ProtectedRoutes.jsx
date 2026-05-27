import {jwtDecode} from "jwt-decode"

export const protectRoute = (router, allowedRole) => {
  const token = localStorage.getItem('login');

  if (!token || token === 'undefined' || token === 'null') {
    router('/');
    return;
  }

  try {
    const decoded = jwtDecode(token);

    // console.log(decoded);

    if (decoded.role !== allowedRole) {
      localStorage.removeItem('login');
      router('/');
      return;
    }
  } catch (error) {
    console.log(error);
    localStorage.removeItem('login');
    router('/');
  }
};