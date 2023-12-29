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
import { editBanner, getBanners } from '../../../api/leadApi';
import { toast } from 'react-toastify';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Pagination } from '@mui/material';

const BannerList = () => {
  const navigateTo = useNavigate();
  const [deletePopup, setdeletePopup] = useState(false);
  const [apiRes, setApiRes] = useState({ loading: false, error: '' });

  const [search, setSearch] = useState('');

  const [selectedBanner, setSelectedBanner] = useState({});
  const [bannerList, setBannerList] = useState([]);
  const [pageCount, setpageCount] = useState(1);
  const [pageLength, setpageLength] = useState(1);
  useEffect(() => {
    getBannerList();
  }, []);

  useEffect(() => {
    getBannerList(pageCount, search);
  }, [pageCount]);

  useEffect(() => {
    let ID = setTimeout(() => {
      getBannerList(pageCount, search);
    }, 800);
    return () => {
      clearTimeout(ID);
    };
  }, [search]);

  async function getBannerList(p, s) {
    const data = {
      search: s ?? '',
      type: '',
      page: p ? String(p) : '1',
      limit: '5',
    };
    try {
      setApiRes({ loading: true, error: '' });
      const res = await getBanners(data);
      console.log(res.data);
      setBannerList(res.data.results);
      setpageLength(res.data.total_page);
      setApiRes({ loading: false, error: '' });
    } catch (error) {
      toast.error(error.message);
      setApiRes({ loading: false, error: error.message });
    }
  }

  async function deleteSelectedBanner(banner) {
    const data = {
      leadBanner_id: banner._id,
      is_delete: '1',
      type: banner.type,
      name: banner.name,
      date: banner.date,
      file: banner.file,
    };

    try {
      setApiRes({ loading: true, error: '' });
      setdeletePopup(false);
      const res = await editBanner(data);
      if (res.data.status) {
        setApiRes({ loading: false, error: '' });
        getBannerList().finally(() => toast.success('Banner deleted successfully'));
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
          <div className="title">Banner List</div>
        </div>
        <div className="beat_right">
          <div className="search">
            <SearchIcon style={{ color: `var(--main-color)` }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
          </div>
          <div className="add_btn" onClick={() => navigateTo('/add_banner')}>
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
                <StyledTableCell>Occassion Type</StyledTableCell>
                <StyledTableCell align="left">Banner Name</StyledTableCell>
                <StyledTableCell align="left">Date</StyledTableCell>
                <StyledTableCell align="left">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            {/* <div style={{ margin: "0.5rem 0" }}></div> */}
            <TableBody>
              {bannerList.map((row, i) => {
                return (
                  <React.Fragment key={i}>
                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        {row.type}
                      </StyledTableCell>
                      <StyledTableCell align="left" component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.date}</StyledTableCell>
                      <StyledTableCell align="center">
                        <BorderColorIcon
                          onClick={() => navigateTo('/edit_banner', { state: row })}
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
                            setSelectedBanner(row);
                          }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
          {bannerList.length ? (
            <div className="pagination">
              <Pagination count={pageLength} size="large" color="primary" onChange={(e, value) => setpageCount(value)} page={pageCount} />
            </div>
          ) : null}
          {!bannerList.length ? <div className="no_data">No Data Found</div> : null}
        </div>
      )}

      <Dialog open={deletePopup} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth="true" onClose={() => setdeletePopup(false)}>
        <DialogTitle className="dialog_title">
          <div>Do you want to delete {selectedBanner.leadName}?</div>
        </DialogTitle>
        <DialogContent className="cardpopup_content">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="employee_gl_popup" onClick={() => setdeletePopup(false)}>
              Cancel
            </div>
            <div className="employee_gl_popup_del" onClick={() => deleteSelectedBanner(selectedBanner)}>
              Delete
            </div>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default BannerList;
