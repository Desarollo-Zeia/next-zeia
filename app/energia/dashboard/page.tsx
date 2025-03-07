import { consume, consumeGraph } from "@/app/sevices/energy/data"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { getCompanyData } from "@/app/lib/auth"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter"
import MeasurementTable from "@/app/ui/energia/consumo/measurement-table"
import MeasurementGraph from "@/app/ui/energia/consumo/measurement-graph"

interface PageProps {
  searchParams: {
    headquarter?: string
    panel?: string
    date_after?: string
    date_before?: string,
    unit?: string,
    indicator?: string
  }
}


export default async function Page({ searchParams }: PageProps) {
  const { companies } = await getCompanyData()

  const { headquarter, panel, date_after, date_before, unit, indicator } = await searchParams

  const readings = await consume({
    date_after,
    date_before,
    headquarterId: headquarter,
    panelId: panel,
    unit: unit,
    
  })

  const readingsGraph = await consumeGraph({
    // date_after: dateAfter,
    // date_before: dateBefore,
    headquarterId: headquarter,
    panelId: panel,
    indicador: indicator,

  })

  const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
        <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} />
        <DateRangePicker/>
      </FiltersContainer>
      <div className="flex">
        <MeasurementTable readings={readings}/>
        <MeasurementGraph data={readingsGraph} unit={unit}/>
      </div>

    </div>
  )
}

