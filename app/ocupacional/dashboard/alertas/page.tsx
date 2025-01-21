import { alerts } from "@/app/sevices/alerts/data";
import { detail } from "@/app/sevices/enterprise/data";
import { getRooms } from "@/app/sevices/filters/data";
import { roomGeneralData } from "@/app/sevices/readings/data";
import { Indicator, SearchParams } from "@/app/type";
import TableComponent from "@/app/ui/alertas/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";
import NoResultFound from "@/app/ui/no-result-found";
import { format } from "date-fns";

export default async function page({ searchParams } : SearchParams) {

    const { first_room: firstRoom} = await detail()
  
    const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date(), page = '1' } = await searchParams
  
    const currentFirstRoom = room ? room : firstRoom
    
    const rooms = await getRooms()
    const readings = await alerts({ roomId: currentFirstRoom, indicator, unit, date_after: format(date_after,"yyyy-MM-dd"), date_before: format(date_before, "yyyy-MM-dd"), page})
    const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom})

  return (
    <div>
        <FiltersContainer>
          <RoomSelect firstRoom={currentFirstRoom} rooms={rooms}/>
          <DatepickerRange/>
        </FiltersContainer>
        {
          readings?.count > 0 ? (
            <TableComponent data={readings.results} count={readings.count} generalRoomData={generalRoomData} indicator={indicator as Indicator} />
          ) : (
            <NoResultFound/>
          )
        }

    </div>
  )
}
