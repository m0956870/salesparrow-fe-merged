import React, { useEffect, useState } from 'react';
import group from '../../../images/group.png';
import SearchIcon from '@mui/icons-material/Search';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { tableCellClasses } from '@mui/material/TableCell';
import { useNavigate } from 'react-router-dom';
import { editLead, getLeads } from '../../../api/leadApi';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Pagination } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import getStateFunc from '../../../api/locationAPI';
import fetchAllEmployee from '../../../api/employeeAPI';
import { useContext } from 'react';
import { AdminContext } from '../../../App';
const LeadList = () => {
  const navigateTo = useNavigate();
  const [deletePopup, setdeletePopup] = useState(false);
  const [allState, setAllState] = useState([]);
  const [allEmp, setAllEmp] = useState([]);
  //filter states
  const [search, setSearch] = useState('');
  const [stateID, setStateID] = useState('');
  const [employee, setEmployee] = useState('');
  const [leadSource, setLeadSource] = useState('');

  const [selectedLead, setSelectedLead] = useState({});
  const [leadList, setLeadList] = useState([]);
  const [apiRes, setApiRes] = useState({ loading: false, error: '' });
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState(1);

  const { state } = useContext(AdminContext);
  console.log(state?.result?.country);
  useEffect(() => {
    getLeadList();
    getStateFunc().then((res) => setAllState(res.data.result));
  }, []);

  useEffect(() => {
    if (!stateID) {
      setAllEmp([]);
      return;
    }
    fetchAllEmployee({ state: stateID }).then((res) => setAllEmp(res.data.result));
  }, [stateID]);

  useEffect(() => {
    getLeadList(pageCount, stateID, leadSource, employee, search);
  }, [pageCount]);

  useEffect(() => {
    let ID = setTimeout(() => {
      getLeadList(pageCount, stateID, leadSource, employee, search);
    }, 800);
    return () => {
      clearTimeout(ID);
    };
  }, [search]);

  async function getLeadList(p, st, ls, emp, s) {
    const data = {
      lead_id: '',
      is_customer: '0',
      search: s ?? '',
      state: st ?? '',
      leadSource: ls ?? '',
      employee_id: emp ?? '',
      page: p ? String(p) : '1',
      limit: '5',
    };

    try {
      setApiRes({ loading: true, error: '' });
      const res = await getLeads(data);
      console.log(res.data);
      setLeadList(res.data.results);
      setpageLength(res.data.total_page);
      setApiRes({ loading: false, error: '' });
    } catch (error) {
      setApiRes({ loading: false, error: error.message });
      toast.error(error.message);
      console.log('get leads catch error', error.message);
    }
  }

  async function editLeadStatus(status, lead) {
    console.log(status, lead);
    const data = {
      lead_id: lead._id,
      status: status,
    };
    try {
      const res = await editLead(data);
      if (res.data.status) {
        getLeadList();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  async function deleteSelectedLead(lead) {
    const data = {
      lead_id: lead._id,
      is_delete: '1',
    };
    try {
      setApiRes({ loading: true, error: '' });
      setdeletePopup(false);
      const res = await editLead(data);
      if (res.data.status) {
        setApiRes({ loading: false, error: '' });
        getLeadList().finally(() => toast.success('Lead deleted successfully'));
      } else {
        setApiRes({ loading: false, error: res.data.message });
        toast.error(res.data.message);
      }
    } catch (error) {
      setApiRes({ loading: false, error: error.message });
      toast.error(error.message);
    }
  }
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: 'var(--main-color)',
      color: theme.palette.common.white,
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
  const leadStatus = ['Active', 'InActive'];
  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Lead List</div>
        </div>
        <div className="beat_right">
          <div className="search">
            <SearchIcon style={{ color: `var(--main-color)` }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
          </div>
          <div className="add_btn" onClick={() => navigateTo('/add_lead')}>
            Add New
          </div>
        </div>
      </div>

      <div className="tracking_tabs">
        <div className="tarcking_tab_left">
          <select value={stateID} onChange={(e) => setState(e.target.value)}>
            <option value="">All State</option>
            {allState?.map((st, i) => (
              <option value={st._id} key={i}>
                {st.name}
              </option>
            ))}
          </select>
          <select
            value={employee}
            onChange={(e) => {
              setEmployee(e.target.value);
            }}
          >
            <option value="">All Employee</option>
            {allEmp.map((emp) => (
              <option value={emp.id}>{emp.employeeName}</option>
            ))}
          </select>

          <select value={leadSource} onChange={(e) => setLeadSource(e.target.value)}>
            <option value="">All Lead Source</option>
            <option value="manual">Manual</option>
          </select>

          <div className="view_btn" onClick={() => getLeadList(pageCount, state, leadSource, employee)}>
            View
          </div>
        </div>
      </div>
      {/* loader */}
      {apiRes.loading && (
        <div
          style={{
            margin: 'auto',
          }}
        >
          <CircularProgress />
        </div>
      )}

      {/* table */}
      {!apiRes.loading && !apiRes.error && (
        <div className="device_table">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Lead Name</StyledTableCell>
                <StyledTableCell align="left">Mobile No.</StyledTableCell>
                <StyledTableCell align="left">Email ID</StyledTableCell>
                <StyledTableCell align="left">State</StyledTableCell>
                <StyledTableCell align="left">Lead Source</StyledTableCell>
                <StyledTableCell align="left">Assigned To</StyledTableCell>
                <StyledTableCell align="left">Last Follow Up</StyledTableCell>
                <StyledTableCell align="left">Lead Status</StyledTableCell>
                <StyledTableCell align="left">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            {/* <div style={{ margin: "0.5rem 0" }}></div> */}
            <TableBody>
              {leadList.map((row) => {
                const otherLeadStatus = leadStatus.filter((st) => st !== row.status);
                return (
                  <>
                    <StyledTableRow key={row.leadName}>
                      <StyledTableCell component="th" scope="row">
                        {row.leadName}
                      </StyledTableCell>
                      <StyledTableCell align="left" component="th" scope="row">
                        {row.mobileNumber}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.email}</StyledTableCell>
                      <StyledTableCell align="left">{row.sate_name}</StyledTableCell>
                      <StyledTableCell align="left">{row.leadSource}</StyledTableCell>
                      <StyledTableCell align="left">{row.emp_name}</StyledTableCell>
                      <StyledTableCell align="left">{row.last_follow_date || '-'}</StyledTableCell>

                      <StyledTableCell align="left">
                        {/* <div className={`${row.status === 'Active' ? 'active_beat' : 'inactive_beat'}`}>{row.status}</div> */}
                        <div className={`${row.status == 'Active' ? 'active_beat' : 'inactive_beat'}`}>
                          <select name="status" onChange={(e) => editLeadStatus(e.target.value, row)}>
                            <option value={row.status}>{row.status}</option>
                            {otherLeadStatus.map((st) => (
                              <option value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <BorderColorIcon
                          onClick={() => navigateTo('/edit_lead', { state: row })}
                          style={{
                            fontSize: '1rem',
                            color: 'var(--main-color)',
                            marginLeft: '0.5rem',
                          }}
                        />
                        <DeleteIcon
                          style={{
                            fontSize: '1rem',
                            color: 'red',
                            marginLeft: '0.5rem',
                          }}
                          className="emp_grp_icons"
                          onClick={() => {
                            setdeletePopup(true);
                            setSelectedLead(row);
                          }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
          {leadList.length ? (
            <div className="pagination">
              <Pagination count={pageLength} size="large" color="primary" onChange={(e, value) => setpageCount(value)} page={pageCount} />
            </div>
          ) : null}
          {!leadList.length ? <div className="no_data">No Data Found</div> : null}
        </div>
      )}

      <Dialog open={deletePopup} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth="true" onClose={() => setdeletePopup(false)}>
        <DialogTitle className="dialog_title">
          <div>Do you want to delete {selectedLead.leadName}?</div>
        </DialogTitle>
        <DialogContent className="cardpopup_content">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="employee_gl_popup" onClick={() => setdeletePopup(false)}>
              Cancel
            </div>
            <div className="employee_gl_popup_del" onClick={() => deleteSelectedLead(selectedLead)}>
              Delete
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default LeadList;
