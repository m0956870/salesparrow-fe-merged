import "./PartyDashboard.css";
import React, { useEffect, useState } from "react";
import group from "../../images/group.png";
import Top5Category from "../../charts/Top5Category";
import PartyPrimarySale from "../../charts/PartyPrimarySale";
import PartyMTD from "../../charts/PartyMTD";
import { getPartyDashboardData } from "../../api/dashboardAPI";
import { CircularProgress } from "@mui/material";
import isAllowed from "../../utils/isAllowed";
import { toast } from "react-toastify";
import { LIVE_DASHBOARD } from "../../constants";

const PartyDashboard = () => {
  const [activeTab, setactiveTab] = useState("mtd");

  const [isLoading, setisLoading] = useState(false);
  const [monthlyData, setmonthlyData] = useState()
  const [topDistributor, settopDistributor] = useState([])
  const [TopSS, setTopSS] = useState([])
  const [yearlyData, setyearlyData] = useState()


  useEffect(() => {
    getPartyDashboardDataFunc(activeTab)
  }, [activeTab])

  async function getPartyDashboardDataFunc() {
    setisLoading(true)

    if (!await isAllowed(LIVE_DASHBOARD)) {
      toast.error("Module is not purchased!")
      return setisLoading(false)
    }

    let { data } = await getPartyDashboardData(activeTab)
    if (!data.status) {
      return console.log("Some Error!")
    }

    if (activeTab === "mtd") {
      setmonthlyData(data.result)
      settopDistributor(data.result.top_ten_distributor)
      setTopSS(data.result.top_ten_ss)
    } else {
      setyearlyData(data.result)
      settopDistributor(data.result.top_ten_distributor)
      setTopSS(data.result.top_ten_ss)
    }

    setisLoading(false)
  }

  // console.log("monthlyData", monthlyData)
  // console.log("yearlyData", yearlyData)
  // console.log("topDistributor", topDistributor)
  // console.log("TopSS", TopSS)

  const getMonthlyMTDData = (monthlyData) => {
    let { mtd_order_amount, lmtd_order_amount, mtd_completed_order_amount, lmtd_completed_order_amount, mtd_pending_order_amount, lmtd_pending_order_amount, } = monthlyData
    return { mtd_order_amount, lmtd_order_amount, mtd_completed_order_amount, lmtd_completed_order_amount, mtd_pending_order_amount, lmtd_pending_order_amount, }
  }
  const getYearlyMTDData = (monthlyData) => {
    let { ytd_order_amount, lytd_order_amount, ytd_completed_order_amount, lytd_completed_order_amount, ytd_pending_order_amount, lytd_pending_order_amount, } = monthlyData
    return {
      mtd_order_amount: ytd_order_amount,
      lmtd_order_amount: lytd_order_amount,
      mtd_completed_order_amount: ytd_completed_order_amount,
      lmtd_completed_order_amount: lytd_completed_order_amount,
      mtd_pending_order_amount: ytd_pending_order_amount,
      lmtd_pending_order_amount: lytd_pending_order_amount,
    }
  }


  return (
    <div className="container">
      <div className="dash_heading">
        <div className="icon">
          <img src={group} alt="icon" />
        </div>
        <div className="title">Party's Dashboard</div>
      </div>

      <div className="tab_container">
        <div
          onClick={() => setactiveTab("mtd")}
          className={`${activeTab === "mtd" ? "tabs active" : "tabs"}`}
        >
          Monthly
        </div>
        <div
          onClick={() => setactiveTab("ytd")}
          className={`${activeTab === "ytd" ? "tabs active" : "tabs"}`}
        >
          Yearly
        </div>
        <div className="tabs active">
          <select className="select">
            <option value="State">Top 10 Distributors</option>
            {topDistributor.length !== 0 ? topDistributor?.map(dis => (
              <option key={dis.distributor_id} value={dis.distributor_id}>{dis.distributor_name}</option>
            )) : (
              <option disabled value="">No Distributor Found</option>
            )}
          </select>
        </div>
        <div className="tabs active">
          <select className="select">
            <option value="State">Top 10 SS</option>
            {TopSS.length !== 0 ? TopSS?.map(dis => (
              <option key={dis.distributor_id} value={dis.distributor_id}>{dis.distributor_name}</option>
            )) : (
              <option disabled value="">No SS Found</option>
            )}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div style={{ margin: "auto", }} >
          <CircularProgress />
        </div>
      ) : (
        <>
          {activeTab === "mtd" && monthlyData && (
            <>
              <div className="dis_table">
                <div className="first_row">
                  <div className="table_cell"></div>
                  <div className="table_cell">Total</div>
                  <div className="table_cell">Active</div>
                  <div className="table_cell">Primary Sale</div>
                  <div className="table_cell">Stock</div>
                  <div className="table_cell">Collection</div>
                  <div className="table_cell">Outstanding</div>
                  <div className="table_cell">Goods Return</div>
                </div>
                <div className="second_row">
                  <div className="table_cell table_head">Company Distributor</div>
                  <div className="table_cell">{monthlyData?.total_cd_count}</div>
                  <div className="table_cell">{monthlyData?.active_cd_count}</div>
                  <div className="table_cell">₹{monthlyData?.cd_primary_sales}</div>
                  <div className="table_cell">₹{monthlyData?.cd_stock}</div>
                  <div className="table_cell">₹{monthlyData?.cd_collection}</div>
                  <div className="table_cell">₹{monthlyData?.cd_outstanding}</div>
                  <div className="table_cell">₹{monthlyData?.cd_goods_return}</div>
                </div>
                <div className="third_row">
                  <div className="table_cell table_head">Super Distributor</div>
                  <div className="table_cell">{monthlyData?.total_sd_count}</div>
                  <div className="table_cell">{monthlyData?.active_sd_count}</div>
                  <div className="table_cell">₹{monthlyData?.sd_primary_sales}</div>
                  <div className="table_cell">₹{monthlyData?.sd_stock}</div>
                  <div className="table_cell">₹{monthlyData?.sd_collection}</div>
                  <div className="table_cell">₹{monthlyData?.sd_outstanding}</div>
                  <div className="table_cell">₹{monthlyData?.sd_goods_return}</div>
                </div>
                <div className="forth_row">
                  <div className="table_cell table_head">Super Stockiest</div>
                  <div className="table_cell">{monthlyData?.total_ss_count}</div>
                  <div className="table_cell">{monthlyData?.active_ss_count}</div>
                  <div className="table_cell">₹{monthlyData?.ss_primary_sales}</div>
                  <div className="table_cell">₹{monthlyData?.ss_stock}</div>
                  <div className="table_cell">₹{monthlyData?.ss_collection}</div>
                  <div className="table_cell">₹{monthlyData?.ss_outstanding}</div>
                  <div className="table_cell">₹{monthlyData?.ss_goods_return}</div>
                </div>
              </div>

              <div className="pd_container">
                <div className="party_sale">
                  <div className="party_sale_title">Total Sale:</div>
                  <div className="party_sale_div" style={{ background: "#55ef94" }}>
                    <div>Total Company Sale</div>
                    <div>₹{monthlyData?.total_sale}</div>
                  </div>
                  <div className="party_sale_div" style={{ background: "#3edfef" }}>
                    <div>Total Company Collection</div>
                    <div>₹{monthlyData?.total_collection}</div>
                  </div>
                  <div className="party_sale_div" style={{ background: "#fe7658" }}>
                    <div>Total Outstanding</div>
                    <div>₹{monthlyData?.total_outstanding}</div>
                  </div>
                </div>
              </div>

              <div className="pd_container primary_sale scroll_primary_sale">
                <h4 style={{ marginBottom: "1rem" }}>Primary Sale</h4>
                <PartyPrimarySale primarySale={monthlyData?.state_wise_primary_sale} />
              </div>

              <div className="pd_container" style={{ padding: 0 }}>
                <div className="rows attendance" style={{ width: "100%" }}>
                  <div className="head party_head">
                    Top 5 Category of the month (Secondary Sale)
                  </div>
                  <div className="body chart_div party_chart_div_2">
                    {/* <div className="chart_detail">
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#fe58d9" }}
                        ></div>
                        <h4>Total Sale:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#3edfef" }}
                        ></div>
                        <h4>Fancy Box:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#fe7658" }}
                        ></div>
                        <h4>Sabut Masala:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#587dfe" }}
                        ></div>
                        <h4>Fancy Box:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#55ef94" }}
                        ></div>
                        <h4>Hangers:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#fe58d9" }}
                        ></div>
                        <h4>Pouch:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#4eb548" }}
                        ></div>
                        <h4>Pouch:</h4>
                        <p>20,000</p>
                      </div>
                    </div> */}
                    <div id="chart">
                      <Top5Category categories={monthlyData?.catagory_wise_sec_sale} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pd_container" style={{ marginBottom: "2rem" }}>
                <h4>MTD/LMTD</h4>
                <div className="party_mtd">
                  <div className="party_mtd_chart">
                    <PartyMTD partyMTDData={getMonthlyMTDData(monthlyData)} />
                  </div>
                  <div className="party_mtd_divs">
                    <div className="mtd_orders">
                      <div style={{ fontWeight: 500 }}>MTD Orders</div>
                      <div>Total: {monthlyData?.mtd_orders_count}</div>
                      <div>Completed: {monthlyData?.mtd_completed_orders_count}</div>
                      <div>Pending: {monthlyData?.mtd_pending_orders_count}</div>
                    </div>
                    <div className="lmtd_orders">
                      <div style={{ fontWeight: 500 }}>LMTD Orders</div>
                      <div>Total: {monthlyData?.lmtd_orders_count}</div>
                      <div>Completed: {monthlyData?.lmtd_completed_orders_count}</div>
                      <div>Pending: {monthlyData?.lmtd_pending_orders_count}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "ytd" && yearlyData && (
            <>
              <div className="dis_table">
                <div className="first_row">
                  <div className="table_cell"></div>
                  <div className="table_cell">Total</div>
                  <div className="table_cell">Active</div>
                  <div className="table_cell">Primary Sale</div>
                  <div className="table_cell">Stock</div>
                  <div className="table_cell">Collection</div>
                  <div className="table_cell">Outstanding</div>
                  <div className="table_cell">Goods Return</div>
                </div>
                <div className="second_row">
                  <div className="table_cell table_head">Company Distributor</div>
                  <div className="table_cell">{yearlyData?.total_cd_count}</div>
                  <div className="table_cell">{yearlyData?.active_cd_count}</div>
                  <div className="table_cell">₹{yearlyData?.cd_primary_sales}</div>
                  <div className="table_cell">₹{yearlyData?.cd_stock}</div>
                  <div className="table_cell">₹{yearlyData?.cd_collection}</div>
                  <div className="table_cell">₹{yearlyData?.cd_outstanding}</div>
                  <div className="table_cell">₹{yearlyData?.cd_goods_return}</div>
                </div>
                <div className="third_row">
                  <div className="table_cell table_head">Super Distributor</div>
                  <div className="table_cell">{yearlyData?.total_sd_count}</div>
                  <div className="table_cell">{yearlyData?.active_sd_count}</div>
                  <div className="table_cell">₹{yearlyData?.sd_primary_sales}</div>
                  <div className="table_cell">₹{yearlyData?.sd_stock}</div>
                  <div className="table_cell">₹{yearlyData?.sd_collection}</div>
                  <div className="table_cell">₹{yearlyData?.sd_outstanding}</div>
                  <div className="table_cell">₹{yearlyData?.sd_goods_return}</div>
                </div>
                <div className="forth_row">
                  <div className="table_cell table_head">Super Stockiest</div>
                  <div className="table_cell">{yearlyData?.total_ss_count}</div>
                  <div className="table_cell">{yearlyData?.active_ss_count}</div>
                  <div className="table_cell">₹{yearlyData?.ss_primary_sales}</div>
                  <div className="table_cell">₹{yearlyData?.ss_stock}</div>
                  <div className="table_cell">₹{yearlyData?.ss_collection}</div>
                  <div className="table_cell">₹{yearlyData?.ss_outstanding}</div>
                  <div className="table_cell">₹{yearlyData?.ss_goods_return}</div>
                </div>
              </div>

              <div className="pd_container">
                <div className="party_sale">
                  <div className="party_sale_title">Total Sale:</div>
                  <div className="party_sale_div" style={{ background: "#55ef94" }}>
                    <div>Total Company Sale</div>
                    <div>₹{yearlyData?.total_sale}</div>
                  </div>
                  <div className="party_sale_div" style={{ background: "#3edfef" }}>
                    <div>Total Company Collection</div>
                    <div>₹{yearlyData?.total_collection}</div>
                  </div>
                  <div className="party_sale_div" style={{ background: "#fe7658" }}>
                    <div>Total Outstanding</div>
                    <div>₹{yearlyData?.total_outstanding}</div>
                  </div>
                </div>
              </div>

              <div className="pd_container primary_sale scroll_primary_sale">
                <h4 style={{ marginBottom: "1rem" }}>Primary Sale</h4>
                <PartyPrimarySale primarySale={yearlyData?.state_wise_primary_sale} />
              </div>

              <div className="pd_container" style={{ padding: 0 }}>
                <div className="rows attendance" style={{ width: "100%" }}>
                  <div className="head party_head">
                    Top 5 Category of the month (Secondary Sale)
                  </div>
                  <div className="body chart_div party_chart_div_2">
                    {/* <div className="chart_detail">
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#fe58d9" }}
                        ></div>
                        <h4>Total Sale:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#3edfef" }}
                        ></div>
                        <h4>Fancy Box:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#fe7658" }}
                        ></div>
                        <h4>Sabut Masala:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#587dfe" }}
                        ></div>
                        <h4>Fancy Box:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#55ef94" }}
                        ></div>
                        <h4>Hangers:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#fe58d9" }}
                        ></div>
                        <h4>Pouch:</h4>
                        <p>20,000</p>
                      </div>
                      <div className="bar_detail_party">
                        <div
                          className="color"
                          style={{ background: "#4eb548" }}
                        ></div>
                        <h4>Pouch:</h4>
                        <p>20,000</p>
                      </div>
                    </div> */}
                    <div id="chart">
                      <Top5Category categories={yearlyData?.catagory_wise_sec_sale} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pd_container" style={{ marginBottom: "2rem" }}>
                <h4>YTD/LYTD</h4>
                <div className="party_mtd">
                  <div className="party_mtd_chart">
                    <PartyMTD partyMTDData={getYearlyMTDData(yearlyData)} />
                  </div>
                  <div className="party_mtd_divs">
                    <div className="mtd_orders">
                      <div style={{ fontWeight: 500 }}>YTD Orders</div>
                      <div>Total: {yearlyData?.ytd_orders_count}</div>
                      <div>Completed: {yearlyData?.ytd_completed_orders_count}</div>
                      <div>Pending: {yearlyData?.ytd_pending_orders_count}</div>
                    </div>
                    <div className="lmtd_orders">
                      <div style={{ fontWeight: 500 }}>LYTD Orders</div>
                      <div>Total: {yearlyData?.lytd_orders_count}</div>
                      <div>Completed: {yearlyData?.lytd_completed_orders_count}</div>
                      <div>Pending: {yearlyData?.lytd_pending_orders_count}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PartyDashboard;
