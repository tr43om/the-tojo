import { useState } from "react";
import { ProjectList } from "../../components/ProjectList";
import { useCollection } from "../../hooks/useCollection";
// styles
import "./Dashboard.scss";
import { ProjectFilter } from "./ProjectFilter";
import { useAuthContext } from "../../hooks/useAuthContext";

export const Dashboard = () => {
  const [currentFilter, setCurrentFilter] = useState("all");
  const { documents, error } = useCollection("projects");
  const { user } = useAuthContext();

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter);
    console.log(documents[0]);
  };

  const projects = documents?.filter((document) => {
    switch (currentFilter) {
      case "mine":
        return document.assignedUsersList.some((u) => u.id === user.uid);

      case "development":
      case "design":
      case "sales":
      case "marketing":
        console.log(document.category, currentFilter);
        return document.category === currentFilter;
      default:
        return true;
    }
  });

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {documents && (
        <ProjectFilter
          currentFilter={currentFilter}
          changeFilter={changeFilter}
        />
      )}
      {projects && <ProjectList projects={projects} />}
    </div>
  );
};
