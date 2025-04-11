import * as React from "react";

export function Progress({ value, max = 100 }) {
  return (
    <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className="bg-primaryPink h-full"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}