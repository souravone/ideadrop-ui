import { registerUser } from "@/api/auth";
import InputBox from "@/components/inputs/InputBox";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const [error, setError] = useState("");
  const initialFormData = {
    name: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const handleFormChange = (e: React.FormEvent) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      alert("Please fill up all form fields");
      return;
    }
    try {
      await mutateAsync(formData);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate({ to: "/ideas" });
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2">{error}</div>
      )}
      <form
        className="space-y-4 px-4 py-8 border border-gray-300 rounded-sm"
        onSubmit={handleSubmit}
      >
        <InputBox
          htmlFor="name"
          // label="Name"
          name="name"
          value={formData.name}
          onChange={handleFormChange}
          placeholder="Enter your name"
        />
        <InputBox
          htmlFor="email"
          // label="Name"
          name="email"
          value={formData.email}
          onChange={handleFormChange}
          placeholder="Enter your email"
        />
        <InputBox
          htmlFor="password"
          // label="Name"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleFormChange}
          placeholder="Enter your password"
        />
        <button
          className="bg-blue-600 text-white font-semibold px-4 py-2 mt-4 rounded-md w-full cursor-pointer hover:bg-blue-700 disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
