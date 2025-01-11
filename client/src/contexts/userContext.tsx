import { useState, createContext, useEffect } from 'react';

export const userContext = createContext("");

export default function UserContextProvider({children}) {
  const [data, setData] = useState({auth: false, user: null});

  const fetchData = () => {
    try {
        fetch(`${import.meta.env.VITE_SERVER_API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        })
        .then(response => response.json()
        .then(data => (setData({auth: true, user: data})))
        )
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  // Fetch data on page load
  useEffect(() => {
      fetchData();
  }, []);

  return (
    <userContext.Provider value={{data, setData}}>
        {children}
    </userContext.Provider>
  )
}
