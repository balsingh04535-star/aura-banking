import React, { useState, useRef } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../hooks/useHaptic';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

type TimeRange = '1W' | '1M' | '3M' | '6M' | '1Y';

interface DataPoint {
  label: string;
  sublabel: string;
  value: number;
}

const TIMEFRAME_DATA: Record<TimeRange, { total: number; points: DataPoint[] }> = {
  '1W': {
    total: 384.2,
    points: [
      { label: 'Mon', sublabel: '10 Aug', value: 45.0 },
      { label: 'Tue', sublabel: '11 Aug', value: 18.5 },
      { label: 'Wed', sublabel: '12 Aug', value: 94.2 },
      { label: 'Thu', sublabel: '13 Aug', value: 62.0 },
      { label: 'Fri', sublabel: '14 Aug', value: 112.5 },
      { label: 'Sat', sublabel: '15 Aug', value: 32.0 },
      { label: 'Sun', sublabel: '16 Aug', value: 20.0 },
    ],
  },
  '1M': {
    total: 2460.0,
    points: [
      { label: 'W1', sublabel: '1-7 Aug', value: 580.0 },
      { label: 'W2', sublabel: '8-14 Aug', value: 420.0 },
      { label: 'W3', sublabel: '15-21 Aug', value: 890.0 },
      { label: 'W4', sublabel: '22-31 Aug', value: 570.0 },
    ],
  },
  '3M': {
    total: 7240.5,
    points: [
      { label: 'Jun', sublabel: 'June 2026', value: 2100.0 },
      { label: 'Jul', sublabel: 'July 2026', value: 2680.5 },
      { label: 'Aug', sublabel: 'August 2026', value: 2460.0 },
    ],
  },
  '6M': {
    total: 14920.0,
    points: [
      { label: 'Mar', sublabel: 'Mar 2026', value: 2300.0 },
      { label: 'Apr', sublabel: 'Apr 2026', value: 2550.0 },
      { label: 'May', sublabel: 'May 2026', value: 2120.0 },
      { label: 'Jun', sublabel: 'Jun 2026', value: 2680.0 },
      { label: 'Jul', sublabel: 'Jul 2026', value: 2810.0 },
      { label: 'Aug', sublabel: 'Aug 2026', value: 2460.0 },
    ],
  },
  '1Y': {
    total: 29400.0,
    points: [
      { label: 'Q1', sublabel: 'Jan - Mar', value: 6800.0 },
      { label: 'Q2', sublabel: 'Apr - Jun', value: 7400.0 },
      { label: 'Q3', sublabel: 'Jul - Sep', value: 8200.0 },
      { label: 'Q4', sublabel: 'Oct - Dec', value: 7000.0 },
    ],
  },
};

function generatePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    
    const tension = 0.28;
    const dx = next.x - curr.x;
    
    const cp1x = curr.x + dx * tension;
    const cp1y = curr.y;
    const cp2x = next.x - dx * tension;
    const cp2y = next.y;

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
  }

  return path;
}

export const SpendingChart: React.FC = () => {
  const [range, setRange] = useState<TimeRange>('1M');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentDataset = TIMEFRAME_DATA[range];
  const points = currentDataset.points;
  const targetTotal = activeIndex !== null ? points[activeIndex].value : currentDataset.total;
  const animatedTotal = useAnimatedCounter(targetTotal, 350);

  const width = 340;
  const height = 140;
  const paddingX = 14;
  const paddingTop = 20;
  const paddingBottom = 22;

  const maxVal = Math.max(...points.map((p) => p.value)) * 1.15;
  const minVal = 0;
  const usableHeight = height - paddingTop - paddingBottom;

  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
    const y = paddingTop + usableHeight - ((p.value - minVal) / (maxVal - minVal)) * usableHeight;
    return { x, y, ...p };
  });

  const linePath = generatePath(coords);
  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x},${height - paddingBottom} L ${coords[0].x},${height - paddingBottom} Z`
    : '';

  const handleRangeChange = (r: TimeRange) => {
    if (range === r) return;
    triggerHaptic('light');
    setRange(r);
    setActiveIndex(null);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * width;

    let closestIndex = 0;
    let minDistance = Infinity;

    coords.forEach((c, idx) => {
      const dist = Math.abs(c.x - relativeX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeIndex) {
      triggerHaptic('light');
      setActiveIndex(closestIndex);
    }
  };

  const handlePointerLeave = () => {
    setActiveIndex(null);
  };

  const activePoint = activeIndex !== null ? coords[activeIndex] : null;

  return (
    <div
      ref={containerRef}
      className="bg-[#141618] rounded-3xl p-5 border border-white/10 space-y-4 select-none"
    >
      {/* Header with Counter & Timeframe Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-medium text-[#7E848D] uppercase tracking-wider">
            {activePoint ? activePoint.sublabel : `Total Outflow (${range})`}
          </span>
          <div className="text-2xl font-bold text-white tnum mt-0.5">
            {formatCurrency(animatedTotal, '€')}
          </div>
        </div>

        {/* Timeframe Control Pills (No Gradients) */}
        <div className="flex bg-[#0B0C0E] p-1 rounded-xl border border-white/10">
          {(['1W', '1M', '3M', '6M', '1Y'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                range === r
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#7E848D] hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Minimal SVG Chart Container */}
      <div className="relative w-full h-[140px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible cursor-crosshair touch-none"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {/* Subtle Horizontal Reference Grid Lines */}
          <line
            x1={paddingX}
            y1={paddingTop + usableHeight * 0.5}
            x2={width - paddingX}
            y2={paddingTop + usableHeight * 0.5}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeDasharray="2 2"
          />
          <line
            x1={paddingX}
            y1={height - paddingBottom}
            x2={width - paddingX}
            y2={height - paddingBottom}
            stroke="rgba(255, 255, 255, 0.08)"
          />

          {/* Area Fill - Flat Subtle Neutral */}
          <path
            d={areaPath}
            fill="rgba(255, 255, 255, 0.03)"
            className="transition-all duration-200"
          />

          {/* Main Stroke Path - Crisp Clean White Hairline */}
          <path
            d={linePath}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-200"
          />

          {/* Subtle Benchmark Nodes */}
          {coords.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={activeIndex === i ? 3.5 : 1.5}
              className={`transition-all duration-150 ${
                activeIndex === i ? 'fill-white' : 'fill-white/40'
              }`}
            />
          ))}

          {/* Active Hairline Scrubber Indicator */}
          {activePoint && (
            <g className="transition-all duration-100">
              <line
                x1={activePoint.x}
                y1={paddingTop}
                x2={activePoint.x}
                y2={height - paddingBottom}
                stroke="#FFFFFF"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="opacity-40"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                className="fill-[#141618] stroke-white stroke-1.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between px-2 text-[10px] font-medium text-[#7E848D]">
        {points.map((p, idx) => (
          <span
            key={idx}
            className={`transition-colors ${
              activeIndex === idx ? 'text-white' : 'text-[#7E848D]'
            }`}
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
};
