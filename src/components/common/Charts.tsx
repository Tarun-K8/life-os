import React from 'react';

// 1. Study Bar Chart
interface BarChartDataPoint {
  label: string;
  value: number; // in hours or minutes
  target?: number;
  highlight?: boolean;
}

interface StudyBarChartProps {
  data: BarChartDataPoint[];
  unit?: string;
  height?: number;
  target?: number;
}

export const StudyBarChart: React.FC<StudyBarChartProps> = ({
  data,
  unit = 'h',
  height = 140,
  target,
}) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-6 text-xs text-slate-500">No session data recorded yet.</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value), target || 0, 1);
  const chartHeight = height - 32;

  return (
    <div className="w-full">
      <div className="relative flex items-end justify-between gap-2 pt-4 pb-2" style={{ height }}>
        {/* Target Line */}
        {target !== undefined && target > 0 && (
          <div
            className="absolute left-0 right-0 border-b border-dashed border-indigo-400/40 pointer-events-none flex items-center justify-end"
            style={{ bottom: `${(target / maxValue) * chartHeight + 24}px` }}
          >
            <span className="text-[10px] text-indigo-300 bg-[#111522] px-1 font-mono -translate-y-2">
              Target: {target}{unit}
            </span>
          </div>
        )}

        {data.map((item, idx) => {
          const barHeightPct = Math.max(4, (item.value / maxValue) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-slate-200 text-[10px] py-0.5 px-1.5 rounded pointer-events-none font-mono whitespace-nowrap z-20">
                {item.value} {unit}
              </div>

              {/* Bar */}
              <div className="w-full max-w-[28px] h-full flex items-end">
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    item.highlight
                      ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-sm shadow-indigo-500/20'
                      : item.value > 0
                      ? 'bg-gradient-to-t from-slate-700 to-indigo-500/70 hover:to-indigo-400'
                      : 'bg-slate-800/40'
                  }`}
                  style={{ height: `${barHeightPct}%` }}
                />
              </div>

              {/* X Axis Label */}
              <span className="text-[10px] text-slate-400 mt-2 font-mono truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. Trend Line Chart (SVG based)
interface LineChartPoint {
  label: string;
  value: number;
}

interface MetricLineChartProps {
  series: {
    name: string;
    color: string;
    data: LineChartPoint[];
  }[];
  height?: number;
  min?: number;
  max?: number;
  unit?: string;
}

export const MetricLineChart: React.FC<MetricLineChartProps> = ({
  series,
  height = 140,
  min = 1,
  max = 10,
  unit = '',
}) => {
  const pointsCount = series[0]?.data.length || 0;
  if (pointsCount === 0) {
    return <div className="text-center py-6 text-xs text-slate-500">Log entries to view trend lines.</div>;
  }

  const svgWidth = 500;
  const svgHeight = height - 25;
  const paddingX = 20;
  const paddingY = 15;

  const getCoordinates = (points: LineChartPoint[]) => {
    return points.map((p, i) => {
      const x = paddingX + (i / Math.max(1, points.length - 1)) * (svgWidth - paddingX * 2);
      const normalizedY = (p.value - min) / Math.max(1, max - min);
      const y = svgHeight - paddingY - normalizedY * (svgHeight - paddingY * 2);
      return { x, y, value: p.value, label: p.label };
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 text-xs mb-2 text-slate-400">
        {series.map((s, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span>{s.name}</span>
          </div>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full overflow-visible"
        style={{ height }}
      >
        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((pct, i) => {
          const y = paddingY + pct * (svgHeight - paddingY * 2);
          const val = Math.round(max - pct * (max - min));
          return (
            <g key={i}>
              <line
                x1={paddingX}
                y1={y}
                x2={svgWidth - paddingX}
                y2={y}
                stroke="#1f263d"
                strokeDasharray="3 3"
              />
              <text x={0} y={y + 3} fill="#64748b" fontSize="9" fontFamily="monospace">
                {val}{unit}
              </text>
            </g>
          );
        })}

        {/* Series paths */}
        {series.map((s, sIdx) => {
          const coords = getCoordinates(s.data);
          const pathD = coords.reduce((acc, pt, i) => {
            return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
          }, '');

          return (
            <g key={sIdx}>
              {/* Path */}
              <path
                d={pathD}
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Points */}
              {coords.map((pt, pIdx) => (
                <circle
                  key={pIdx}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill="#111522"
                  stroke={s.color}
                  strokeWidth="2"
                  className="hover:r-5 transition-all"
                >
                  <title>{`${pt.label}: ${pt.value}${unit}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
      {/* X Labels */}
      <div className="flex justify-between px-2 text-[10px] text-slate-500 font-mono mt-1">
        <span>{series[0]?.data[0]?.label}</span>
        <span>{series[0]?.data[Math.floor(pointsCount / 2)]?.label}</span>
        <span>{series[0]?.data[pointsCount - 1]?.label}</span>
      </div>
    </div>
  );
};

// 3. Activity Calendar Heatmap
interface HeatmapProps {
  dates: string[]; // array of dates
  getValue: (date: string) => number; // intensity 0 - 4
  getTooltip?: (date: string) => string;
}

export const ActivityHeatmap: React.FC<HeatmapProps> = ({
  dates,
  getValue,
  getTooltip,
}) => {
  const getColorClass = (val: number) => {
    if (val === 0) return 'bg-[#181f33] border-[#222b45]';
    if (val === 1) return 'bg-indigo-950/80 border-indigo-900 text-indigo-300';
    if (val === 2) return 'bg-indigo-800/80 border-indigo-700 text-indigo-200';
    if (val === 3) return 'bg-indigo-600 border-indigo-500 text-white';
    return 'bg-emerald-500 border-emerald-400 text-white';
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-1.5 min-w-max">
        {dates.map((date, idx) => {
          const val = getValue(date);
          const tooltip = getTooltip ? getTooltip(date) : `${date}: ${val}`;
          return (
            <div
              key={idx}
              title={tooltip}
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-150 hover:scale-110 cursor-pointer ${getColorClass(
                val
              )}`}
            />
          );
        })}
      </div>
    </div>
  );
};

// 4. Circular Donut Progress
export const DonutProgress: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}> = ({
  percentage,
  size = 110,
  strokeWidth = 9,
  color = '#6366f1',
  label,
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e263d"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold font-mono text-slate-100">{label || `${Math.round(percentage)}%`}</span>
        {sublabel && <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{sublabel}</span>}
      </div>
    </div>
  );
};
