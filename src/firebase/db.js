import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, getDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./config.js";

// Referência para a coleção 'apoiador'
const apoiadorColRef = collection(db, 'apoiador');
const usersColRef = collection(db, 'users');
const reunioesColRef = collection(db, 'reuniao');

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
  const q = query(apoiadorColRef, orderBy("createdAt", "desc"));
  
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

// --- CONSULTAS OTIMIZADAS PARA O PAINEL DE APOIADORES ---
import { where, limit, getDocs } from "firebase/firestore";

export async function buscarUltimosApoiadores(qtd = 10) {
  const q = query(apoiadorColRef, orderBy("createdAt", "desc"), limit(qtd));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function buscarApoiadoresPorData(inicio, fim) {
  const q = query(
    apoiadorColRef, 
    where("createdAt", ">=", inicio), 
    where("createdAt", "<=", fim),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function buscarApoiadoresPorBairro(bairro) {
  const q = query(apoiadorColRef, where("bairro", "==", bairro), limit(50));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function buscarApoiadoresPorCidade(cidade) {
  const q = query(apoiadorColRef, where("cidade", "==", cidade), limit(50));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function buscarApoiadoresPorIndicador(indicador) {
  const q = query(apoiadorColRef, where("indicador", "==", indicador), limit(50));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- CONTROLE DE ACESSO (RBAC) ---
export async function getUserRole(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().role; // 'admin', 'viewer', etc.
    }
    return null;
  } catch (err) {
    console.error("Erro ao buscar role: ", err);
    return null;
  }
}

export async function setUserRole(uid, role, email) {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, { role, email, createdAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (err) {
    console.error("Erro ao definir role: ", err);
    throw err;
  }
}

export function ouvirMembros(callback) {
  const q = query(usersColRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const membros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(membros);
  });
}

export async function atualizarMembroRole(uid, role) {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, { role });
}

export async function deletarMembroRole(uid) {
  const docRef = doc(db, 'users', uid);
  await deleteDoc(docRef);
}

// --- REUNIÕES ---
export async function cadastrarReuniao(dados) {
  try {
    const docRef = await addDoc(reunioesColRef, {
      ...dados,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.error("Erro ao cadastrar reuniao: ", err);
    throw err;
  }
}

export function ouvirReunioes(callback) {
  const q = query(reunioesColRef, orderBy("data", "asc"));
  return onSnapshot(q, (snapshot) => {
    const reunioes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(reunioes);
  });
}

export async function atualizarReuniao(id, dados) {
  const docRef = doc(db, 'reuniao', id);
  await updateDoc(docRef, dados);
}

export async function deletarReuniao(id) {
  const docRef = doc(db, 'reuniao', id);
  await deleteDoc(docRef);
}
