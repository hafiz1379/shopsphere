import React from "react";

const Loading = ({ type = "spinner", count = 4 }) => {
  if (type === "skeleton") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100"
          >
            <div className="aspect-square skeleton" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-16 skeleton" />
              <div className="h-5 w-3/4 skeleton" />
              <div className="h-3 w-20 skeleton" />
              <div className="h-6 w-24 skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-lg skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 skeleton" />
              <div className="h-3 w-1/4 skeleton" />
            </div>
            <div className="h-4 w-16 skeleton" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-gray-500 text-sm">Loading...</p>
    </div>
  );
};

export default Loading;
