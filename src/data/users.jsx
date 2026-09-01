const USERS = [
  { 
    id: "u1",
    name: "Vinícius Almeida",
    email: "viniciusalmeida@soprano.com.br",
    role: "admin",
    area: "Engenharia de Produto"
  },
  
  { 
    id: "u2", 
    name: "Daniel Scotti",
    email: "daniel.scotti@soprano.com.br",
    role: "admin",
    area: "Engenharia de Produto" 
  },

  { 
    id: "u3",
    name: "Eduardo Di Domenico",
    email: "eduardo.didomenico@soprano.com.br",
    role: "colaborador", 
    area: "Colaborador" 
  },
  
  {
    id: "u4",
    name: "Eduarda Bossle da Silva",
    email: "eduarda.bossle@soprano.com.br",
    role: "colaborador",
    area: "Colaboradora" },
];

const isAdminRole = (user) => user?.role === "admin";
