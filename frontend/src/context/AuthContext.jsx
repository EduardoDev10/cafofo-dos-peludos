import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup } from 'firebase/auth';

const AuthContext = createContext();

// Lista de e-mails autorizados para acesso administrativo via Google Sign-In
const ALLOWED_ADMIN_EMAILS = [
  'admin@cafofo.com',
  // Adicione aqui outros e-mails de administradores ou professores para fins de teste
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitora as mudanças de estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const email = currentUser.email || '';
        // Admite qualquer e-mail @cafofo.com ou os contidos na lista de e-mails permitidos
        const isAllowed = email.endsWith('@cafofo.com') || ALLOWED_ADMIN_EMAILS.includes(email);

        if (isAllowed) {
          setUser({
            email: currentUser.email,
            uid: currentUser.uid,
            role: 'admin'
          });
        } else {
          // Desloga imediatamente e nega acesso
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    // Validações
    if (!email || !password) {
      return { success: false, message: 'Todos os campos são obrigatórios!' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Formato de e-mail inválido!' };
    }

    if (password.length < 4) {
      return { success: false, message: 'A senha deve ter pelo menos 4 caracteres!' };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Firebase Login Error: ", error);
      let errMsg = 'Credenciais incorretas ou inválidas. Tente novamente.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errMsg = 'E-mail ou senha incorretos.';
      }
      return { success: false, message: errMsg };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || '';
      const isAllowed = email.endsWith('@cafofo.com') || ALLOWED_ADMIN_EMAILS.includes(email);

      if (isAllowed) {
        return { success: true };
      } else {
        await signOut(auth);
        return { success: false, message: 'Esta conta do Google não tem permissões administrativas.' };
      }
    } catch (error) {
      console.error("Erro no login do Google: ", error);
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'O login com o Google foi cancelado pelo usuário.' };
      }
      return { success: false, message: 'Falha na autenticação do Google. Tente novamente.' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout Error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
