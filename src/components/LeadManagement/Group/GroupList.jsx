import React, { useEffect, useState } from 'react';
import group from '../../../images/group.png';

import SearchIcon from '@mui/icons-material/Search';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { tableCellClasses } from '@mui/material/TableCell';
import { useNavigate } from 'react-router-dom';
import { getGroups, updateGroup } from '../../../api/leadApi';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Pagination } from '@mui/material';
import { toast } from 'react-toastify';

const GroupList = () => {
  const navigateTo = useNavigate();
  const [deletePopup, setdeletePopup] = useState(false);
  const [apiRes, setApiRes] = useState({ loading: false, error: '' });
  const [search, setSearch] = useState('');

  const [selectedGroup, setSelectedGroup] = useState({});
  const [groupList, setGroupList] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState(1);
  useEffect(() => {
    getGroupList();
  }, []);
  useEffect(() => {
    getGroupList(pageCount, search);
  }, [pageCount]);

  useEffect(() => {
    let ID = setTimeout(() => {
      getGroupList(pageCount, search);
    }, 800);
    return () => {
      clearTimeout(ID);
    };
  }, [search]);

  async function getGroupList(p, s) {
    const data = {
      search: s ?? '',
      page: p ? String(p) : '1',
      limit: '5',
    };
    try {
      setApiRes({ loading: true, error: '' });
      const res = await getGroups(data);
      console.log(res.data);
      setGroupList(res.data.results);
      setpageLength(res.data.total_page);
      setApiRes({ loading: false, error: '' });
    } catch (error) {
      toast.error(error.message);
      setApiRes({ loading: false, error: error.message });
    }
  }
  async function deleteSelectedGroup(group) {
    const data = {
      leadgroup_id: group._id,
      is_delete: '1',
    };
    try {
      setApiRes({ loading: true, error: '' });
      setdeletePopup(false);
      const res = await updateGroup(data);
      if (res.data.status) {
        setApiRes({ loading: false, error: '' });
        getGroupList().finally(() => toast.success('Group deleted successfully'));
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

  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Group List</div>
        </div>
        <div className="beat_right">
          <div className="search">
            <SearchIcon style={{ color: `var(--main-color)` }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
          </div>
          <div className="add_btn" onClick={() => navigateTo('/create_group')}>
            Add New
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
                <StyledTableCell>Colour</StyledTableCell>
                <StyledTableCell align="left">Group Name</StyledTableCell>
                <StyledTableCell align="left">Leads</StyledTableCell>
                <StyledTableCell align="left">Customers</StyledTableCell>
                <StyledTableCell align="left">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            {/* <div style={{ margin: "0.5rem 0" }}></div> */}
            <TableBody>
              {groupList.map((row, i) => {
                return (
                  <React.Fragment key={i}>
                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        <div style={{ height: '1.5rem', aspectRatio: '1/1', backgroundColor: row.colours }}></div>
                      </StyledTableCell>
                      <StyledTableCell align="left" component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.leads ?? '-'}</StyledTableCell>
                      <StyledTableCell align="left">{row.customers ?? '-'}</StyledTableCell>
                      <StyledTableCell align="center">
                        <BorderColorIcon
                          onClick={() => navigateTo('/edit_group', { state: row })}
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
                            setSelectedGroup(row);
                          }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
          {groupList.length ? (
            <div className="pagination">
              <Pagination count={pageLength} size="large" color="primary" onChange={(e, value) => setpageCount(value)} page={pageCount} />
            </div>
          ) : null}
          {!groupList.length ? <div className="no_data">No Data Found</div> : null}
        </div>
      )}

      <Dialog open={deletePopup} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth="true" onClose={() => setdeletePopup(false)}>
        <DialogTitle className="dialog_title">
          <div>Do you want to delete {selectedGroup.name}?</div>
        </DialogTitle>
        <DialogContent className="cardpopup_content">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="employee_gl_popup" onClick={() => setdeletePopup(false)}>
              Cancel
            </div>
            <div className="employee_gl_popup_del" onClick={() => deleteSelectedGroup(selectedGroup)}>
              Delete
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default GroupList;
