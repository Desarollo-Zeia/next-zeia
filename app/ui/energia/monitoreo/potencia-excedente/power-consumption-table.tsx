import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ExceededThreshold {
  threshold: string
  power_exceeded: number
}

interface Indicator {
  id: number
  measurement_point_name: string
  power: number
  exceeded_thresholds: ExceededThreshold[]
}

interface Device {
  id: number
  dev_eui: string
  name: string
}

interface PowerData {
  created_at: string
  device: Device
  indicators: Indicator[]
}

interface ApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: PowerData[]
}

const apiData: ApiResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      created_at: "2025-03-10T11:57:09.175445-05:00",
      device: {
        id: 1,
        dev_eui: "24e124468d440660",
        name: "Device 1",
      },
      indicators: [
        {
          id: 19093,
          measurement_point_name: "Unidad 2",
          power: 95.885,
          exceeded_thresholds: [
            {
              threshold: "Potencia instalada",
              power_exceeded: 37.385000000000005,
            },
            {
              threshold: "Potencia contratada",
              power_exceeded: 44.785000000000004,
            },
            {
              threshold: "Potencia máxima",
              power_exceeded: 7.885000000000005,
            },
          ],
        },
      ],
    },
    {
      created_at: "2025-03-10T11:58:15.994193-05:00",
      device: {
        id: 1,
        dev_eui: "24e124468d440660",
        name: "Device 1",
      },
      indicators: [
        {
          id: 19097,
          measurement_point_name: "Unidad 2",
          power: 95.885,
          exceeded_thresholds: [
            {
              threshold: "Potencia instalada",
              power_exceeded: 37.385000000000005,
            },
            {
              threshold: "Potencia contratada",
              power_exceeded: 44.785000000000004,
            },
            {
              threshold: "Potencia máxima",
              power_exceeded: 7.885000000000005,
            },
          ],
        },
      ],
    },
  ],
}

// Helper function to format date and time from ISO string
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString)

  // Format date to Spanish format
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  const formattedDate = date.toLocaleDateString("es-ES", dateOptions)

  // Format time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  }
  const formattedTime = date.toLocaleTimeString("es-ES", timeOptions)

  // Capitalize first letter
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return { date: capitalizedDate, time: formattedTime }
}

// Function to determine status type based on threshold
const getStatusType = (threshold: string): "warning" | "error" | "default" => {
  if (threshold === "Potencia instalada") return "error"
  if (threshold === "Potencia contratada") return "warning"
  if (threshold === "Potencia máxima") return "warning"
  return "default"
}

export default function PowerConsumptionTable() {
  // Transform the API data into table rows
  const tableRows = apiData.results.flatMap((result) => {
    const { date, time } = formatDateTime(result.created_at)

    return result.indicators.flatMap((indicator) => {
      return indicator.exceeded_thresholds.map((threshold) => ({
        date,
        time,
        deviceName: result.device.name,
        measurementPoint: indicator.measurement_point_name,
        totalConsumption: `${indicator.power.toFixed(2)} kW`,
        excessConsumption: `${threshold.power_exceeded.toFixed(2)} kW`,
        status: {
          type: getStatusType(threshold.threshold),
          label: threshold.threshold,
        },
      }))
    })
  })

  return (
    <Card className="w-full p-6 flex flex-col gap-4">
      <div className="p-4 bg-slate-100">
        <p className="text-sm">Tabla general</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm font-medium text-muted-foreground">Fecha</TableHead>
              <TableHead className="text-sm font-medium text-muted-foreground">Hora</TableHead>
              <TableHead className="text-sm font-medium text-muted-foreground">Dispositivo</TableHead>
              <TableHead className="text-sm font-medium text-muted-foreground">Punto de medición</TableHead>
              <TableHead className="text-sm font-medium text-muted-foreground">Consumo total</TableHead>
              <TableHead className="text-sm font-medium text-muted-foreground">Consumo excedente</TableHead>
              <TableHead className="text-sm font-medium text-muted-foreground">Umbral excedido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow
                key={`${row.date}-${row.time}-${row.status.label}`}
                className={index % 2 === 0 ? "bg-muted/50" : ""}
              >
                <TableCell className="text-sm">{row.date}</TableCell>
                <TableCell className="text-sm">{row.time}</TableCell>
                <TableCell className="text-sm">{row.deviceName}</TableCell>
                <TableCell className="text-sm">{row.measurementPoint}</TableCell>
                <TableCell className="text-sm">{row.totalConsumption}</TableCell>
                <TableCell className="text-sm">{row.excessConsumption}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        row.status.type === "warning"
                          ? "bg-yellow-500"
                          : row.status.type === "error"
                            ? "bg-destructive"
                            : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm">{row.status.label}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

