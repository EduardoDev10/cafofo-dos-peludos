import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBcSHZ9B5iD4iHBP7sv0dPqZtCfsMV_kuk",
  authDomain: "cafofo-dos-peludos.firebaseapp.com",
  projectId: "cafofo-dos-peludos",
  storageBucket: "cafofo-dos-peludos.firebasestorage.app",
  messagingSenderId: "919324901035",
  appId: "1:919324901035:web:b5dc5972bb3c7e326501ee"
};

// Inicializa o Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Dados padrão para carga inicial do banco (semeadura)
const defaultPets = [
  { id: '1', name: 'Alex', age: '6 meses', city: 'Brasília DF', description: 'Alex é o explorador do grupo! Curioso, brincalhão e cheio de energia.', type: 'Gato', photo: '/img/alex.png', status: 'Disponível' },
  { id: '2', name: 'Sicha', age: '3 meses', city: 'Brasília DF', description: 'Sicha é pura fofura! Meiga e carinhosa, ela adora um bom colo e cafuné.', type: 'Gato', photo: '/img/sicha.png', status: 'Disponível' },
  { id: '3', name: 'Mel', age: '8 meses', city: 'Brasília DF', description: 'Mel é um encanto! Alegre, delicada e se dá muito bem com outros animais.', type: 'Cachorro', photo: '/img/Mel.png', status: 'Disponível' },
  { id: '4', name: 'Rosa', age: '1 ano', city: 'Brasília DF', description: 'Rosa é um doce de cadela! Muito dócil, companheira e protetora.', type: 'Cachorro', photo: '/img/Rosa.png', status: 'Disponível' },
  { id: '5', name: 'Bob', age: '10 meses', city: 'Brasília DF', description: 'Bob é muito animado, tem muita energia pra gastar e adora correr atrás de bolinhas!', type: 'Cachorro', photo: '/img/bob.png', status: 'Disponível' },
  { id: '6', name: 'Will', age: '2 anos', city: 'Brasília DF', description: 'Will é o introvertido do grupo. Calmo, silencioso e muito observador.', type: 'Cachorro', photo: '/img/Will.png', status: 'Disponível' },
  { id: '7', name: 'Chavosa', age: '3 anos', city: 'Brasília DF', description: 'Chavosa é extremamente fofa e estilosa! Uma gatinha charmosa com olhar marcante.', type: 'Gato', photo: '/img/chavosa.png', status: 'Disponível' },
  { id: '8', name: 'Leo', age: '6 meses', city: 'Brasília DF', description: 'Leo adora brincar com os outros gatos, super extrovertido e brincalhão.', type: 'Gato', photo: '/img/Leo.png', status: 'Disponível' },
  { id: '9', name: 'João', age: '10 meses', city: 'Brasília DF', description: 'João é um companheiro agitado e fiel. Pronto para qualquer aventura!', type: 'Cachorro', photo: '/img/Joao.png', status: 'Disponível' },
  { id: '10', name: '3 Marias', age: '1 ano', city: 'Brasília DF', description: 'As Marias são irmãs que cresceram juntas e não podem se separar! Amor em dose tripla.', type: 'Outro', photo: '/img/marias.png', status: 'Disponível' },
  { id: '11', name: 'Melo', age: '3 anos', city: 'Brasília DF', description: 'O caramelo mais divertido e amigável de todos! Ama crianças.', type: 'Cachorro', photo: '/img/melo.png', status: 'Disponível' },
  { id: '12', name: 'Let', age: '6 meses', city: 'Brasília DF', description: 'Let adora brincar e é super sociável com humanos e felinos.', type: 'Gato', photo: '/img/let.png', status: 'Disponível' }
];

const defaultVolunteers = [
  { id: '101', name: 'Mariana Silva', phone: '(61) 98888-7777', email: 'mariana.silva@gmail.com', age: '24', address: 'Asa Norte, Bloco C, Apto 302', timeOfDay: 'Tarde', gender: 'Mulher' },
  { id: '102', name: 'Rodrigo Oliveira', phone: '(61) 97777-6666', email: 'rodrigo.oliveira@outlook.com', age: '30', address: 'Guará II, QE 15, Conjunto D', timeOfDay: 'Manhã', gender: 'Homem' }
];

const defaultAdoptions = [
  { id: '201', petId: '3', adopterName: 'Ana Clara', adopterLastName: 'Mendes', email: 'anaclara.mendes@gmail.com', phone: '(61) 99999-1111', address: 'Sudoeste, QMSW 2', address2: 'Apto 101', city: 'Brasília', state: 'DF', cep: '70680-200', reason: 'Sempre tive cães e adoro a energia deles. Tenho espaço e tempo para dar muito carinho para a Mel.', status: 'Aprovado', date: '2026-05-18' },
  { id: '202', petId: '1', adopterName: 'Lucas', adopterLastName: 'Pereira', email: 'lucas.pereira@gmail.com', phone: '(61) 99999-2222', address: 'Águas Claras, Av. Araucárias', address2: 'Residencial Ipê, Apto 1204', city: 'Brasília', state: 'DF', cep: '71900-100', reason: 'Minha casa é telada e moro sozinho. Procuro um companheiro felino dócil e curioso como o Alex.', status: 'Pendente', date: '2026-05-24' }
];

// Inicializa o Express
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Suporta payloads maiores para imagens em base64

const PORT = 3001;

// --- ENDPOINTS DOS PETS ---

app.get('/api/pets', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pets'));
    let petsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Se o banco estiver vazio, realiza a carga inicial
    if (petsList.length === 0) {
      console.log('Coleção "pets" vazia. Iniciando semeadura automática...');
      const seedPromises = defaultPets.map(async (pet) => {
        await setDoc(doc(db, 'pets', pet.id), pet);
      });
      await Promise.all(seedPromises);

      // Busca novamente os pets após a carga inicial
      const newSnapshot = await getDocs(collection(db, 'pets'));
      petsList = newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    res.json(petsList);
  } catch (err) {
    console.error('Erro ao listar pets:', err);
    res.status(500).json({ error: 'Erro ao listar pets do banco de dados.' });
  }
});

app.post('/api/pets', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pets'));
    const petsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Gera o próximo ID sequencial numérico
    const numericIds = petsList
      .map(p => parseInt(p.id))
      .filter(id => !isNaN(id));
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    const newIdStr = String(nextId);

    const newPet = {
      ...req.body,
      id: newIdStr
    };

    await setDoc(doc(db, 'pets', newIdStr), newPet);
    res.status(201).json(newPet);
  } catch (err) {
    console.error('Erro ao criar pet:', err);
    res.status(500).json({ error: 'Erro ao criar pet.' });
  }
});

app.put('/api/pets/:id', async (req, res) => {
  try {
    const petId = req.params.id;
    const petDocRef = doc(db, 'pets', petId);
    
    const updatedData = { ...req.body };
    delete updatedData.id; // Remove o ID do corpo para evitar duplicar como campo no Firestore

    await updateDoc(petDocRef, updatedData);
    res.json({ success: true, id: petId, ...updatedData });
  } catch (err) {
    console.error('Erro ao atualizar pet:', err);
    res.status(500).json({ error: 'Erro ao atualizar pet.' });
  }
});

app.delete('/api/pets/:id', async (req, res) => {
  try {
    const petId = req.params.id;
    await deleteDoc(doc(db, 'pets', petId));
    res.json({ success: true, message: `Pet ${petId} excluído com sucesso.` });
  } catch (err) {
    console.error('Erro ao excluir pet:', err);
    res.status(500).json({ error: 'Erro ao excluir pet.' });
  }
});


// --- ENDPOINTS DOS VOLUNTÁRIOS ---

app.get('/api/volunteers', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'volunteers'));
    let volunteersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Se estiver vazio, realiza auto-seed
    if (volunteersList.length === 0) {
      console.log('Coleção "volunteers" vazia. Iniciando semeadura automática...');
      const seedPromises = defaultVolunteers.map(async (volunteer) => {
        await setDoc(doc(db, 'volunteers', volunteer.id), volunteer);
      });
      await Promise.all(seedPromises);

      const newSnapshot = await getDocs(collection(db, 'volunteers'));
      volunteersList = newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    res.json(volunteersList);
  } catch (err) {
    console.error('Erro ao listar voluntários:', err);
    res.status(500).json({ error: 'Erro ao listar voluntários.' });
  }
});

app.post('/api/volunteers', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'volunteers'));
    const volunteersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Gera o próximo ID sequencial (a partir de 101)
    const numericIds = volunteersList
      .map(v => parseInt(v.id))
      .filter(id => !isNaN(id));
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 101;
    const newIdStr = String(nextId);

    const newVolunteer = {
      ...req.body,
      id: newIdStr
    };

    await setDoc(doc(db, 'volunteers', newIdStr), newVolunteer);
    res.status(201).json(newVolunteer);
  } catch (err) {
    console.error('Erro ao criar voluntário:', err);
    res.status(500).json({ error: 'Erro ao criar voluntário.' });
  }
});

app.put('/api/volunteers/:id', async (req, res) => {
  try {
    const volId = req.params.id;
    const volDocRef = doc(db, 'volunteers', volId);

    const updatedData = { ...req.body };
    delete updatedData.id;

    await updateDoc(volDocRef, updatedData);
    res.json({ success: true, id: volId, ...updatedData });
  } catch (err) {
    console.error('Erro ao atualizar voluntário:', err);
    res.status(500).json({ error: 'Erro ao atualizar voluntário.' });
  }
});

app.delete('/api/volunteers/:id', async (req, res) => {
  try {
    const volId = req.params.id;
    await deleteDoc(doc(db, 'volunteers', volId));
    res.json({ success: true, message: `Voluntário ${volId} excluído com sucesso.` });
  } catch (err) {
    console.error('Erro ao excluir voluntário:', err);
    res.status(500).json({ error: 'Erro ao excluir voluntário.' });
  }
});


// --- ENDPOINTS DAS ADOÇÕES ---

app.get('/api/adoptions', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'adoptions'));
    let adoptionsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Se estiver vazio, realiza auto-seed
    if (adoptionsList.length === 0) {
      console.log('Coleção "adoptions" vazia. Iniciando semeadura automática...');
      const seedPromises = defaultAdoptions.map(async (adoption) => {
        await setDoc(doc(db, 'adoptions', adoption.id), adoption);
      });
      await Promise.all(seedPromises);

      const newSnapshot = await getDocs(collection(db, 'adoptions'));
      adoptionsList = newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    res.json(adoptionsList);
  } catch (err) {
    console.error('Erro ao listar adoções:', err);
    res.status(500).json({ error: 'Erro ao listar adoções.' });
  }
});

app.post('/api/adoptions', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'adoptions'));
    const adoptionsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Gera o próximo ID sequencial (a partir de 201)
    const numericIds = adoptionsList
      .map(a => parseInt(a.id))
      .filter(id => !isNaN(id));
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 201;
    const newIdStr = String(nextId);

    const newAdoption = {
      ...req.body,
      id: newIdStr,
      date: req.body.date || new Date().toISOString().split('T')[0]
    };

    await setDoc(doc(db, 'adoptions', newIdStr), newAdoption);
    res.status(201).json(newAdoption);
  } catch (err) {
    console.error('Erro ao criar adoção:', err);
    res.status(500).json({ error: 'Erro ao criar adoção.' });
  }
});

app.put('/api/adoptions/:id', async (req, res) => {
  try {
    const adoptionId = req.params.id;
    const adoptionDocRef = doc(db, 'adoptions', adoptionId);

    const updatedData = { ...req.body };
    delete updatedData.id;

    await updateDoc(adoptionDocRef, updatedData);

    // Se a adoção for aprovada, atualiza automaticamente o status do pet para "Adotado"
    if (updatedData.status === 'Aprovado' && updatedData.petId) {
      const petDocRef = doc(db, 'pets', updatedData.petId);
      await updateDoc(petDocRef, { status: 'Adotado' });
      console.log(`Pet ${updatedData.petId} marcado reativamente como 'Adotado'.`);
    }

    res.json({ success: true, id: adoptionId, ...updatedData });
  } catch (err) {
    console.error('Erro ao atualizar adoção:', err);
    res.status(500).json({ error: 'Erro ao atualizar adoção.' });
  }
});

app.delete('/api/adoptions/:id', async (req, res) => {
  try {
    const adoptionId = req.params.id;
    await deleteDoc(doc(db, 'adoptions', adoptionId));
    res.json({ success: true, message: `Adoção ${adoptionId} excluída com sucesso.` });
  } catch (err) {
    console.error('Erro ao excluir adoção:', err);
    res.status(500).json({ error: 'Erro ao excluir adoção.' });
  }
});


// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
