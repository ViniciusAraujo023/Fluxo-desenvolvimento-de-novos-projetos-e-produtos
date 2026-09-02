const PHASES = [
  { id: "ideacao", label: "Ideação", range: [0, 1] },
  { id: "viabilidade", label: "Viabilidade & Aprovação", range: [2, 6] },
  { id: "desenvolvimento", label: "Desenvolvimento & Testes", range: [7, 11] },
  { id: "marketing", label: "Marketing & Vendas", range: [12, 19] },
  { id: "registro", label: "Registro & Cadastro", range: [20, 26] },
  { id: "compras", label: "Compras & Importação", range: [27, 33] },
  { id: "lancamento", label: "Lançamento", range: [34, 34] },
];

const phaseOf = (idx) => 
  PHASES.find(
    (p) => 
      idx >= p.range[0] && 
      idx <= p.range[1]
);


///
export {
  PHASES,
  phaseOf,
};
