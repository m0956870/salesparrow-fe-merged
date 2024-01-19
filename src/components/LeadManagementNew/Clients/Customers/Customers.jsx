import { CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getCustomers } from '../../../../api/leadApi'
import CustomersTab from './CustomersTab'
import PartiesTab from './PartiesTab'

const Customers = ({ customerData }) => {
  // console.log("props", customerData.customerTab)

  const [isLoading, setisLoading] = useState(false)

  const [retailerData, setretailerData] = useState([])
  const [partiesData, setpartiesData] = useState([])

  useEffect(() => {
    if (customerData.customerTab !== "") getCustomersFunc()
  }, [customerData.customerTab])

  async function getCustomersFunc() {
    setisLoading(true)
    let { data } = await getCustomers({ type: "customers", sub_type: customerData.customerTab })
    // console.log("data", data)
    if (data.status) {
      if (customerData.customerTab === "retailers") setretailerData(data)
      else if (customerData.customerTab === "parties") setpartiesData(data)
      setisLoading(false)
    } else {
      console.log("Some Error!")
      setisLoading(false)
    }
  }


  return (
    <>
      {!customerData.customerTab ? (
        <div style={{ margin: "12rem auto" }} >
          <h2>Please Select Customer Type</h2>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div style={{ margin: "auto", }} >
              <CircularProgress />
            </div>
          ) : (
            <>
              {customerData.customerTab === "retailers" && <CustomersTab retailerData={retailerData} />}
              {customerData.customerTab === "parties" && <PartiesTab partiesData={partiesData} />}
            </>
          )}
        </>
      )}
    </>
  )
}

export default Customers