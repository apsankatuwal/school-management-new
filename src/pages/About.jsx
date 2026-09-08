import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";

export default function About() {
  return (
    <div>
      <Navbar />
      <div className="px-8 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-950 mb-4">
          About Evergreen Academy
        </h1>
        <p className="text-gray-600 leading-7">
          Evergreen Academy's School Management System brings students,
          teachers, attendance, examinations, results, and fee management
          together in one simple digital platform.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 text-emerald-900 font-semibold hover:underline"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}