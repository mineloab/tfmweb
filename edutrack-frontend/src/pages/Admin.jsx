import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}