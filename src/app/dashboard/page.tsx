"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, ShoppingBag, LogOut } from "lucide-react";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_PRODUCTS_COUNT = gql`
  query GetProductsCount {
    products {
      id
    }
  }
`;

interface ProductsCountData {
  products: { id: number }[];
}

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: productsData } =
    useQuery<ProductsCountData>(GET_PRODUCTS_COUNT);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else if (user?.role !== "MANAGER") {
      router.push("/products"); // Redirect Store Keeper to products
    }
  }, [isAuthenticated, user, router]);

  if (!user || user.role !== "MANAGER") return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col fixed h-full transition-all">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="text-xl font-bold dark:text-white">Slooze</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium transition-colors"
          >
            <ShoppingBag size={20} />
            Products
          </Link>
        </nav>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
          <button
            onClick={logout}
            className="w-full text-left text-red-500 hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Overview</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Welcome back, Manager
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 p-0.5">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.email}`}
                  alt="Avatar"
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
              Total Sales
            </h3>
            <p className="text-3xl font-bold dark:text-white">$24,500</p>
            <span className="text-green-500 text-xs font-medium">
              +12% from last month
            </span>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
              Active Orders
            </h3>
            <p className="text-3xl font-bold dark:text-white">45</p>
            <span className="text-orange-500 text-xs font-medium">
              5 pending approval
            </span>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
              Total Products
            </h3>
            <p className="text-3xl font-bold dark:text-white">
              {productsData?.products?.length || 0}
            </p>
            <span className="text-blue-500 text-xs font-medium">In stock</span>
          </div>
        </div>

        {/* Placeholder for chart or additional content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-64 flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </main>
    </div>
  );
}
