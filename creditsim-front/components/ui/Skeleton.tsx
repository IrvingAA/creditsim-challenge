import React from "react";
import { cn } from "../../lib/utils";
import { SkeletonProps } from "./types";

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-surface-200 dark:bg-surface-700 rounded",
        className
      )}
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 7,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-surface-100 dark:border-surface-800">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export const ScheduleTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 12 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="border-b border-surface-100 dark:border-surface-800">
          <td className="px-4 py-2 text-center">
            <Skeleton className="h-4 w-8 mx-auto" />
          </td>
          <td className="px-4 py-2">
            <Skeleton className="h-4 w-20 ml-auto" />
          </td>
          <td className="px-4 py-2">
            <Skeleton className="h-4 w-20 ml-auto" />
          </td>
          <td className="px-4 py-2">
            <Skeleton className="h-4 w-20 ml-auto" />
          </td>
          <td className="px-4 py-2">
            <Skeleton className="h-4 w-24 ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
};
