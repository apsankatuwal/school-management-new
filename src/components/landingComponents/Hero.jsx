import { ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] flex items-center">
      <div className="w-full max-w-[1390px] mx-auto px-8 flex items-center justify-between gap-12">
        <div className="w-[52%]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-semibold">
            <ShieldCheck size={15} />
            Secure Platform • Accessible 24/7
          </div>

          <h1 className="mt-5 text-5xl tracking-tight font-[660] leading-[1.25] text-emerald-950">
            Smart Management for a
            <span className="block text-emerald-900">Smarter School.</span>
          </h1>

          <p className="mt-6 max-w-[600px] text-lg leading-7 text-gray-600">
            Evergreen Academy brings students, teachers, attendance,
            examinations, results, and fee management together in one simple
            digital platform.
          </p>

          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-white bg-emerald-900 py-3 px-7 rounded-lg font-semibold text-sm hover:bg-emerald-800 cursor-pointer"
            >
              Login to Portal
              <ArrowRight size={18} />
            </button>

            <a
              href="#features"
              className="py-3 px-7 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Explore Features
            </a>
          </div>
        </div>

        <div className="w-[55%]">
          <div className="border rounded-3xl border-gray-100">
            <img
              src="/hero.png"
              alt="Evergreen hero section"
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}