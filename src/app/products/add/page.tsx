"use client";

import { useForm } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Save, ShoppingBag, Plus } from "lucide-react";

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($name: String!, $price: Float!, $stock: Int!) {
    createProduct(
      createProductInput: { name: $name, price: $price, stock: $stock }
    ) {
      id
      name
      price
      stock
    }
  }
`;

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      stock
      createdAt
    }
  }
`;

export default function AddProductPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createProduct, { loading, error }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      refetchQueries: [{ query: GET_PRODUCTS }],
      awaitRefetchQueries: true,
    },
  );
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

  const onSubmit = async (data: any) => {
    try {
      await createProduct({
        variables: {
          name: data.name,
          price: parseFloat(data.price),
          stock: parseInt(data.stock),
        },
      });
      setSuccess(true);
      setTimeout(() => router.push("/products"), 1500);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex font-sans">
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-800 p-6 flex flex-col fixed h-full transition-all">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="text-xl font-bold dark:text-white">Slooze</span>
        </div>
        <nav className="space-y-2 flex-1">
          <Link
            href="/products"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Add New Product
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              Add a new items to your inventory
            </p>
          </div>
        </header>

        <div className="max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-300 dark:border-gray-800 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Product Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShoppingBag className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2"
                  placeholder="e.g. Premium Widget"
                />
              </div>
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">
                  Name is required
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Price ($)
                </label>
                <input
                  {...register("price", { required: true, min: 0 })}
                  type="number"
                  step="0.01"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3"
                  placeholder="0.00"
                />
                {errors.price && (
                  <span className="text-red-500 text-xs mt-1">
                    Valid price required
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Stock Level
                </label>
                <input
                  {...register("stock", { required: true, min: 0 })}
                  type="number"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3"
                  placeholder="0"
                />
                {errors.stock && (
                  <span className="text-red-500 text-xs mt-1">
                    Valid stock required
                  </span>
                )}
              </div>
            </div>

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg text-sm text-center">
                Product added successfully! Redirecting...
              </div>
            )}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm text-center">
                Error adding product. Please try again.
              </div>
            )}

            <div className="pt-4 flex items-center justify-end gap-3">
              <Link
                href="/products"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || success}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm shadow-md shadow-indigo-200 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={16} /> Save Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
