import React from 'react'
import { useGetAdmins } from '../../../../hooks/SuperAdmin/superAdminHooks'
import Table from '../../../../components/Reusable/Table';

const HostelsOwners = () => {

    const {data} = useGetAdmins();

    const columns = ["Name", "Email", "Hostels Owned", "Phone","Status"];
    const hostels = data?.map((element,index)=>{
        return {
            title:element.name,
            subtitle:element.email,
            helpertext:element.phone,
            location:"pune",
            status:"Active"
        }
    })

    // console.log(data)
   
  return (
    <div>
     <Table
      columns={columns}
      data={hostels}
     />
    </div>
  )
}

export default HostelsOwners
