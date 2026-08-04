import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

function AppLayout() {
  return (
    <div className="app-shell">
      <Navigation />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;