import {
  GraduationCap,
  Users,
  UserCheck,
  ClipboardList,
  BarChart3,
  Wallet,
  LayoutDashboard,
} from "lucide-react";

const featuresData = [
  {
    title: "Student Management",
    content:
      "Complete digital profiles, enrollment tracking, and academic history in one secure place.",
    icon: GraduationCap,
  },
  {
    title: "Teacher Management",
    content:
      "Organize staff directories, class assignments, schedules, and professional development.",
    icon: Users,
  },
  {
    title: "Attendance Tracking",
    content:
      "Real-time daily attendance monitoring with automated notifications for absences.",
    icon: UserCheck,
  },
  {
    title: "Examinations",
    content:
      "Schedule tests, manage digital assessments, and streamline the grading process securely.",
    icon: ClipboardList,
  },
  {
    title: "Results Management",
    content:
      "Generate comprehensive report cards, analyze performance trends, and publish results instantly to student portals.",
    icon: BarChart3,
  },
  {
    title: "Fee Management",
    content:
      "Automated invoicing, secure digital payments, and transparent financial reporting.",
    icon: Wallet,
  },
  {
    title: "School Dashboard",
    content:
      "A unified command center providing key metrics and insights at a single glance.",
    icon: LayoutDashboard,
  },
];

export default function Features() {
  return (
    <div id="features" className="px-20 py-24">
      <h2 className="text-4xl font-bold text-center text-emerald-950">Features</h2>

      <div className="grid grid-cols-4 gap-6 mt-20 px-24">
        {featuresData.map((feature, index) => (
          <div
            key={feature.title}
            className={`border rounded-2xl p-4 border-gray-400 hover:shadow-lg ${
              index === 4 ? "col-span-2" : ""
            }`}
          >
            <feature.icon className="size-10 text-emerald-900 mb-4" />
            <h3 className="text-xl mb-4 font-semibold">{feature.title}</h3>
            <p className="text-gray-600 text-sm leading-6">{feature.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}