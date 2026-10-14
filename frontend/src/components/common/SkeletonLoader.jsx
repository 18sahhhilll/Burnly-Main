import React from 'react';

/**
 * Base shimmer block
 */
export const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`bg-[#1E293B]/70 animate-pulse rounded ${className}`}
    {...props}
  />
);

/**
 * Skeleton for the 4-card MetricsOverview
 */
export const SkeletonMetrics = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="p-4 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-3"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-5 rounded-md" />
        </div>
        <Skeleton className="h-7 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Skeleton for Chart views (ChartsView / Cash Burn curves)
 */
export const SkeletonChart = ({ height = 'h-72' }) => (
  <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>
    </div>

    {/* Chart canvas simulation with grid lines and faux bars/curve */}
    <div className={`relative ${height} bg-[#0E1420]/80 rounded-lg p-4 flex flex-col justify-between overflow-hidden border border-[#222E42]/40`}>
      <div className="w-full border-b border-[#222E42]/30 pb-2 flex justify-between">
        <Skeleton className="h-2 w-8" />
        <Skeleton className="h-2 w-8" />
      </div>
      <div className="w-full border-b border-[#222E42]/30 pb-2 flex justify-between">
        <Skeleton className="h-2 w-8" />
        <Skeleton className="h-2 w-8" />
      </div>
      <div className="w-full border-b border-[#222E42]/30 pb-2 flex justify-between">
        <Skeleton className="h-2 w-8" />
        <Skeleton className="h-2 w-8" />
      </div>

      {/* Simulated animated wave bars */}
      <div className="absolute inset-x-8 bottom-3 top-10 flex items-end justify-between gap-1 sm:gap-2 opacity-25">
        {[40, 65, 55, 75, 45, 80, 60, 90, 70, 85, 65, 95, 50, 70, 60, 80].map((h, idx) => (
          <div
            key={idx}
            className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t animate-pulse"
            style={{
              height: `${h}%`,
              animationDelay: `${idx * 60}ms`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Skeleton for data tables (e.g. 6-month or 36-month projections)
 */
export const SkeletonTable = ({ rows = 6, cols = 5 }) => (
  <div className="bg-[#151D2A] border border-[#222E42] rounded-xl overflow-hidden">
    <div className="px-5 py-3.5 border-b border-[#222E42] flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
    <div className="p-4 space-y-3">
      {/* Header row */}
      <div className="grid grid-cols-5 gap-4 pb-2 border-b border-[#222E42]/50">
        {[...Array(cols)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
      {/* Table rows */}
      {[...Array(rows)].map((_, r) => (
        <div key={r} className="grid grid-cols-5 gap-4 py-2 border-b border-[#222E42]/20">
          {[...Array(cols)].map((_, c) => (
            <Skeleton
              key={c}
              className={`h-3 ${c === 0 ? 'w-16' : 'w-20 ml-auto'}`}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/**
 * Full page skeleton for Dashboard
 */
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
    <SkeletonMetrics />
    <SkeletonChart />
    <SkeletonTable rows={6} cols={5} />
  </div>
);

/**
 * Full page skeleton for Simulator
 */
export const SimulatorSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-7 w-56" />
      <Skeleton className="h-4 w-80" />
    </div>
    <SkeletonMetrics />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-5">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-7 space-y-6">
        <SkeletonChart />
        <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Full page skeleton for Projections table
 */
export const ProjectionsSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-7 w-56" />
      <Skeleton className="h-4 w-96" />
    </div>
    <SkeletonTable rows={12} cols={6} />
  </div>
);

/**
 * Full page skeleton for AI Intelligence Reports
 */
export const ReportSkeleton = () => (
  <div className="space-y-6">
    {/* Header bar */}
    <div className="p-5 bg-[#151D2A] border border-[#222E42] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-64" />
        </div>
      </div>
      <Skeleton className="h-9 w-36 rounded-lg" />
    </div>

    {/* Metric highlights */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>

    {/* Content block 1 */}
    <div className="p-6 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-11/12" />
      <Skeleton className="h-3 w-4/5" />
    </div>

    {/* Content block 2 (table / grid) */}
    <div className="p-6 bg-[#151D2A] border border-[#222E42] rounded-xl space-y-4">
      <Skeleton className="h-5 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 bg-[#0E1420] border border-[#222E42] rounded-lg space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
