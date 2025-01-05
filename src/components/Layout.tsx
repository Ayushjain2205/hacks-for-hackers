import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const navItems = [
    { name: "Prompt Generator", href: "/prompt-generator" },
    { name: "Prompt Manager", href: "/prompt-builder" },
    { name: "Pipelines", href: "/pipelines" },
    { name: "Marketplace", href: "/marketplace" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center space-x-2"
            >
              <Image
                src="/ai-forge.svg"
                alt="AI Forge Platform"
                width={40}
                height={40}
              />
              <span className="text-2xl font-bold text-[#FF6B2C]">
                AI Forge
              </span>
            </Link>
            <div className="flex items-center justify-end space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium transition-colors duration-200 ease-in-out",
                    "-mb-px pb-3",
                    router.pathname === item.href
                      ? "border-[#FF6B2C] text-[#2A2D3E]"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
