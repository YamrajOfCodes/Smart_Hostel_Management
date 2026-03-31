import jwt_decode from 'jwt-decode';


export const protectRoute = (router, allowedRole) => {
  const token = localStorage.getItem('login');

  if (!token || token === 'undefined' || token === 'null') {
    localStorage.removeItem('login');
    router.replace('/');
    return;
  }

  try {
    const decoded = jwt_decode<DecodedToken>(token);

    if (isTokenExpired || decoded.role !== allowedRole) {
      localStorage.removeItem('login');
      router.replace('/');
      return;
    }
  } catch (error) {
    console.log(error);
    localStorage.removeItem('login');
    router.replace('/');
  }
};