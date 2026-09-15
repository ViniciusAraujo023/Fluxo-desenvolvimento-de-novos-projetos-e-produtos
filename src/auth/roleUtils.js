import { ROLES, } from "../data/roles";

function isAdmin(user) {
  return user?.role === ROLES.ADMIN;
}

function isGestor(user) {
  return user?.role === ROLES.GESTOR;
}

function isColaborador(user) {
  return user?.role === ROLES.COLABORADOR;
}

function isVisualizador(user) {
  return user?.role === ROLES.VISUALIZADOR;
}

export { isAdmin, isGestor, isColaborador, isVisualizador, };
