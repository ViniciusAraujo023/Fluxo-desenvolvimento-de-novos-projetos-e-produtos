import { STATUS } from "../data/constants";

const isBlockedStatus = (status) => 
  status === STATUS.RECUSADO || 
  status === STATUS.CANCELADO;

const statusBadgeClass = (status) => {
  switch (status) {
    case STATUS.CONCLUIDO: 
      return "bg-emerald-100 text-emerald-700";
    case STATUS.RECUSADO: 
      return "bg-rose-100 text-rose-700";
    case STATUS.CANCELADO: 
      return "bg-slate-200 text-slate-600";
    default: r
      eturn "bg-amber-100 text-amber-700";
  }
};

const progressBarClass = (status) => {
  if (status === STATUS.RECUSADO) 
    return "bg-rose-400";
  
  if (status === STATUS.CANCELADO) 
    return "bg-slate-400";
  
  return "bg-sky-800";
};
