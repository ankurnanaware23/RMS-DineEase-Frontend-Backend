import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { EnvelopeClosedIcon, EnvelopeOpenIcon, ArrowLeftIcon, } from "@radix-ui/react-icons";
import api from "@/lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.get(`/api/user/password-reset/${email}/`);
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <Link
        to="/signin"
        className="absolute top-8 left-8 flex items-center group"
      >
        <div className="flex items-center justify-center bg-yellow-400 group-hover:bg-yellow-500 rounded-full w-10 h-10 transition-colors duration-300">
          <ArrowLeftIcon className="h-6 w-6 text-black" />
        </div>
        <span className="ml-3 text-yellow-400 group-hover:text-yellow-500 font-semibold text-lg transition-colors duration-300">
          Back to signin
        </span>
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to request a password reset.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <EnvelopeClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading && (
                <EnvelopeOpenIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Reset Link
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
