import group from '../../images/group.png';
import s from './lead.module.css';
import { BsAlarm, BsApple, BsArchive, BsAward, BsPlus } from 'react-icons/bs';
import { useRef } from 'react';
import { useEffect } from 'react';

const leadInfo = [
  { label: 'Client Name', value: 'lorem ipsum' },
  { label: 'Display Name', value: 'lorem ipsum' },
  { label: 'Mobile Number', value: 'lorem ipsum' },
  { label: 'Email ID', value: 'lorem ipsum' },
  { label: 'Pincode', value: 'lorem ipsum' },
  { label: 'State', value: 'lorem ipsum' },
  { label: 'City', value: 'lorem ipsum' },
  { label: 'Lead Source', value: 'lorem ipsum' },
  { label: 'Add by Admin/Employee', value: 'lorem ipsum' },
  { label: 'Note', value: 'lorem ipsum' },
  { label: 'Assign to employee', value: 'lorem ipsum' },
  { label: 'Group Name', value: 'lorem ipsum' },
];

const timelineArr = [
  {
    dt: 'Dec 2, 2021',
    tme: '01:49 PM',
    icn: <BsAlarm />,
    hdng: 'lorem ipsum',
    dsc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, iste voluptate. Earum expedita id numquam, deserunt vero inventore molestiae nulla.',
  },
  {
    dt: 'Dec 2, 2021',
    tme: '01:49 PM',
    icn: <BsAward />,
    hdng: 'lorem ipsum',
    dsc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, iste voluptate. Earum expedita id numquam, deserunt vero inventore molestiae nulla.',
  },
  {
    dt: 'Dec 2, 2021',
    tme: '01:49 PM',
    icn: <BsArchive />,
    hdng: 'lorem ipsum',
    dsc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, iste voluptate. Earum expedita id numquam, deserunt vero inventore molestiae nulla.',
  },
  {
    dt: 'Dec 2, 2021',
    tme: '01:49 PM',
    icn: <BsApple />,
    hdng: 'lorem ipsum last',
    dsc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, iste voluptate. Earum expedita id numquam, deserunt vero inventore molestiae nulla.',
  },
];
const Lead = () => {
  const lastActivityEl = useRef(null);
  useEffect(() => {
    if (lastActivityEl.current) lastActivityEl.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, []);
  return (
    <div className="container">
      <div className="beat_heading">
        <div className="beat_left">
          <div className="icon">
            <img src={group} alt="icon" />
          </div>
          <div className="title">Lead</div>
        </div>
      </div>
      <div className={s.leadInfoBox}>
        {leadInfo.map((data, i) => (
          <div className={s.leadInfo} key={i}>
            <label htmlFor="name">{data.label}</label>
            <div>{data.value}</div>
          </div>
        ))}
      </div>
      <div className={s.followUpDetails}>
        <h4>Follow Up Details</h4>
        <div className={s.detail}>
          <label>Last Follow Up</label>
          <div>12/02/2021</div>
        </div>
        <div className={s.detail}>
          <label>Next Follow Up</label>
          <div>12/02/2021</div>
        </div>
        <div className={s.detail}>
          <label>Status</label>
          <div>Overdue/Today/Upcoming</div>
        </div>
      </div>
      {/* timeline */}
      <section className={s.timelineSec}>
        <div className={s.tl_head}>
          <div className={s.tl_heading}>Timeline</div>
          <button className={s.addActBtn}>
            <BsPlus className={s.addIcon} /> <span className={s.btnlabel}>Add Activity</span>
          </button>
        </div>
        <div className={s.tl_container}>
          {/* activity */}
          {timelineArr.map(function (act, i) {
            const lastI = timelineArr.length - 1;
            return (
              <div className={s.activity} ref={i === lastI ? lastActivityEl : null}>
                <div className={s.actDT}>
                  <div className={s.date}>{act.dt}</div>
                  <div className={s.time}>{act.tme}</div>
                </div>
                <div className={s.iconBox}>
                  <div className={s.actIcon}>{act.icn}</div>
                </div>
                <div className={s.actContent}>
                  <h4>{act.hdng}</h4>
                  <p>{act.dsc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Lead;
