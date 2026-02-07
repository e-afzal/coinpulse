"use client";

import { useEffect, useRef, useState, useTransition } from "react";

// CONSTANTS
import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from "@/constants";

// UTILS
import { convertOHLCData } from "@/lib/utils";

// THIRD PARTY PACKAGE
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";

// /ACTIONS
import { fetcher } from "@/lib/coingecko.actions";

const CandlestickChart = ({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = "daily",
}: CandlestickChartProps) => {
  // REFS
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  //   STATE
  const [period, setPeriod] = useState(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
  const [isPending, startTransition] = useTransition();

  //   FUNCTIONS
  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      const { days, interval } = PERIOD_CONFIG[selectedPeriod];

      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: "usd",
        days,
        // interval,
        precision: "full",
      });

      setOhlcData(newData ?? []);
    } catch (e) {
      console.error("Failed to fetch OHLCData", e);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

    startTransition(async () => {
      setPeriod(newPeriod);
      await fetchOHLCData(newPeriod);
    });
  };

  // USE EFFECTS
  //? Below effect done to load initial chart within container
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const showTime = ["daily", "weekly", "monthly"].includes(period);

    // From Chart API
    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });

    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData,
    );
    series.setData(convertOHLCData(convertedToSeconds));
    // Below done to fit chart into container upon initial load
    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeriesRef.current = series;

    // Below is done for RESIZING, resizing chart on window resize
    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container);

    // Cleanup
    return () => {
      observer.disconnect();
      // Removing chart to avoid memory leaks
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [height, period]);

  //  ? Below effect changes chart based on period selected
  useEffect(() => {
    // If chart no initialized, do nothing.
    if (!candleSeriesRef.current) return;

    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData,
    );

    const converted = convertOHLCData(convertedToSeconds);
    candleSeriesRef.current.setData(converted);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData, period]);

  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="button-group">
          <span className="text-sm mx-2 font-medium text-purple-100/50">
            Period:
          </span>
          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className={
                period === value ? "config-button-active" : "config-button"
              }
              onClick={() => handlePeriodChange(value)}
              disabled={isPending}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  );
};

export default CandlestickChart;
