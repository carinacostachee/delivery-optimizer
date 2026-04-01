import * as React from "react";
import { api } from "../api/routes";
import {
  onAuthStateChanged,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../config/firebase";
//this is the data we need when the authentication is done
interface AuthContextType {
  user: User | null;
  token: string | null;
  userProfile: any | null;

  register(name: string, email: string, password: string): void;
  login(email: string, password: string): void;
  logInWithGoogle(): Promise<void>;
  logout(): void;
  isAuthenticated: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);

  const [token, setToken] = React.useState<string | null>(null);
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        //if the user is logged in then we store their info and get the JWT token
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        setToken(token);
      } else {
        //here the user is logged out so we set everything back to the initial state
        setUser(null);
        setToken(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function register(name: string, email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await api.post("/users/signup", {
      firebase_uid: result.user.uid,
      email: email,
      name: name,
    });
  }

  async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    return await signOut(auth);
  }

  async function logInWithGoogle() {
    await signInWithPopup(auth, provider);
  }

  const isAuthenticated = !!user;

  const value = {
    user,
    token,
    userProfile,
    register,
    login,
    logout,
    logInWithGoogle,
    isAuthenticated,
  };
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="bg-slate-50 w-full h-full flex flex-col justy-center items-center"></div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("the hook useAuth must be used within the AuthProvider");
  }
  return context;
};
