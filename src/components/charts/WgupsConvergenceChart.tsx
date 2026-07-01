import { useEffect, useRef } from 'preact/hooks';
import {
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
  type TooltipItem,
} from 'chart.js';

Chart.register(LinearScale, LineController, LineElement, PointElement, Tooltip, Filler);

const ACCENT = '#f06a00';
const MUTED = '#9ca3af';
const BORDER = '#2a2d32';
const TEXT = '#e8e9ea';
const TOOLTIP_BG = '#1c1f23';
const MONO = "'IBM Plex Mono', monospace";

interface Props {
  generations: number[];
  scores: number[];
}

export default function WgupsConvergenceChart({ generations, scores }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const points = generations.map((g, i) => ({ x: g, y: scores[i] }));

    const chart = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'fitness score',
            data: points,
            borderColor: ACCENT,
            backgroundColor: ACCENT + '18',
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 5,
            pointBackgroundColor: ACCENT,
            tension: 0.2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutCubic' },
        plugins: {
          tooltip: {
            backgroundColor: TOOLTIP_BG,
            borderColor: BORDER,
            borderWidth: 1,
            titleColor: TEXT,
            bodyColor: MUTED,
            titleFont: { family: MONO, size: 11 },
            bodyFont: { family: MONO, size: 11 },
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (items: TooltipItem<'line'>[]) => `Generation ${items[0].parsed.x}`,
              label: (ctx: TooltipItem<'line'>) => ` fitness score: ${ctx.parsed.y.toFixed(1)}`,
            },
          },
        },
        scales: {
          x: {
            type: 'linear',
            grid: { color: BORDER },
            border: { dash: [3, 3], color: 'transparent' },
            ticks: { color: MUTED, font: { family: MONO, size: 10 }, callback: (v) => `${v}` },
            title: { display: true, text: 'generation', color: MUTED, font: { family: MONO, size: 10 } },
          },
          y: {
            grid: { color: BORDER },
            border: { dash: [3, 3], color: 'transparent' },
            ticks: { color: MUTED, font: { family: MONO, size: 10 } },
            title: { display: true, text: 'fitness score (lower is better)', color: MUTED, font: { family: MONO, size: 10 } },
          },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return (
    <div class="wgups-chart-panel">
      <div class="wgups-canvas-wrap">
        <canvas ref={canvasRef} />
      </div>
      <style>{`
        .wgups-chart-panel {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 1rem;
        }
        .wgups-canvas-wrap {
          position: relative;
          height: 220px;
        }
      `}</style>
    </div>
  );
}
