import "./CardsList.css";
import React, { useState } from "react";
import group from "../../images/group.png";

import CardDialog from "./CardDialog";

const CardsList = () => {
  const [cardPopup, setcardPopup] = useState(false);
  const [currCardData, setcurrCardData] = useState();

  const cardLength = [];

  for (let i = 0; i < 20; i++) {
    cardLength.push(i);
  }

  const colorArray = [
    "#79eca8",
    "#fe7658",
    "#7f66ff",
    "#fe58d9",
    "#e82b6d",
    "#3edfef",
  ];

  const findColor = (i) => {
    const index = i % colorArray.length;
    // console.log(i, index)
    return index;
  };

  const addCardPopupFunc = () => {
    setcurrCardData();
    setcardPopup(true);
  };
  const editCardPopupFunc = () => {
    setcurrCardData({ data: "true" });
    setcardPopup(true);
  };

  return (
    <>
      <div className="container">
        <div className="beat_heading">
          <div className="beat_left">
            <div className="icon">
              <img src={group} alt="icon" />
            </div>
            <div className="title">Cards List</div>
          </div>
          <div className="beat_right">
            <div className="add_btn" onClick={() => addCardPopupFunc()}>
              Add New
            </div>
          </div>
        </div>

        <div className="card_container">
          {cardLength.map((i, data) => (
            <div className="card">
              <div className="card_body">
                <div
                  className="card_content"
                  style={{ backgroundColor: `${colorArray[findColor(i)]}` }}
                >
                  <div className="card_up">4542-xxxx-xxxx-1512</div>
                  <div className="card_down">
                    <div className="name">
                      <div className="card_title">Card Holder's Name</div>
                      <div className="card_detail">Lorem Ipsum</div>
                    </div>
                    <div className="exp_date">
                      <div className="card_title">Expiry Date</div>
                      <div className="card_detail">04/24</div>
                    </div>
                  </div>
                </div>
                <div className="card_actions">
                  <div className="edit" onClick={() => editCardPopupFunc()}>
                    Edit
                  </div>
                  <div className="delete">Delete</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CardDialog
        open={cardPopup}
        close={() => setcardPopup(!cardPopup)}
        currCardData={currCardData}
      />
    </>
  );
};

export default CardsList;
