import { OPT_SN, OPT_AR } from "./constants";

export const STEP_DEFS = [
  { title: "Solicitar avaliação de nova ideia de produto", fields: [
    { key: "ideia", label: "Ideia", type: "text" },
    { key: "tipoIdeia", label: "Tipo de ideia", type: "select", options: ["Redução de custo", "Inovação", "Melhoria"] },
    { key: "segmento", label: "Segmento", type: "select", options: [
      "Banho", "Sobre Pia", "Lixeiras", "Organização", "Caixas Térmicas",
      "Bolsas Térmicas", "Isotérmicos", "Garrafas Térmicas", "Marmitas", "Utilidades", "Outros",
    ]},
    { key: "descricao", label: "Descrição da ideia", type: "textarea" },
    { key: "justificativa", label: "Justificativa", type: "textarea" },
  ]},
  { title: "Avaliar ideia de novo produto", approval: true },
  { title: "Aprovar TAP / Escopo", fields: [
    { key: "tap", label: "TAP preenchida", type: "file" },
    { key: "escopo", label: "Escopo preenchido", type: "file" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
  ]},
  { title: "Avaliar projeto nacional / importado", fields: [
    { key: "nacional", label: "Nacional", type: "checkbox" },
    { key: "importado", label: "Importado", type: "checkbox" },
    { key: "docViabilidade", label: "Doc. viabilidade técnica", type: "file" },
    { key: "investimento", label: "Investimento", type: "file" },
    { key: "observacao", label: "Observação", type: "textarea" },
  ]},
  { title: "Alinhar projeto de novo produto", fields: [
    { key: "projetoValidado", label: "Projeto validado", type: "select", options: OPT_SN },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Analisar o projeto conforme o tipo", branch: true, fields: {
    Importado: [
      { key: "solicitarAmostra", label: "Solicitar amostra", type: "select", options: OPT_SN },
      { key: "anexarCotacao", label: "Anexar cotação", type: "file" },
      { key: "loteMinimo", label: "Lote mínimo", type: "text" },
      { key: "custoValidado", label: "Custo validado", type: "select", options: OPT_SN },
      { key: "observacao", label: "Observação", type: "textarea" },
    ],
    Nacional: [
      { key: "investimentoAtualizado", label: "Investimento atualizado", type: "file" },
      { key: "custoAtualizado", label: "Custo atualizado", type: "file" },
      { key: "conceitoProduto", label: "Conceito do produto", type: "file" },
      { key: "observacao", label: "Observação", type: "textarea" },
    ],
  }},
  { title: "Avaliar custos do projeto de novo produto", fields: [
    { key: "baixarCusto", label: "Custo anexado", type: "download" },
    { key: "custosValidados", label: "Custos validados", type: "radio", options: OPT_SN },
    { key: "anexarNovoCusto", label: "Anexar novo custo", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Validar fornecedor", fields: [
    { key: "certificadoIso", label: "Certificado ISO", type: "file" },
    { key: "fornecedorValidado", label: "Fornecedor validado", type: "select", options: OPT_SN },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Validar processo ferramental", fields: [
    { key: "docValidacaoFerramental", label: "Doc. validação ferramental", type: "file" },
    { key: "validacao", label: "Validação", type: "select", options: OPT_SN },
    { key: "observacao", label: "Observação", type: "textarea" },
  ]},
  { title: "Testar produto", fields: [
    { key: "arquivoPadraoTestes", label: "Arquivo padrão de testes", type: "download" },
    { key: "testePreenchido", label: "Teste preenchido", type: "file" },
    { key: "testeValidado", label: "Teste validado", type: "radio", options: OPT_SN },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Avaliar alternativas / Apresentar projeto", fields: [
    { key: "apresentacaoPPT", label: "Apresentação PPT", type: "file" },
    { key: "projetoValidado", label: "Projeto validado", type: "select", options: OPT_SN },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Definir cores e acabamento / Enviar render", fields: [
    { key: "definicaoCores", label: "Definição das cores", type: "text" },
    { key: "acabamentoCorpo", label: "Acabamento e corpo", type: "text" },
    { key: "renderProduto", label: "Render do produto", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Desenvolver briefing do marketing", fields: [
    { key: "briefingMkt", label: "Briefing do MKT", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Alinhar previsão de vendas — Marketing", fields: [
    { key: "previsaoVendas", label: "Previsão de vendas", type: "file" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Alinhar previsão de vendas — Comercial", fields: [
    { key: "previsaoVendas", label: "Previsão de vendas", type: "file" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Alinhar previsão de vendas — Planejamento", fields: [
    { key: "previsaoVendas", label: "Previsão de vendas", type: "file" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Preencher AI", fields: [
    { key: "baixarModeloAI", label: "Modelo padrão de AI", type: "download" },
    { key: "anexarAI", label: "Anexar AI", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastro de produto — Etapa 1", fields: [
    { key: "checklist1", label: "Itens de cadastro", type: "checklist", options: [
      "Planilha / Cubagem", "EN0105", "CD1117", "CD0204", "CD0022",
      "CD0138", "CD0903", "CE0106", "CD2561", "CD1112", "FT0301",
    ]},
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastro de produto — Etapa 2", fields: [
    { key: "checklist2", label: "Itens de cadastro", type: "checklist", options: [
      "Criação da PS", "Criação da INSP", "Cadastro FTP",
    ]},
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar processo do item", fields: [
    { key: "planilhaCusto", label: "Planilha de custo", type: "download" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar dados fiscais do item (check do fiscal)", fields: [
    { key: "cadastroFiscal", label: "Cadastro fiscal", type: "download" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Desenhar plano de comunicação", fields: [
    { key: "planoComunicacao", label: "Plano de comunicação", type: "file" },
    { key: "etiquetasTags", label: "Etiquetas / tags", type: "file" },
    { key: "embalagens", label: "Embalagens", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar PS / II / CNP / SISCOMEX / FTP", fields: [
    { key: "checklist3", label: "Itens cadastrados", type: "checklist", options: [
      "PS", "Inspection Instruction", "CNP", "SISCOMEX", "FTP",
    ]},
    { key: "arquivosCadastro", label: "Arquivos de cadastro", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Definir insumos", fields: [
    { key: "definicaoInsumos", label: "Definição de insumos", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Enviar documentação PS / II / ArtWork", subtitle: "Segmentação importado", fields: [
    { key: "ps", label: "PS", type: "file" },
    { key: "inspectionInstruction", label: "Inspection Instruction", type: "file" },
    { key: "artwork", label: "ArtWork", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Desenvolver fornecedores / Validar matéria-prima", fields: [
    { key: "validacaoFornecedor", label: "Validação fornecedor", type: "file" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Validar processos", subtitle: "Ficha padrão try-out", fields: [
    { key: "fichaPadrao", label: "Ficha padrão try-out", type: "download" },
    { key: "fichaPreenchida", label: "Ficha preenchida", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar solicitação de compra — TOTVS", fields: [
    { key: "numeroSolicitacao", label: "Nº da solicitação", type: "text" },
    { key: "printCadastro", label: "Print do cadastro", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar pedido de compra — TOTVS", fields: [
    { key: "numeroPedido", label: "Nº do pedido", type: "text" },
    { key: "printPedido", label: "Print do pedido", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Registrar PI no TOTVS", fields: [
    { key: "arquivoProforma", label: "Arquivo proforma", type: "file" },
    { key: "arquivoInvoice", label: "Arquivo invoice", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Aprovar PI TOTVS", fields: [
    { key: "aprovacaoPiTotvs", label: "Aprovação PI TOTVS", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Anexar arquivo de inspeção", fields: [
    { key: "arquivoInspecao", label: "Arquivo de inspeção preenchido", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Aprovar / Acompanhar pedido — lote piloto", fields: [
    { key: "aprovacaoInspecao", label: "Aprovação da inspeção", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Validar custos e preço de lista", fields: [
    { key: "validacaoCusto", label: "Validação de custo", type: "file" },
    { key: "aprovacaoPrecoLista", label: "Aprovação preço de lista", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Plano de lançamento", fields: [
    { key: "planoLancamento", label: "Plano de lançamento", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
];

export default STEP_DEFS;
