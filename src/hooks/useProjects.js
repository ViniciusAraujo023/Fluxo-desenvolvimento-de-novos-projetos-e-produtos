import { useState, useEffect } from "react";
import { loadProjects, } from "../services/Supabase";

export function useProjects() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    loadProjects().then((p) =>
      setProjects(p)
    );
  }, []);

  return { projects, setProjects, };
}
