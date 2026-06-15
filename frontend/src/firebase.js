import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBcSHZ9B5iD4iHBP7sv0dPqZtCfsMV_kuk",
  authDomain: "cafofo-dos-peludos.firebaseapp.com",
  projectId: "cafofo-dos-peludos",
  storageBucket: "cafofo-dos-peludos.firebasestorage.app",
  messagingSenderId: "919324901035",
  appId: "1:919324901035:web:b5dc5972bb3c7e326501ee"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa a Autenticação do Firebase (Login do Administrador)
export const auth = getAuth(app);
