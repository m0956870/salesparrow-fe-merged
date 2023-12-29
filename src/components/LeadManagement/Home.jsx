import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
//
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
//
import styled from '@emotion/styled';
import { Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { useState } from 'react';
import s from './lead.module.css';
import { AiOutlineAlignCenter } from 'react-icons/ai';
import { IoIosStarHalf } from 'react-icons/io';
import { VscTypeHierarchySub } from 'react-icons/vsc';
import { GrUnorderedList } from 'react-icons/gr';

const Home = () => {
  return (
    <div className={s.homeComp}>
      <div className={s.filterSelect}>
        <select className={s.spanFull}>
          <option value="">All List</option>
          <option value="">Option1</option>
          <option value="">Option2</option>
        </select>
        <select>
          <option value="">All Lists</option>
          <option value="">Option1</option>
          <option value="">Option2</option>
        </select>
        <select>
          <option value="">Lifetime</option>
          <option value="">Option1</option>
          <option value="">Option2</option>
        </select>
      </div>
      <div className={s.subTabsBox}>
        <HomeSubTabs />
      </div>
    </div>
  );
};

function HomeSubTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ marginInline: '2rem' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab icon={<AiOutlineAlignCenter size={30} />} {...a11yProps(0)} style={{ margin: 'auto' }} />
          <Tab icon={<IoIosStarHalf size={30} />} {...a11yProps(1)} style={{ margin: 'auto' }} />
          <Tab icon={<VscTypeHierarchySub size={30} />} {...a11yProps(2)} style={{ margin: 'auto' }} />
          <Tab icon={<GrUnorderedList size={30} />} {...a11yProps(3)} style={{ margin: 'auto' }} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <LeadStageTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <LeadPotentialTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <LeadCustomerGroupTab />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <LeadSourceListTab />
      </TabPanel>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function LeadStageTab() {
  const leadStageData = [
    {
      leadStage: 'Open',
      leads: 80,
      deal: 2423434,
      color: '#a143ff',
    },
    {
      leadStage: 'Connected',
      leads: 60,
      deal: 24234,
      color: '#fe7f0e',
    },
    {
      leadStage: 'Open',
      leads: 50,
      deal: 243234,
      color: '#28a9e2',
    },
    {
      leadStage: 'Open',
      leads: 40,
      deal: 234234,
      color: '#2ba02d',
    },
    {
      leadStage: 'Open',
      leads: 20,
      deal: 2423434,
      color: '#2846e2',
    },
  ];
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      // backgroundColor: "#fff",
      // borderRadius: "0.5rem",
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderBottom: "2px solid #00000011",
  }));
  return (
    <div className={s.leadStageTab}>
      <div className={s.chart}>
        {leadStageData
          .sort((a, b) => b.leads - a.leads)
          .map((data, i) => (
            <div
              className={s.stackBox}
              key={i}
              style={{
                backgroundColor: data.color,
                '--h': `${data.leads}px`,
              }}
            >
              {data.leadStage} : {data.leads}
            </div>
          ))}
      </div>
      <div>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Lead Stage</StyledTableCell>
              <StyledTableCell align="center">Leads</StyledTableCell>
              <StyledTableCell align="right">{'Deal(USD)'}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leadStageData?.map((row, i) => {
              return (
                <StyledTableRow key={i}>
                  <StyledTableCell align="left">
                    <div className={s.leadStageBox}>
                      <span style={{ backgroundColor: row.color }}></span>
                      <div>{row.leadStage}</div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.leads}</StyledTableCell>
                  <StyledTableCell align="right">{row.deal}</StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function LeadPotentialTab() {
  const leadPotData = [
    {
      leadPotential: 'High',
      leads: 3,
      color: '#2a88c0',
    },
    {
      leadPotential: 'Medium',
      leads: 1,
      color: '#e4a92f',
    },
    {
      leadPotential: 'Low',
      leads: 3,
      color: '#24ae6d',
    },
  ];
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      // backgroundColor: "#fff",
      // borderRadius: "0.5rem",
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderBottom: "2px solid #00000011",
  }));
  const chartData = {
    labels: leadPotData.map((v) => v.leadPotential),
    datasets: [
      {
        label: 'My First Dataset',
        data: leadPotData.map((v) => v.leads),
        backgroundColor: leadPotData.map((v) => v.color),
        hoverOffset: 3,
      },
    ],
  };

  return (
    <div className={s.leadPotentialTab}>
      <div className={s.chart}>
        <Doughnut data={chartData} />
        {/* <div className={s.centerDiv}>
          7 <br /> Total Leads
        </div> */}
      </div>
      <div>
        <div>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Lead Potential</StyledTableCell>
                <StyledTableCell align="right">Leads</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leadPotData?.map((row, i) => {
                return (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="left">
                      <div className={s.leadStageBox}>
                        <span style={{ backgroundColor: row.color }}></span>
                        <div>{row.leadPotential}</div>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.leads}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
function LeadCustomerGroupTab() {
  const leadCustGroupData = [
    {
      customerGroup: 'Spices Groups',
      leads: 13,
      color: '#e53b95',
    },
    {
      customerGroup: 'Spices Groups',
      leads: 32,
      color: '#3500d5',
    },
    {
      customerGroup: 'Spices Groups',
      leads: 9,
      color: '#2498cb',
    },
    {
      customerGroup: 'Spices Groups',
      leads: 9,
      color: '#913ce5',
    },
  ];

  const chartData = {
    labels: leadCustGroupData.map((v) => v.customerGroup),
    datasets: [
      {
        label: 'My First Dataset',
        data: leadCustGroupData.map((v) => v.leads),
        backgroundColor: leadCustGroupData.map((v) => v.color),
        hoverOffset: 3,
      },
    ],
  };


  // Table design 
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      // backgroundColor: "#fff",
      // borderRadius: "0.5rem",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderBottom: "2px solid #00000011",
  }));

  return (
    <div className={s.leadPotentialTab}>
      <div className={s.chart}>
        <Doughnut data={chartData} />
        {/* <div className={s.centerDiv}>
          7 <br /> Total Leads
        </div> */}
      </div>
      <div>
        <div>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Lead Source List</StyledTableCell>
                <StyledTableCell align="right">Leads</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leadCustGroupData?.map((row, i) => {
                return (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="left">
                      <div className={s.leadStageBox}>
                        <span style={{ backgroundColor: row.color }}></span>
                        <div>{row.customerGroup}</div>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.leads}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
function LeadSourceListTab() {
  const leadSourceListData = [
    {
      leadSource: 'All Leads',
      leads: 13,
      color: '#e53b95',
    },
    {
      leadSource: 'Field Sales',
      leads: 32,
      color: '#3500d5',
    },
    {
      leadSource: 'Phone Calls',
      leads: 12,
      color: '#2498cb',
    },
    {
      leadSource: 'Website',
      leads: 7,
      color: '#913ce5',
    },
    {
      leadSource: 'Whatsapp',
      leads: 20,
      color: '#55acff',
    },
  ];
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      // backgroundColor: "#fff",
      // borderRadius: "0.5rem",
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderBottom: "2px solid #00000011",
  }));
  const chartData = {
    labels: leadSourceListData.map((v) => v.leadSource),
    datasets: [
      {
        label: 'My First Dataset',
        data: leadSourceListData.map((v) => v.leads),
        backgroundColor: leadSourceListData.map((v) => v.color),
        hoverOffset: 3,
      },
    ],
  };

  return (
    <div className={s.leadPotentialTab}>
      <div className={s.chart}>
        <Doughnut data={chartData} />
        {/* <div className={s.centerDiv}>
          7 <br /> Total Leads
        </div> */}
      </div>
      <div>
        <div>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Lead Source List</StyledTableCell>
                <StyledTableCell align="right">Leads</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leadSourceListData?.map((row, i) => {
                return (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="left">
                      <div className={s.leadStageBox}>
                        <span style={{ backgroundColor: row.color }}></span>
                        <div>{row.leadSource}</div>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.leads}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
export default Home;
