import { useEffect, useRef } from 'preact/hooks';
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  type TooltipItem,
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

const ACCENT = '#f06a00';
const MUTED = '#9ca3af';
const BORDER = '#2a2d32';
const TEXT = '#e8e9ea';
const TOOLTIP_BG = '#1c1f23';
const MONO = "'IBM Plex Mono', monospace";

interface Props {
  dates: string[];
  mlSvc: number[];
  baseSvc: number[];
  mlWaste: number[];
  baseWaste: number[];
}

function shortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}`;
}

export default function KitchenSyncChart({ dates, mlSvc, baseSvc, mlWaste, baseWaste }: Props) {
  const svcRef = useRef<HTMLCanvasElement>(null);
  const wasteRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!svcRef.current || !wasteRef.current) return;

    const labels = dates.map(shortDate);

    const tooltipDefaults = {
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
    };

    const axisDefaults = {
      grid: { color: BORDER },
      border: { dash: [3, 3], color: 'transparent' },
      ticks: { color: MUTED, font: { family: MONO, size: 10 } },
    };

    const svcChart = new Chart(svcRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'ML model',
            data: mlSvc,
            borderColor: ACCENT,
            backgroundColor: ACCENT + '18',
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: ACCENT,
            tension: 0.35,
            fill: true,
          },
          {
            label: 'baseline',
            data: baseSvc,
            borderColor: MUTED,
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 2,
            pointHoverRadius: 4,
            pointBackgroundColor: MUTED,
            tension: 0.35,
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
            ...tooltipDefaults,
            callbacks: {
              label: (ctx: TooltipItem<'line'>) =>
                ` ${ctx.dataset.label}: ${(ctx.parsed.y).toFixed(1)}%`,
            },
          },
        },
        scales: {
          x: axisDefaults,
          y: {
            ...axisDefaults,
            suggestedMin: 94,
            ticks: {
              ...axisDefaults.ticks,
              callback: (v) => `${Number(v).toFixed(0)}%`,
            },
          },
        },
      },
    });

    const wasteChart = new Chart(wasteRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'ML model',
            data: mlWaste,
            borderColor: ACCENT,
            backgroundColor: ACCENT + '18',
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: ACCENT,
            tension: 0.35,
            fill: true,
          },
          {
            label: 'baseline',
            data: baseWaste,
            borderColor: MUTED,
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 2,
            pointHoverRadius: 4,
            pointBackgroundColor: MUTED,
            tension: 0.35,
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
            ...tooltipDefaults,
            callbacks: {
              label: (ctx: TooltipItem<'line'>) =>
                ` ${ctx.dataset.label}: ${(ctx.parsed.y).toFixed(1)}%`,
            },
          },
        },
        scales: {
          x: axisDefaults,
          y: {
            ...axisDefaults,
            suggestedMin: 0,
            ticks: {
              ...axisDefaults.ticks,
              callback: (v) => `${Number(v).toFixed(0)}%`,
            },
          },
        },
      },
    });

    return () => {
      svcChart.destroy();
      wasteChart.destroy();
    };
  }, []);

  return (
    <div class="ks-chart-pair">
      <div class="ks-chart-panel">
        <div class="ks-chart-label">service level</div>
        <div class="ks-canvas-wrap">
          <canvas ref={svcRef} />
        </div>
      </div>
      <div class="ks-chart-panel">
        <div class="ks-chart-label">waste rate</div>
        <div class="ks-canvas-wrap">
          <canvas ref={wasteRef} />
        </div>
      </div>
      <style>{`
        .ks-chart-pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .ks-chart-panel {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 1rem;
        }
        .ks-chart-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.6875rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.75rem;
        }
        .ks-canvas-wrap {
          position: relative;
          height: 180px;
        }
        @media (max-width: 560px) {
          .ks-chart-pair {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
