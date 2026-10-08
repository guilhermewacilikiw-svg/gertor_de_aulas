import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 overflow-x-hidden selection:bg-red-600/20">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
