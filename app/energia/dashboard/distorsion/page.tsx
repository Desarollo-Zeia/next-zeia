import { getCompanyData } from '@/app/lib/auth'
import { armonics, armonicsGraph } from '@/app/sevices/energy/distorsion/data'
import { getEnergyCompanyDetails } from '@/app/sevices/energy/enterprise/data'
import { SearchParams } from '@/app/type'
import CurrentChart from '@/app/ui/energia/distorsion/current-chart'
import CurrentVoltageToggle from '@/app/ui/energia/distorsion/current-voltage-toggle'
import VoltageChart from '@/app/ui/energia/distorsion/voltage-current'
import { DateRangePicker } from '@/app/ui/energia/filters/datepicker-energy-filter'
import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
import PanelsFilterEnergy from '@/app/ui/energia/filters/panels-energy-filter'
import FiltersContainer from '@/app/ui/filters/filters-container'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'
import Link from 'next/link'


export default async function page({ searchParams } : SearchParams) {

  const { companies } = await getCompanyData()
  
    const { headquarter = '1' , panel = '1',  date_after = format(new Date(), 'yyyy-MM-dd'), date_before = format(new Date(), 'yyyy-MM-dd'), data_type = 'current'} = await searchParams
  
    const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

    const armonicsReadings = await armonics({ headquarterId: headquarter, panelId: panel, date_after, date_before, data_type })
    const armonicsGraphReadings = await armonicsGraph({ headquarterId: headquarter, panelId: panel, date_after, date_before, data_type })

    console.log(armonicsReadings)

  return (
    <div className='w-full'>
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
        <PanelsFilterEnergy energyPanels={  energyDetails.energy_headquarters[0].electrical_panels} />
        <DateRangePicker/>
      </FiltersContainer>
      <div className="mx-6">
        <CurrentVoltageToggle type={data_type}>
          <Link href={"/energia/dashboard/distorsion/detail"}>
            <Button variant="secondary" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Ver detalles
            </Button>
          </Link>
        </CurrentVoltageToggle>
        <div>
          {
            data_type === 'current' ? 
            (
              <CurrentChart currentReadings={armonicsGraphReadings}/>
            ) : 
            (
              <VoltageChart voltageReadings={armonicsGraphReadings}/>
            )
          }
        </div>
        <div className='flex justify-start'>
          <div className='bg-white shadow-md p-4 flex flex-col gap-2'>
            <div className='flex justify-between gap-6 bg-slate-100 p-2 text-sm'>
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 bg-yellow-300 rounded-lg'></div>
                <p>Límite de distorsión en voltaje THD</p>
              </div>
              <p>8%</p>
            </div>
            <div className='flex justify-between gap-6 bg-slate-100 p-2 text-sm'>
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 bg-red-500 rounded-lg'></div>
                <p>Límite de distorsión en voltaje armónico</p>
              </div>
              <p>5%</p>
            </div>
            <div className='w-full flex justify-center p-2 items-center bg-slate-400 text-sm'>
              <p className='text-white'>¿Qué se mide?</p>
            </div>
          </div>
          {/* <div className='bg-purple-300 h-4 w-10'>
            
          </div> */}
        </div>
      </div>
    </div>
  )
}
