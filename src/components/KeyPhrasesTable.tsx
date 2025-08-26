"use client";
import React, { useState } from "react";
import { useKeyPhrases } from "@/lib/hooks/useKeyPhrases";
import { RefreshCw, AlertCircle, Search, Trash2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Toast from "@/components/Toast";

export default function KeyPhrasesTable() {
  const {
    phrases,
    allPhrases,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    deletePhrase,
    deleteAllPhrases,
    refreshPhrases,
  } = useKeyPhrases();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as const,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDeletePhrase = async (id: number) => {
    const result = await deletePhrase(id);
    if (result.success) {
      setToast({
        show: true,
        message: "Key phrase deleted successfully",
        type: "success",
      });
    } else {
      setToast({
        show: true,
        message: "Failed to delete key phrase",
        type: "error",
      });
    }
  };

  const handleDeleteAll = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete ALL key phrases? This action cannot be undone."
      )
    ) {
      const result = await deleteAllPhrases();
      if (result.success) {
        setToast({
          show: true,
          message: "All key phrases deleted successfully",
          type: "success",
        });
      } else {
        setToast({
          show: true,
          message: "Failed to delete all key phrases",
          type: "error",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading key phrases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading key phrases</p>
          <button
            onClick={refreshPhrases}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Key Phrases ({phrases.length} of {allPhrases.length})
          </h3>
          <div className="flex items-center space-x-2">
            {allPhrases.length > 0 && (
              <Button
                onClick={handleDeleteAll}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
              </Button>
            )}
            <button
              onClick={refreshPhrases}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search key phrases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {phrases.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "No key phrases match your search."
                : "No key phrases submitted yet."}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seed Phrase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {phrases.map((phrase) => (
                <tr key={phrase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900 font-mono">
                    {phrase.seed_phrase}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(phrase.submitted_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeletePhrase(phrase.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete this key phrase"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
