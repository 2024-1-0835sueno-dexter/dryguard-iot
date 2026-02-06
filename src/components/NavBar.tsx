import Link from "next/link";

interface NavBarProps {
  active?: "dashboard" | "logs" | "settings" | "devices";
}

const navItems = [
  { key: "dashboard", label: "Dashboard", href: "/", icon: "🏠" },
  { key: "logs", label: "Logs", href: "/logs", icon: "📄" },
  { key: "settings", label: "Settings", href: "/settings", icon: "⚙️" },
  { key: "devices", label: "Devices", href: "/devices", icon: "🧭" },
] as const;

export default function NavBar({ active = "dashboard" }: NavBarProps) {
  return (
    <div className="dg-topbar flex flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-800 bg-white text-lg">
          🛡️
        </div>
        <div>
          <p className="text-lg font-bold">DryGuard Admin</p>
          <p className="text-xs dg-muted">Realtime Device Console</p>
        </div>
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-center gap-3">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`dg-tab inline-flex items-center gap-2 ${active === item.key ? "dg-tab-active" : ""}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
