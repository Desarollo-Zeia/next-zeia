"use client";
import React, { useTransition } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns"; // Adaptador para manejo de fechas
import { es } from 'date-fns/locale';
import { format } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ELECTRIC_PARAMETERS } from "@/app/utils/formatter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MeasurementGraph from "./measurement-graph";

// Registro de componentes en ChartJS
ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, zoomPlugin)

const energyToggleArray =  [
  { label: "Hora", value: "none" },
  { label: "Día", value: "day" },
  { label: "Semana", value: "week" },
  { label: "Mes", value: "month" },
]

const SimpleLineChart = ({ readingsGraph, category, indicator, last_by }) => {

    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
  // Se transforma el JSON para obtener un array de puntos de datos
  const dataPoints = readingsGraph.map((item) => ({
    x: new Date(item.first_reading), // Se convierte la fecha a objeto Date
    y: item.first_value,
    
  }))

  const handleFrequency = (frequency: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams)
    
      newParams.set('last_by', frequency);

      if (frequency) {
        newParams.set('last_by', frequency)
      }

      if (frequency === 'none') {
        newParams.delete('last_by')
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    });
  }

  // Estructura de los datos para el gráfico
  const data = {
    datasets: [
      {
        label: `${ELECTRIC_PARAMETERS[indicator as keyof typeof ELECTRIC_PARAMETERS].parameter}`, // Se utiliza el indicador como label
        data: dataPoints,
        fill: false,
        borderColor: "#00b0c7",
        stepped: true,
        tension: 0,
        pointRadius: 2, 
      },
    ],
  }

  // Opciones para configurar el gráfico, usando una escala de tiempo en el eje X
  const options = {
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day", // Puedes ajustar la unidad a 'hour', 'day', etc.
          displayFormats: {
            minute: "HH:mm",
            
          },
        },
        ticks: {
          callback: function (value) {
            console.log(value);
            const date = new Date(value)
            return format(date, "PP", { locale: es }) // Formato de fecha
           }
        },
        title: {
          display: false,
          text: "Hora de Lectura",
        },
        grid: {
          display: false,
          tickLength: 50
        },
      },
      y: {
        title: {
          display: false,
          text: "Valor",
        },
        grid: {
          display: false,
          tickLength: 50
        },
        ticks: {
          display: false
        }
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: "rgba(255, 255, 255)", // Cambia el fondo a un color claro
        titleColor: "#333", // Color para el título del tooltip
        bodyColor: "#333", // Color para el contenido del tooltip
        callbacks: {
          // Personalización del título del tooltip (ej. para formatear la fecha)
          title: function (tooltipItems) {
            // tooltipItems es un array de elementos (en este caso de un único punto)
            const date = new Date(tooltipItems[0].parsed.x);
            return format(date, "PP p", { locale: es });
          },
          // Personalización de la etiqueta del tooltip
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            // Se redondea el valor 'y' a dos decimales
            label += context.parsed.y.toFixed(2);
            return label;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x", // Permite desplazar (pan) solo en el eje X. También puedes usar "y" o "xy".
        },
        zoom: {
          wheel: {
            enabled: true, // Activa el zoom con la rueda del mouse
          },
          pinch: {
            enabled: true, // Activa el zoom en dispositivos táctiles
          },
          mode: "x", // Permite hacer zoom en el eje X.
        },
      },
      decimation: { 
        enabled: true,
        algorithm: 'lttb',
        samples: 20, // Aumenta este valor para conservar más detalles
        threshold: 5
      },
      legend: {
        display: false
      }
    }
  }

  return (
    <div className="flex-1 w-full h-lvh p-4 bg-white flex flex-col justify-center items-center relative">
      <ToggleGroup type="single"  defaultValue={last_by || 'none'} onValueChange={handleFrequency}   aria-label="Frequency" className="flex gap-2 top-0 mt-4 relative">
        {
          category !== 'energy' ? 
          (
            <ToggleGroupItem value="hour" className={"w-[120px] h-[40px] bg-[#00b0c7] text-white"} disabled>
              Hora
            </ToggleGroupItem>
          ) : (
            <>
              {
                energyToggleArray.map(times => (
                  <ToggleGroupItem
                    key={times.value}
                    value={times.value}
                    className={`w-[120px] h-[40px] ${times.value === last_by ? 'bg-[#00b0c7] text-white' : 'bg-gray-100 text-black'}`}
                  >
                    {
                      isPending ? 
                      (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      ) : (
                        <>
                          {times.label}
                        </>
                      )
                    }
                  </ToggleGroupItem>
                ))
              }
            </>
          )
        }
        
      </ToggleGroup>
      <h2 className="mb-4 font-semibold text-xl">Gráfica de {ELECTRIC_PARAMETERS[indicator as keyof typeof ELECTRIC_PARAMETERS].parameter}</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default SimpleLineChart;
