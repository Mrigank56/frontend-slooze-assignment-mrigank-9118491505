"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

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

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
}

interface ProductsData {
  products: Product[];
}

export default function ProductsPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const { loading, error, data } = useQuery<ProductsData>(GET_PRODUCTS);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState("all");

  const [removeProduct] = useMutation(
    gql`
      mutation RemoveProduct($id: Int!) {
        removeProduct(id: $id) {
          id
        }
      }
    `,
    {
      refetchQueries: [{ query: GET_PRODUCTS }],
    },
  );

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await removeProduct({ variables: { id } });
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product");
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const products = data?.products.filter((product: any) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStock === "all" ||
      (filterStock === "low" && product.stock < 10) ||
      (filterStock === "out" && product.stock === 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex font-sans">
      {/* Sidebar - Same as Dashboard but with active state */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-800 p-6 flex flex-col fixed h-full transition-all">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="text-xl font-bold dark:text-white">Slooze</span>
        </div>

        <nav className="flex-1 space-y-2">
          {user?.role === "MANAGER" && (
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400 font-medium transition-colors"
            >
              <ShoppingBag size={20} />
              Dashboard
            </Link>
          )}
          <Link
            href="/products"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium"
          >
            <ShoppingBag size={20} />
            Products
          </Link>
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-4">
          <button
            onClick={logout}
            className="w-full text-left text-red-500 hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Manage your inventory effectively
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/products/add"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
            >
              <Plus size={16} />
              Add Product
            </Link>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-300 dark:border-gray-800 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none dark:text-white"
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
            >
              <option value="all">All Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <p className="col-span-full text-center py-10 text-gray-600">
              Loading products...
            </p>
          ) : error ? (
            <p className="col-span-full text-center py-10 text-red-500">
              Error loading products.
            </p>
          ) : (
            products?.map((product: any) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={product.id}
                className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-300 dark:border-gray-800 hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="text-gray-500 hover:text-indigo-600 p-1"
                  >
                    <Edit size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-gray-500 hover:text-red-500 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4 flex items-center justify-center">
                  <ShoppingBag
                    className="text-gray-300 dark:text-gray-600"
                    size={40}
                  />
                </div>

                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-indigo-600 font-bold mb-3">
                  ${product.price}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span
                    className={`px-2 py-1 rounded-full ${product.stock > 10 ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"}`}
                  >
                    {product.stock} in stock
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
