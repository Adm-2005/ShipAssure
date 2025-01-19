import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  user: any;
  isLoggedIn: boolean;
  setUser: (userData: any) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Initialize state from localStorage
  const [state, setState] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser
      ? {
          user: JSON.parse(savedUser),
          isLoggedIn: true
        }
      : {
          user: null,
          isLoggedIn: false
        };
  });

  // Update localStorage whenever the state changes
  useEffect(() => {
    if (state.isLoggedIn) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state]);

  const setUser = (userData: any) => {
    setState({
      user: userData,
      isLoggedIn: true
    });
  };

  const logout = () => {
    setState({
      user: null,
      isLoggedIn: false
    });
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        setUser,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
