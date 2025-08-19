// context/AuthContext.tsx
import { createContext, useContext } from 'react';

const AuthContext = createContext<{
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}>(null!);