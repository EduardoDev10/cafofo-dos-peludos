export const defaultPets = [
  {
    id: '1',
    name: 'Alex',
    age: '6 meses',
    city: 'Brasília DF',
    description: 'Alex é o explorador do grupo! Curioso, brincalhão e cheio de energia.',
    type: 'Gato',
    photo: '/img/alex.png',
    status: 'Disponível'
  },
  {
    id: '2',
    name: 'Sicha',
    age: '3 meses',
    city: 'Brasília DF',
    description: 'Sicha é pura fofura! Meiga e carinhosa, ela adora um bom colo e cafuné.',
    type: 'Gato',
    photo: '/img/sicha.png',
    status: 'Disponível'
  },
  {
    id: '3',
    name: 'Mel',
    age: '8 meses',
    city: 'Brasília DF',
    description: 'Mel é um encanto! Alegre, delicada e se dá muito bem com outros animais.',
    type: 'Cachorro',
    photo: '/img/Mel.png',
    status: 'Disponível'
  },
  {
    id: '4',
    name: 'Rosa',
    age: '1 ano',
    city: 'Brasília DF',
    description: 'Rosa é um doce de cadela! Muito dócil, companheira e protetora.',
    type: 'Cachorro',
    photo: '/img/Rosa.png',
    status: 'Disponível'
  },
  {
    id: '5',
    name: 'Bob',
    age: '10 meses',
    city: 'Brasília DF',
    description: 'Bob é muito animado, tem muita energia pra gastar e adora correr atrás de bolinhas!',
    type: 'Cachorro',
    photo: '/img/bob.png',
    status: 'Disponível'
  },
  {
    id: '6',
    name: 'Will',
    age: '2 anos',
    city: 'Brasília DF',
    description: 'Will é o introvertido do grupo. Calmo, silencioso e muito observador.',
    type: 'Cachorro',
    photo: '/img/Will.png',
    status: 'Disponível'
  },
  {
    id: '7',
    name: 'Chavosa',
    age: '3 anos',
    city: 'Brasília DF',
    description: 'Chavosa é extremamente fofa e estilosa! Uma gatinha charmosa com olhar marcante.',
    type: 'Gato',
    photo: '/img/chavosa.png',
    status: 'Disponível'
  },
  {
    id: '8',
    name: 'Leo',
    age: '6 meses',
    city: 'Brasília DF',
    description: 'Leo adora brincar com os outros gatos, super extrovertido e brincalhão.',
    type: 'Gato',
    photo: '/img/Leo.png',
    status: 'Disponível'
  },
  {
    id: '9',
    name: 'João',
    age: '10 meses',
    city: 'Brasília DF',
    description: 'João é um companheiro agitado e fiel. Pronto para qualquer aventura!',
    type: 'Cachorro',
    photo: '/img/Joao.png',
    status: 'Disponível'
  },
  {
    id: '10',
    name: '3 Marias',
    age: '1 ano',
    city: 'Brasília DF',
    description: 'As Marias são irmãs que cresceram juntas e não podem se separar! Amor em dose tripla.',
    type: 'Outro',
    photo: '/img/marias.png',
    status: 'Disponível'
  },
  {
    id: '11',
    name: 'Melo',
    age: '3 anos',
    city: 'Brasília DF',
    description: 'O caramelo mais divertido e amigável de todos! Ama crianças.',
    type: 'Cachorro',
    photo: '/img/melo.png',
    status: 'Disponível'
  },
  {
    id: '12',
    name: 'Let',
    age: '6 meses',
    city: 'Brasília DF',
    description: 'Let adora brincar e é super sociável com humanos e felinos.',
    type: 'Gato',
    photo: '/img/let.png',
    status: 'Disponível'
  }
];

export const defaultVolunteers = [
  {
    id: '101',
    name: 'Mariana Silva',
    phone: '(61) 98888-7777',
    email: 'mariana.silva@gmail.com',
    age: '24',
    address: 'Asa Norte, Bloco C, Apto 302',
    timeOfDay: 'Tarde',
    gender: 'Mulher'
  },
  {
    id: '102',
    name: 'Rodrigo Oliveira',
    phone: '(61) 97777-6666',
    email: 'rodrigo.oliveira@outlook.com',
    age: '30',
    address: 'Guará II, QE 15, Conjunto D',
    timeOfDay: 'Manhã',
    gender: 'Homem'
  }
];

export const defaultAdoptions = [
  {
    id: '201',
    petId: '3', // Mel
    adopterName: 'Ana Clara',
    adopterLastName: 'Mendes',
    email: 'anaclara.mendes@gmail.com',
    phone: '(61) 99999-1111',
    address: 'Sudoeste, QMSW 2',
    address2: 'Apto 101',
    city: 'Brasília',
    state: 'DF',
    cep: '70680-200',
    reason: 'Sempre tive cães e adoro a energia deles. Tenho espaço e tempo para dar muito carinho para a Mel.',
    status: 'Aprovado',
    date: '2026-05-18'
  },
  {
    id: '202',
    petId: '1', // Alex
    adopterName: 'Lucas',
    adopterLastName: 'Pereira',
    email: 'lucas.pereira@gmail.com',
    phone: '(61) 99999-2222',
    address: 'Águas Claras, Av. Araucárias',
    address2: 'Residencial Ipê, Apto 1204',
    city: 'Brasília',
    state: 'DF',
    cep: '71900-100',
    reason: 'Minha casa é telada e moro sozinho. Procuro um companheiro felino dócil e curioso como o Alex.',
    status: 'Pendente',
    date: '2026-05-24'
  }
];
