import { User } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-background border-b border-border p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-foreground">
              <span className="text-primary mr-2">🛎️</span> DineEase
            </div>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="text-sm">
              <div className="font-medium">Ankur Nanaware</div>
              <div className="text-muted-foreground text-xs">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};