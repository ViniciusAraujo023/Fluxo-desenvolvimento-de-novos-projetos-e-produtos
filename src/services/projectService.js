import { STATUS } from "../data/constants";
import { todayISO } from "../utils/dateUtils";

function uid() {
  return Math.random()
    .toString(36)
    .slice(2, 10);
}

function createProject({
  name,
  responsavel,
  startDate,
  currentUser,
}) {
  return {
    id: uid(),
    name,
    responsavel,
    startDate,
    createdAt: todayISO(),
    updatedAt: todayISO(),
    createdBy: currentUser.id,
    currentStep: 0,
    status: STATUS.EM_ANDAMENTO,
    emailNotified: false,
    data: {},
  };
}

export{ 
  createProject,
}
