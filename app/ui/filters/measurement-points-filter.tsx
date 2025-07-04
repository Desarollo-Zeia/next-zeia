'use client'
import React, { useTransition } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type MeasurementPoint = {
  id: number,
  name: string,
  is_active: string,
  channel: string
}


type Device = {
  id: number,
  name: string,
  dev_eui: string,
  model: string,
  phase_type: string,
  number_of_channels: number,
  measurement_points: MeasurementPoint[]
}

interface MeasurementPointResults { 
  results: Device[],
}

export default function MeasurementPointFilter({ measurementPoints, point } : { measurementPoints: MeasurementPointResults, point: string}) {

    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const pathname = usePathname()
    const { replace } = useRouter()

      const handlePointChange = (point: string) => {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        
        newParams.set('page', '1');
  
        if (point) {
          newParams.set('point', point);
        }
  
        if (point === 'none') {
          newParams.delete('point');
        }
  
        replace(`${pathname}?${newParams.toString()}`, { scroll: false });
      });
    };


  return (
    <div className='relative'>
      <Select
          onValueChange={handlePointChange} 
          disabled={isPending}
          value={point}
        >
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue placeholder="Puntos de medición" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {
              measurementPoints.results.map((device) => {
                return (
                  <React.Fragment key={device.id}>
                    <SelectLabel>{device.name}</SelectLabel>
                    {
                      device.measurement_points.map((point) => 
                        (
                          <SelectItem value={point.id.toString()} key={point.id} disabled={!point.is_active}>
                              {point.name}
                          </SelectItem>
                        )
                      )
                    }
                  </React.Fragment>
                )
              })
            }
            
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
