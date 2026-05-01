"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartEntry {
  month: string;
  label: string;
  count: number;
}

interface ReleasesChartProps {
  chartData: ChartEntry[];
  recentCount: number;
  totalCount: number;
}

export function ReleasesChart({
  chartData,
  recentCount,
  totalCount,
}: ReleasesChartProps) {
  return (
    <div className="p-4 bg-card border border-border rounded-lg space-y-4">
      <div className="flex gap-6">
        <div>
          <p className="text-2xl font-bold font-heading tabular-nums tech-gradient-text">
            {recentCount}
          </p>
          <p className="text-xs text-muted-foreground">直近30日のリリース</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-2xl font-bold font-heading tabular-nums tech-gradient-text">
            {totalCount}
          </p>
          <p className="text-xs text-muted-foreground">累計リリース</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={chartData} barSize={14} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-popover border border-border rounded px-2 py-1 text-xs shadow-sm">
                  <p className="font-medium">{label}</p>
                  <p className="text-muted-foreground">{payload[0].value} リリース</p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="count"
            fill="oklch(0.6 0.18 210)"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
