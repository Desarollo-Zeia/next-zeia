'use client'
import IndicatorToggle from "../filters/indicators-toggle";
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader, 
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { UNIT_CONVERTED } from "@/app/utils/formatter";
import { UNIT_INDICATOR_THRESHOLD, UNIT_INDICATOR_THRESHOLD_AMBIENTAL } from "@/app/utils/threshold";
import { Indicator, Unit } from "@/app/type";
import { usePathname } from "next/navigation";

interface IndicatorStructure {
  indicator: string,
  value: string,
  unit: string,
  status: string,
  hours: string,
  date: string
}

interface IndicatorToogle {
  indicator: string,
  unit: string
}

interface RoomDataStructure {
  id: number,
  name: string,
  status: string,
  headquarter: {
    id: number,
    name: string
  }
  indicators_activated: IndicatorToogle[],
  indicators_pollutants: IndicatorToogle[],
  is_activated: boolean
}

interface ChartComponentProps {
  results: IndicatorStructure[]
  generalRoomData: RoomDataStructure
  indicator: Indicator,
  unit: Unit
}

  const chartConfig = {
    desktop: {
      color: "#00b0c7",
    },
    
  } satisfies ChartConfig
  

export default function ChartComponent({ results, generalRoomData, indicator, unit } : ChartComponentProps) {

  const { indicators_pollutants: indicators } = generalRoomData
   const pathname = usePathname()
  // eslint-disable-next-line @next/next/no-assign-module-variable
  const module = pathname.split('/')[1]

  let thresholdPointer
  let thresholds: number[] = []

  if (indicator === 'TVOC') {
    thresholdPointer = unit as Extract<Unit, 'PPB' | 'ICA'>
  } else {
    thresholdPointer = indicator
  }

  if (module === 'ocupacional') {
    thresholds = Object.values(UNIT_INDICATOR_THRESHOLD[thresholdPointer] || {}).filter(Boolean);
  } 
  
  if (module === 'ambiental') {
    thresholds = Object.values(UNIT_INDICATOR_THRESHOLD_AMBIENTAL[thresholdPointer] || {}).filter(Boolean);
  }

  const getStrokeColor = (index: number) => {
    const thresholdCount = thresholds?.length || 0;
    
    if (thresholdCount === 1) return '#ff0000'; // Único umbral
    if (thresholdCount === 2) return index === 0 ? '#ffd700' : '#ff0000'; // Moderado/Peligroso
    if (thresholdCount === 3) { // Moderado/Insalubre/Peligroso
      return ['#ffd700', '#ffa500', '#ff0000'][index];
    }
    return '#000'; // Caso por defecto
  };
  

  return (
    <Card className="w-full max-w-4xl mx-auto">
        <IndicatorToggle indicators={indicators} indicatorParam={indicator}/>
        <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
            <br/>
            <div className="w-full">
              <div className="text-xs font-medium mb-2">Umbrales:</div>
              <div className="flex flex-wrap gap-4">
              {thresholds?.map((thresholdValue, index) => {
    // Determinar color según posición y cantidad de umbrales
              const color = (() => {
                const total = thresholds.length;
                
                    if (total === 1) return '#ff0000'; // Único umbral rojo
                    if (total === 2) return index === 0 ? '#ffd700' : '#ff0000'; // Amarillo/Rojo
                    return ['#ffd700', '#ffa500', '#ff0000'][index]; // Amarillo/Naranja/Rojo para 3
                  })();

                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="font-bold" 
                        style={{ 
                          color,
                          width: '24px' 
                        }}
                      >
                        ---
                      </div>
                      <span className="font-normal">
                        {thresholdValue} {UNIT_CONVERTED[unit]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={results}
                margin={{
                left: 12,
                right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="hours"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                // tickFormatter={}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  hide={true}
                  tickMargin={8}
                  dataKey="value"
                  domain={[0, thresholds?.length ? Math.max(...thresholds) * 1.1 : 100]}
                />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel/>}
                />
                  {
                    thresholds?.map((threshold: number, i: number) => (
                      <ReferenceLine 
                        key={`${threshold}-${i}`} 
                        y={threshold}
                        stroke={getStrokeColor(i)}
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        isFront={true}
                      />
                    ))
                  }
                {/* <ThresholdLines thresholds={thresholds}/> */}
                {/* <ReferenceLine y={UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.bottom} stroke="yellow" strokeWidth={2} strokeDasharray="3 3" isFront={true}/>
                <ReferenceLine y={UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.center} stroke="orange" strokeWidth={2} strokeDasharray="3 3" isFront={true}/>
                <ReferenceLine y={UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.top} stroke="red" strokeWidth={2} strokeDasharray="3 3" isFront={true}/> */}
                <Line
                  dataKey="value" 
                  type="natural"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
            </LineChart>
            </ChartContainer>
        </CardContent>
      
    </Card>
  )
}
