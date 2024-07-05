// UserContext.js
import React, { createContext, useState, useEffect } from "react";
import { profileUserApi } from "../../api/UserAPI";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const res = await profileUserApi();
      setUser(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
