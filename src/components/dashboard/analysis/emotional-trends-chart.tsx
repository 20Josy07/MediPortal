"use client"

import { Line, LineChart, CartesianGrid, XAxis, Tooltip, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "Enero", positive: 186, negative: 80 },
  { month: "Febrero", positive: 305, negative: 200 },
  { month: "Marzo", positive: 237, negative: 120 },
  { month: "Abril", positive: 273, negative: 190 },
  { month: "Mayo", positive: 209, negative: 130 },
  { month: "Junio", positive: 214, negative: 140 },
]

const chartConfig = {
  positive: {
    label: "Positivas",
    color: "hsl(var(--chart-2))",
  },
  negative: {
    label: "Negativas",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function EmotionalTrendsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="positive"
          type="monotone"
          stroke="var(--color-positive)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="negative"
          type="monotone"
          stroke="var(--color-negative)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
