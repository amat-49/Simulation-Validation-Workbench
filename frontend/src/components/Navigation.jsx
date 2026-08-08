import { NavLink } from "react-router-dom";

const links = [
  { path: "/", label: "Dashboard" },
  { path: "/configuration", label: "Configuration" },
  { path: "/execution", label: "Execution" },
  { path: "/results", label: "Results" },
  { path: "/history", label: "History" },
];

function Navigation() {
  return (
    <aside className="sidebar">
      <h1>Simulation Validation Workbench</h1>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/"}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Navigation;