"use client";

import { useForm } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";
import Image from "next/image";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

interface LoginResponse {
  login: {
    token: string;
    user: {
      id: number;
      email: string;
      role: "MANAGER" | "STORE_KEEPER";
    };
  };
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const [login, { loading, error }] =
    useMutation<LoginResponse>(LOGIN_MUTATION);
  const { login: authLogin } = useAuth();
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const response = await login({
        variables: { email: data.email, password: data.password },
      });
      if (response.data?.login) {
        authLogin(response.data.login.token, response.data.login.user);
      }
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-300 dark:border-gray-800">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>

          {loginError && (
            <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-md border border-red-200 dark:border-red-800">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 mb-1">
            Demo Manager: manager@example.com / password
          </p>
          <p className="text-xs text-gray-500">
            Demo Store Keeper: keeper@example.com / password
          </p>
        </div>
      </div>
    </div>
  );
}
