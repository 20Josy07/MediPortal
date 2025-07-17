"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { topic: "Autoestima", value: 18 },
  { topic: "Mecanismos de Defensa", value: 22 },
  { topic: "Depresión", value: 25 },
  { topic: "Relaciones Interpersonales", value: 35 },
  { topic: "Manejo de Estrés", value: 45 },
]

const chartConfig = {
  value: {
    label: "Menciones",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function MostFrequentTopicsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
      >
        <YAxis
          dataKey="topic"
          type="category"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          width={150}
        />
        <XAxis dataKey="value" type="number" hide />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="value" layout="vertical" radius={5} fill="var(--color-value)" />
      </BarChart>
    </ChartContainer>
  )
}
