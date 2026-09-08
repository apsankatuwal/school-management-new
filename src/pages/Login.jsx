
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  School,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or username is required"),

  password: z
    .string()
    .min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // -----------------------------------------
      // BACKEND LOGIN WILL GO HERE
      // -----------------------------------------

      console.log("Login data:", {
        ...data,
        remember,
      });

      /*
      Example when backend is connected:

      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      login(response.data.token, response.data.user);
      */

      toast.success("Login successful!");

      // Temporary navigation
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid login credentials"
      );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-4 md:p-8 font-sans text-[#0d1c2f]">
      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-[0_4px_32px_rgba(13,28,47,0.08)] min-h-[700px] lg:h-[800px]">

        {/* =========================
            LEFT SIDE
        ========================== */}
        <div className="hidden lg:block relative bg-[#e6eeff] h-full overflow-hidden">
          
          <img
            src="/images/school-library.jpg"
            alt="School library"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Green overlay */}
          <div className="absolute inset-0 bg-[#003527]/25 mix-blend-multiply" />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#003527]/90 via-[#003527]/30 to-transparent" />

          {/* Branding */}
          <div className="absolute bottom-0 left-0 right-0 p-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
              Evergreen Academy
            </h1>

            <p className="text-lg leading-relaxed text-white/90 max-w-md">
              Access your academic portal to manage courses, view grades,
              and connect with the community.
            </p>
          </div>
        </div>

        {/* =========================
            RIGHT SIDE
        ========================== */}
        <div className="flex flex-col justify-center bg-white px-6 py-12 md:px-12 lg:px-16">
          
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-2xl font-extrabold text-[#003527]">
              Evergreen Academy
            </h1>
          </div>

          <div className="max-w-sm w-full mx-auto">

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#0d1c2f] mb-1">
                Welcome Back
              </h2>

              <p className="text-base text-[#404944]">
                Please sign in to your account.
              </p>
            </div>

            {/* =========================
                LOGIN FORM
            ========================== */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* Email / Username */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#0d1c2f] mb-2"
                >
                  Email or Username
                </label>

                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707974]"
                  />

                  <input
                    id="email"
                    type="text"
                    placeholder="Enter your credentials"
                    {...register("email")}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-base text-[#0d1c2f] outline-none transition-all
                      ${
                        errors.email
                          ? "border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-[#707974]/20 focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
                      }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#0d1c2f]"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#003527] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707974]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full pl-10 pr-11 py-3 bg-white border rounded-lg text-base text-[#0d1c2f] outline-none transition-all
                      ${
                        errors.password
                          ? "border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-[#707974]/20 focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
                      }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707974] hover:text-[#003527]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-[#064e3b] rounded border-[#707974]/20"
                />

                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-[#404944]"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#064e3b] text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-[#003527] transition-colors flex justify-center items-center gap-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}

                {!isSubmitting && (
                  <ArrowRight size={18} />
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#707974]/10" />
              </div>

              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs font-semibold text-[#707974]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Institution / Google */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#707974]/20 rounded-xl bg-white text-sm text-[#0d1c2f] hover:bg-[#eff4ff] transition-colors"
              >
                <School size={18} />
                Institution
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#707974]/20 rounded-xl bg-white text-sm text-[#0d1c2f] hover:bg-[#eff4ff] transition-colors"
              >
                <Mail size={18} />
                Google
              </button>
            </div>

            {/* Support */}
            <p className="text-center text-sm text-[#404944] mt-8">
              Need help logging in?{" "}
              <Link
                to="/contact"
                className="text-[#003527] hover:underline font-semibold"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
