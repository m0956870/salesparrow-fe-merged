import "./Sidebar.css";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

// Images
import logo_white from "../../images/logo_white.png";
import dashboard from "../../images/dashboard.png";
import dashboard_white from "../../images/dashboard_white.png";
import area from "../../images/area.png";
import area_white from "../../images/area_white.png";
import employees from "../../images/employees.png";
import employees_white from "../../images/employees_white.png";
import parties from "../../images/parties.png";
import parties_white from "../../images/parties_white.png";
import products from "../../images/products.png";
import products_white from "../../images/products_white.png";
import mapping from "../../images/mapping.png";
import mapping_white from "../../images/mapping_white.png";
import tracking from "../../images/tracking.png";
import tracking_white from "../../images/tracking_white.png";
import report from "../../images/report.png";
import report_white from "../../images/report_white.png";
import transactions from "../../images/transactions.png";
import transactions_white from "../../images/transactions_white.png";
import scheme from "../../images/scheme.png";
import scheme_white from "../../images/scheme_white.png";
import lead from "../../images/lead.png";
import lead_white from "../../images/lead_white.png";
import setting from "../../images/setting.png";
import setting_white from "../../images/setting_white.png";


const Sidebar = ({ open }) => {
  // console.log(open);
  const { route } = useParams();
  const navigate = useNavigate();

  const [activeMenu, setactiveMenu] = useState(1);

  const [menuItems, setmenuItems] = useState([
    {
      index: 1,
      icon: dashboard,
      icon_white: dashboard_white,
      title: "Dashboard",
      navigate: "dashboard",
      show: false,
      subItems: [
        { name: "Employee's Dashboard", link: "/dashboard" },
        { name: "Party's Dashboard", link: "/party_dashboard" },
        { name: "Profile", link: "/profile" },
        { name: "Sub Admins", link: "/subadmin_list" },
        { name: "All Roles", link: "/all_roles" },
        // { name: "Create Role", link: "/create_role" },
        { name: "Card Lists", link: "/cards_list" },
        { name: "Bank Details", link: "/bank_details" },
        { name: "Subscription Plan", link: "/subscription" },
        { name: "Purchased Plan", link: "/purchased_plan" },
      ],
    },
    {
      index: 2,
      icon: area,
      icon_white: area_white,
      title: "Area",
      navigate: "area",
      show: false,
      subItems: [
        { name: "Route", link: "/route" },
        // { name: "Create Route", link: "/create_route" },
        { name: "Beat", link: "/area" },
        // { name: "Add Beat", link: "/add_beat" },
        // { name: "Beat Plan", link: "/beat_plan" },
      ],
    },
    {
      index: 3,
      icon: employees,
      icon_white: employees_white,
      title: "Employees",
      navigate: "employees",
      show: false,
      subItems: [
        { name: "Employees", link: "/employees" },
        // { name: "Add Employees", link: "/add_employees" },
        { name: "Employee Config", link: "/employee_config" },
        { name: "Employee Grouping", link: "/employee_grouping" },
        { name: "Employee Grouping List", link: "/employee_grouping_list" },
        { name: "Employee Target", link: "/employee_target" },
        // { name: "Add Employee Target", link: "/add_employee_target" },
      ],
    },
    {
      index: 4,
      icon: parties,
      icon_white: parties_white,
      title: "Parties",
      navigate: "party",
      show: false,
      subItems: [
        // { name: "Parties", link: "/parties" },
        { name: "Party", link: "/party" },
        { name: "Customers", link: "/retailers" },
        // { name: "Add Party", link: "/add_party" },
        { name: "Party Grouping", link: "/party_grouping" },
        { name: "Party Grouping List", link: "/party_grouping_list" },
      ],
    },
    {
      index: 5,
      icon: products,
      icon_white: products_white,
      title: "Products",
      navigate: "products",
      show: false,
      subItems: [
        { name: "Brands", link: "/brands" },
        // { name: "Add Brand", link: "/add_brand" },
        { name: "Categories", link: "/product_category" },
        // { name: "Sub-Categories", link: "/product_subcategory" },
        { name: "Products", link: "/products" },
        // { name: "Add Product", link: "/add_product" },
        { name: "Units", link: "/unit" },
        { name: "Product Grouping", link: "/product_grouping" },
        { name: "Product Grouping List", link: "/product_grouping_list" },
        { name: "Price List", link: "/price_list" },
        // { name: "Focused Product", link: "/focused_product" },
        // { name: "Good Return Details", link: "/good_details" },
        // { name: "Product List", link: "/product_list" },
      ],
    },
    {
      index: 6,
      icon: mapping,
      icon_white: mapping_white,
      title: "Mapping",
      navigate: "mapping",
      show: false,
      subItems: [
        { name: "Employee Party Mapping", link: "/employee_party_mapping_listing" },
        { name: "SS Distributor Mapping", link: "/ss_distributor_mapping" },
        { name: "Assign Price List to State", link: "/state_pricelist_mapping" },
        { name: "Assign Price List to Party Group", link: "/party_group_pricelist_mapping" },
        { name: "Assign Product Group to Employee Group", link: "/employee_group_product_group_mapping" },
        { name: "Assign Party Group to Product Group", link: "/product_group_party_group_mapping" },

        // { name: "Employee Beat Mapping", link: "/employee_beat_mapping" },
        // { name: "Employee Beat Mapping Old", link: "/mapping" },
        // { name: "Mapping", link: "/mapping" },
        // { name: "Employee Distributer Group", link: "/employee_distributer_group" },
        // { name: "Distributor Beat Mapping", link: "/distributor_beat_mapping" },
        // { name: "Mapping Employee Group List", link: "/mapping_employee_group_list" },
      ],
    },
    {
      index: 7,
      icon: tracking,
      icon_white: tracking_white,
      title: "Tracking",
      navigate: "tracking",
      show: false,
      subItems: [
        { name: "Today Attendance Reports", link: "/today_attendance_report" },
        { name: "Day Summary", link: "/day_summary" },
        { name: "Device Status", link: "/device_status" },
        { name: "Live Tracking Reports", link: "/tracking" },
        { name: "Employee Travel Reports", link: "/employee_travel_reports" },
      ],
    },
    {
      index: 8,
      icon: report,
      icon_white: report_white,
      title: "Report",
      navigate: "monthly_attendance_report_all",
      show: false,
      subItems: [
        { name: "Monthly Attendance Reports (All Employees)", link: "/monthly_attendance_report_all" },
        // { name: "Monthly Attendance Reports (Single Employees)", link: "/monthly_attendance_report_single" },
        { name: "Daily Attendance Reports", link: "/daily_attendance_reports" },
        { name: "Monthly Expense Reports (All Employees)", link: "/mexp_report_all_employee" },
        // { name: "Monthly Expense Report (Single Employees)", link: "/mexp_report_single_employee", },
        { name: "Daily Expense Reports", link: "/daily_expense_reports", },
        { name: "Primary Sales Reports", link: "/primary_sales_report", },
        { name: "Complete Performance Reports (All Employees)", link: "/performence_report_all", },
        // { name: "Performance Reports (Single Employees)", link: "/performence_report_single", },
        { name: "Employee Party Wise Reports", link: "/employee_party_wise_reports", },
        { name: "SS Wise Reports", link: "/ss_wise_report", },
        { name: "Company Performence Reports", link: "/company_performence_report", },
        { name: "Salary Report", link: "/salary_reports", },
        { name: "Stock Statement Reports", link: "/stock_statement_reports", },
        { name: "Account Ledger", link: "/account_ledger", },
        { name: "Customer Feedback Reports", link: "/customer_feedback_reports", },
        // { name: "Activity Reports", link: "/activity_reports", },

        { name: "Monthly Market Visit Report (All Employee)", link: "/monthly_market_visit_all", },
        // { name: "Monthly Market Visit Report (Single Employee)", link: "/monthly_market_visit_single", },
        { name: "Monthly Sale Plan", link: "/monthly_sale_plan" },

        // { name: "Employee Dealer Visits", link: "/employee_dealer_visits" },
        // { name: "All Returned Goods", link: "/all_returned_goods" },
        // { name: "Company Current Stock", link: "/company_current_stock" },
        // { name: "Employees Attendence", link: "/employee_attendence" },
      ],
    },
    {
      index: 9,
      icon: transactions,
      icon_white: transactions_white,
      title: "Transactions",
      navigate: "invoices",
      show: false,
      subItems: [
        // { name: "Transactions", link: "/transactions" },
        { name: "Invoices", link: "/invoices" },
        { name: "Primary Orders", link: "/primary_orders" },
        { name: "Secondary Orders", link: "/secondary_orders" },
        { name: "Expense Approval", link: "/expense_approval" },
        { name: "Claim Approval", link: "/claim_approval", },
        // { name: "Good Return Voucher Approval", link: "/good_return_voucher_approval", },
        { name: "Good Return Approval", link: "/good_return_detail_approval", },
        { name: "Collection Approval", link: "/collection_approval", },
      ],
    },
    {
      index: 10,
      icon: scheme,
      icon_white: scheme_white,
      title: "Scheme Management",
      navigate: "scheme_report",
      show: false,
      subItems: [
        { name: "Scheme Report", link: "/scheme_report" },
        { name: "Scheme List", link: "/scheme_list" },
        { name: "Coupon Assign to Party", link: "/coupon_assign_to_party" },
      ],
    },
    {
      index: 11,
      icon: lead,
      icon_white: lead_white,
      title: "Lead Management",
      navigate: "lead_management",
      show: false,
      subItems: [
        { name: 'Home', link: '/lead_management_home' },
        { name: 'Clients', link: '/lead_management_clients' },
        { name: 'Content', link: '/lead_management_content' },
        { name: 'Followups', link: '/lead_management_followups' },

        // { name: 'Lead', link: '/lead' },
        // { name: 'Leads', link: '/leads' },
        // { name: 'Lead List', link: '/lead_list' },
        // { name: 'Add Lead', link: '/add_lead' },
        // { name: 'Banner List', link: '/banner_list' },
        // { name: 'Add Banner', link: '/add_banner' },
        // { name: 'Group List', link: '/group_list' },
        // { name: 'Create Group', link: '/create_group' },
      ],
    },
    {
      index: 12,
      icon: setting,
      icon_white: setting_white,
      title: "Settings",
      navigate: "settings",
      show: false,
      // subItems: [{ name: "Settings", link: "/settings" }],
      subItems: [
        { name: "Employee Salary Config", link: "/employee_salary_config" },
        { name: "Featured Selection", link: "/featured_selection" }
      ],
    },
  ]);

  const navigateFunc = (item) => {
    // navigate(`/${item.navigate}`);
    setactiveMenu(item.index);
  };

  const [open2, setOpen2] = React.useState(false);

  const handleClick = (item, index) => {
    // console.log(item);
    menuItems.map(item2 => {
      if (item2.index === item.index) {
        if (!item2.show) item2.show = true
        else item2.show = false
      } else {
        item2.show = false
      }
    })

    setmenuItems([...menuItems]);
    setOpen2(!open2);
  };

  return (
    <>
      <div id="sidebar">
        <div className={`${open ? "logo" : "logo logo_close"}`}>
          <img
            onClick={() => navigate("/dashboard")}
            src={logo_white}
            alt="salesparrow"
          />
        </div>
        <div className="menu_items">
          {menuItems.map((item, index) => (
            <div
              key={item.index}
              className="item"
              onClick={() => navigateFunc(item)}
            >
              <div className={`${open ? "image" : "image"}`}>
                <div
                  onClick={() => navigate(`/${item.navigate}`)}
                  className={`${activeMenu !== item.index && `inactive`}`}
                >
                  <img
                    src={`${activeMenu === item.index
                      ? `${item.icon_white}`
                      : `${item.icon}`
                      }`}
                    alt="icons"
                  />
                </div>
              </div>
              {/* <div className={`${open ? "title" : "close"}`}>
                  {item.title}
                </div> */}

              <ListItemButton
                className={`${open ? " title" : " close"}`}
                sx={{ display: "flex", padding: 0 }}
                onClick={() => handleClick(item, index)}
              >
                <ListItemText sx={{ color: "#fff" }} primary={item.title} />
                {item.show ? (
                  <ExpandLess sx={{ color: "#fff" }} />
                ) : (
                  <ExpandMore sx={{ color: "#fff" }} />
                )}
              </ListItemButton>
              <Collapse
                style={{ minWidth: "100%" }}
                in={item.show}
                timeout="auto"
                unmountOnExit
              >
                {/* <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 2 }}>
                          <ListItemText className="subMenu_text" primary="Sub Items" />
                        </ListItemButton>
                      </List> */}
                <div
                  className={`${open ? "subItems title" : "subItems close"}`}
                >
                  {item.subItems?.map((item, index) => (
                    <div
                      key={index}
                      className="subItems_item"
                      onClick={() => navigate(item.link)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </Collapse>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
