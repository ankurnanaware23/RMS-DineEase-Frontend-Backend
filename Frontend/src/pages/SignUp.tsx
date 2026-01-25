
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <div className="relative flex items-center justify-center h-screen">
        <Link to="/" className="absolute top-8 left-8 flex items-center space-x-2 group">
            <span className="p-2 bg-primary text-primary-foreground rounded-full group-hover:bg-primary/90">
                <ArrowLeft className="w-6 h-6" />
            </span>
            <span className="text-primary font-medium group-hover:text-primary/90">Back to dashboard</span>
        </Link>
      <div className="w-full max-w-md p-6 space-y-4 bg-card rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] border border-border">
        <div className="flex justify-center">
          {/* Placeholder for logo */}
          <svg
            className="w-12 h-12 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm0 0c-3.314 0-6 2.686-6 6v1h12v-1c0-3.314-2.686-6-6-6z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center text-card-foreground">
          Create an account
        </h2>
        <p className="text-center text-muted-foreground">
          Join us! Please fill in the details to create your account.
        </p>
        <form className="space-y-4">
          <div className="relative">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-card-foreground"
            >
              First Name
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="w-5 h-5 text-gray-400" />
              </span>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-10 px-4 py-2 bg-input border border-border rounded-lg focus:ring-ring focus:border-ring"
              />
            </div>
          </div>
          <div className="relative">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-card-foreground"
            >
              Last Name
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="w-5 h-5 text-gray-400" />
              </span>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-10 px-4 py-2 bg-input border border-border rounded-lg focus:ring-ring focus:border-ring"
              />
            </div>
          </div>
          <div className="relative">
            <label
              htmlFor="email"
              className="text-sm font-medium text-card-foreground"
            >
              Email
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="w-5 h-5 text-gray-400" />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 px-4 py-2 bg-input border border-border rounded-lg focus:ring-ring focus:border-ring"
              />
            </div>
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="text-sm font-medium text-card-foreground"
            >
              Password
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="w-5 h-5 text-gray-400" />
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 px-4 py-2 bg-input border border-border rounded-lg focus:ring-ring focus:border-ring"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
