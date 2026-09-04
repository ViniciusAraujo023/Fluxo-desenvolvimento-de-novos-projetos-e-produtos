import {
  ROLES,
} from "../data/roles";

function isAdmin(user) {
  return user?.perfil === ROLES.ADMIN;
}

function isGestor(user) {
  return user?.perfil === ROLES.GESTOR;
}

function isColaborador(user) {
  return user?.perfil === ROLES.COLABORADOR;
}

function isVisualizador(user) {
  return user?.perfil === ROLES.VISUALIZADOR;
}

export {
  isAdmin,
  isGestor,
  isColaborador,
  isVisualizador,
};
