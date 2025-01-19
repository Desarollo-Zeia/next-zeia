'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import AverageCard from "./average"
import PaginationNumberComponent from "../pagination-number"

const RISK = {
  0: 'Riesgo muy bajo',
  1: 'Riesgo bajo',
  2: 'Riesgo medio bajo',
  3: 'Riesgo medio alto',
  4: 'Riesgo muy alto'
}

const RISK_COLOR = {
  0: 'bg-[#707070]',
  1: 'bg-[#38d276]',
  2: 'bg-[#00b7ca]',
  3: 'bg-[#ff39e5]',
  4: 'bg-[#ff0000]'
}



export default function TableComponent({ data, count, baselines }) {
  

  return (
    <div className='flex gap-4 mx-8'>
      <div className="flex flex-col">
        <AverageCard title={'Line base (promedio)'}>
          <div className="flex justify-between mt-2">
            <p>Valor</p>
            <p>{baselines[0].value}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p>Hora de línea base</p>
            <p>{baselines[0].time}</p>
          </div>
        </AverageCard>
        <AverageCard title={'Durante la jornada (promedio)'}>
          <div className="flex justify-between mt-2">
            <p>Valor</p>
            <p>{baselines[1].value}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p>Hora de la muestra</p>
            <p>{baselines[1].time}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p>Nivel de riesgo</p>
            <div className="flex gap-2 items-center">
              <div className={`w-4 h-4 rounded-full ${RISK_COLOR[baselines[1].risk]}`}></div>
              <p>{RISK[baselines[1].risk]}</p>
            </div>
          </div>
        </AverageCard>
        <AverageCard title={'Fin de la jornada (promedio)'}>
          <div className="flex justify-between mt-2">
            <p>Valor</p>
            <p>{baselines[2].value}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p>Hora de la muestra</p>
            <p>{baselines[2].time}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p>Nivel de riesgo</p>
            <div className="flex gap-2 items-center">
              <div className={`w-4 h-4 rounded-full ${RISK_COLOR[baselines[2].risk]}`}></div>
              <p>{RISK[baselines[2].risk]}</p>
            </div>
          </div>
        </AverageCard>
        {/* <AverageCard title={'Tiempo de monitoreo'}>
          <div className="flex justify-between mt-2">
            <p>Días</p>
            <p>dynamic</p>
          </div>
        </AverageCard> */}
        <AverageCard title={'Umbrales'}>
          <div className="flex justify-between mt-2">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-[#707070]"></div>
              <p>Riesgo muy bajo</p>
            </div>
            <p>+100 ppm</p>
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-[#38d276]"></div>
              <p>Riesgo bajo</p>
            </div>
            <p>+300 ppm</p>
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-[#00b7ca]"></div>
              <p>Riesgo medio bajo</p>
            </div>
            <p>+375 ppm</p>
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-[#ff39e5]"></div>
              <p>Riesgo medio alto</p>
            </div>
            <p>+400 ppm</p>
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-[#ff0000]"></div>
              <p>Riesgo muy alto</p>
            </div>
            <p>+800 ppm</p>
          </div>
        </AverageCard>
      </div>
      <Card className="w-full max-w-4xl mx-auto">
      {/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Sala de Conferencias A <br /> <span className="text-sm font-normal text-gray-500">Último datos recibidos</span></CardTitle>
        <Image src='https://utfs.io/f/y8yAFIxNrCH6xltOgtMQNWRFGe0pAcYU5bZ6nSwJOCPqIh4g' alt="face" width={64} height={64} className="object-fit"/>
      </CardHeader> */}
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead >Fecha</TableHead>
              <TableHead >Línea base</TableHead>
              <TableHead>Max. Riesgo</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Valor promedio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {
                data?.map((indicator, i) => 
                  ( 
                    <TableRow key={i}>
                      <TableCell >{indicator.date}</TableCell>
                      <TableCell >{indicator.base_line}</TableCell>
                      <TableCell>{indicator.maximum_risk_achieved}</TableCell>
                      <TableCell>{indicator.duration}</TableCell>
                      <TableCell >{indicator.max_value}</TableCell>
                    </TableRow>
                  )
                )
              }
          </TableBody>
        </Table>
      </CardContent>
      <PaginationNumberComponent count={count} itemsPerPage={10} />
      </Card>
    </div>
  )
}
