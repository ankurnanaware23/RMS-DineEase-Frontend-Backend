import { useState } from 'react';

// export const useAuth = () => {
//   // In a real application, you would fetch this from a secure source (e.g., local storage, a cookie, or an API call)
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return { isAuthenticated, setIsAuthenticated };
// };


export const useAuth = () => {
  const accessToken = localStorage.getItem("accessToken");

  return {
    isAuthenticated: !!accessToken,
  };
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
