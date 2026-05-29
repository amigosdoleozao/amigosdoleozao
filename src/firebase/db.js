import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./config.js";

// Referência para a coleção 'apoiador'
const apoiadorColRef = collection(db, 'apoiador');

// --- CADASTRAR APOIADOR ---
export async function cadastrarApoiador(dados) {
  try {
    const docRef = await addDoc(apoiadorColRef, {
      ...dados,
      createdAt: serverTimestamp()
    });
    console.log("Documento adicionado com sucesso! ID: ", docRef.id);
    return true;
  } catch (err) {
    console.error("Erro ao adicionar documento: ", err.message);
    throw err;
  }
}

// --- LER APOIADORES (Tempo Real) ---
export function ouvirApoiadores(callback) {
  const q = query(apoiadorColRef, orderBy("createdAt"));
  
  return onSnapshot(q, (snapshot) => {
    const apoiadores = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    callback(apoiadores);
  }, (err) => {
    console.error("Erro no listener em tempo real: ", err.message);
  });
}
