import React from 'react'

const ReportBottom = () => {
    return (
        <>
            <h2>Monthly exp report all</h2>
            <br />
            <div className="report_summery">
                <div className="report_summery_heading">
                    <h2>Report Summery</h2>
                </div>
                <div className="report_summery_details">
                    <div className="details_left">
                        <div className="detail_div">
                            <div className="detail_title">Total TA:</div>
                            <div className="detail">₹5,000</div>
                        </div>
                        <div className="detail_div">
                            <div className="detail_title">Total NIght Hault:</div>
                            <div className="detail">₹900</div>
                        </div>
                        <div className="detail_div">
                            <div className="detail_title">Total Submitted Account:</div>
                            <div className="detail">₹20,300</div>
                        </div>
                    </div>
                    <div className="details_right">

                        <div className="detail_div">
                            <div className="detail_title">Total DA:</div>
                            <div className="detail">₹2,000</div>
                        </div>
                        <div className="detail_div">
                            <div className="detail_title">Total Misc Amount:</div>
                            <div className="detail">₹600</div>
                        </div>
                        <div className="detail_div">
                            <div className="detail_title">Total Approved Account:</div>
                            <div className="detail">₹20,800</div>
                        </div>
                    </div>
                </div>
            </div>

            <h2>Monthly report single</h2>
            <br />
            <div className="report_summery">
                <div className="report_summery_details single_report">
                    <div className="details_left">
                        <div className="detail_div">
                            <div className="detail_title">Total Distance (Submitted):</div>
                            <div className="detail">90km</div>
                        </div>
                        <div className="detail_div">
                            <div className="detail_title">Total TA:</div>
                            <div className="detail">₹10.0000</div>
                        </div>
                        <div className="detail_div">
                            <div className="detail_title">Total Expense Submitted:</div>
                            <div className="detail">Lorem Ipsum</div>
                        </div>
                    </div>
                    <div className="details_right">
                        <div className="detail_div">
                            <div className="detail_title">TTotal Distance (Calculated):</div>
                            <div className="detail">₹70km</div>
                        </div>
                        <div className="detail_div">
                            <div className="detail_title">Total DA:</div>
                            <div className="detail">₹30,0000</div>
                        </div>
                        <div className="detail_div">
                            <div className="detail_title">Total Expense Approved:</div>
                            <div className="detail">Lorem Ipsum</div>
                        </div>
                    </div>
                </div>
            </div>

            <br />
            <div className="report_summery">
                <div className="pr_heading_top" style={{ backgroundColor: "#f575b4" }}>
                    <div className="details_left">
                        <div className="pr_single_detail_div">
                            <div className="detail_title">Total Expense:</div>
                            <div className="detail">₹900</div>
                        </div>
                        <div className="pr_single_detail_div">
                            <div className="detail_title">Total Expense:</div>
                            <div className="detail">₹900</div>
                        </div>
                        <div className="pr_single_detail_div">
                            <div className="detail_title">Total Expense:</div>
                            <div className="detail">₹900</div>
                        </div>
                        <div className="pr_single_detail_div">
                            <div className="detail_title">Total Expense:</div>
                            <div className="detail">₹900</div>
                        </div>
                    </div>
                    <div className="details_right">
                        <div className="pr_single_detail_div">
                            <div className="detail_title">Total Salary:</div>
                            <div className="detail">₹2,000</div>
                        </div>
                        <div className="pr_single_detail_div">
                            <div className="detail_title">Total Salary:</div>
                            <div className="detail">₹2,000</div>
                        </div>
                        <div className="pr_single_detail_div">
                            <div className="detail_title">Total Salary:</div>
                            <div className="detail">₹2,000</div>
                        </div>
                        <div className="pr_single_detail_div">
                            <div className="detail_title">Total Salary:</div>
                            <div className="detail">₹2,000</div>
                        </div>
                    </div>
                </div>
                <div className="pr_heading_bottom" style={{ backgroundColor: "#f575b4" }}>
                    <div className="details_left">
                        <div className="detail_div">
                            <div className="detail_title">Total Secondary Sale:</div>
                            <div className="detail">₹5,000</div>
                        </div>
                    </div>
                    <div className="details_right">
                        <div className="detail_div">
                            <div className="detail_title">Total Primary Sale:</div>
                            <div className="detail">₹2,000</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportBottom