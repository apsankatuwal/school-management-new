import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between border border-blue-100 py-3 px-9">
      <div className="flex items-center gap-2 text-2xl font-bold text-emerald-950">
        <GraduationCap size={30} />
        <h1>Evergreen Academy</h1>
      </div>

      <div className="flex items-center gap-8">
        <nav className="space-x-8 text-sm text-gray-500 font-medium [&>a]:hover:text-black">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
        <CustomButton text="Portal Login" link="/login" />
      </div>
    </header>
  );
}