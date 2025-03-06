import { Home } from "lucide-react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { usePackage } from "@/context/package-context";

export function Header() {
  const navigate = useNavigate();
  const { searchQuery, search } = usePackage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="flex items-center h-14 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-9 w-9"
          onClick={() => navigate({ to: "/" })}
        >
          <Home className="h-4 w-4" />
        </Button>
        <div className="w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => search(e.target.value)}
            placeholder="Search packages..."
            className="w-full px-3 py-1.5 rounded border focus:outline-none focus:ring-2"
          />
        </div>
      </div>
    </header>
  );
}
