import { useEffect, useRef } from 'preact/hooks';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
  type TooltipItem,
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend);

const ACCENT = '#f06a00';
const MUTED = '#9ca3af';
const BORDER = '#2a2d32';
const TEXT = '#e8e9ea';
const TOOLTIP_BG = '#1c1f23';
const MONO = "'IBM Plex Mono', monospace";

interface Props {
  labels: string[];
  mlSvc: number[];
  baseSvc: number[];
}

export default function WeatherImpactChart({ labels, mlSvc, baseSvc }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const chart = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'ML model',
            data: mlSvc,
            backgroundColor: ACCENT,
            borderRadius: 2,
            maxBarThickness: 36,
          },
          {
            label: 'baseline',
            data: baseSvc,
            backgroundColor: MUTED + '55',
            borderRadius: 2,
            maxBarThickness: 36,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutCubic' },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              color: MUTED,
              font: { family: MONO, size: 11 },
              boxWidth: 20,
              boxHeight: 2,
              padding: 16,
              usePointStyle: false,
            },
          },
          tooltip: {
            backgroundColor: TOOLTIP_BG,
            borderColor: BORDER,
            borderWidth: 1,
            titleColor: TEXT,
            bodyColor: MUTED,
            titleFont: { family: MONO, size: 11 },
            bodyFont: { family: MONO, size: 11 },
            padding: 10,
            displayColors: true,
            boxWidth: 10,
            boxHeight: 10,
            callbacks: {
              label: (ctx: TooltipItem<'bar'>) => ` ${ctx.dataset.label}: ${(ctx.parsed.y).toFixed(1)}%`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: 'transparent' },
            ticks: { color: MUTED, font: { family: MONO, size: 10 } },
          },
          y: {
            grid: { color: BORDER },
            border: { dash: [3, 3], color: 'transparent' },
            suggestedMin: 90,
            ticks: {
              color: MUTED,
              font: { family: MONO, size: 10 },
              callback: (v) => `${Number(v).toFixed(0)}%`,
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return (
    <div class="wi-chart">
      <div class="wi-canvas-wrap">
        <canvas ref={ref} />
      </div>
      <style>{`
        .wi-chart {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 1rem;
        }
        .wi-canvas-wrap {
          position: relative;
          height: 220px;
        }
      `}</style>
    </div>
  );
}
