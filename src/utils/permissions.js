import {
  isAdmin,
  isGestor,
} from "./roleUtils";

function canApprove(user) {
  return (
    isAdmin(user) ||
    isGestor(user)
  );
}

function canManageUsers(user) {
  return isAdmin(user);
}

function canManageAreas(user) {
  return isAdmin(user);
}

function canManageActivities(user) {
  return isAdmin(user);
}

function canCreateProjects(user) {
  return (
    isAdmin(user) ||
    isGestor(user)
  );
}

export {
  canApprove,
  canManageUsers,
  canManageAreas,
  canManageActivities,
  canCreateProjects,
};
