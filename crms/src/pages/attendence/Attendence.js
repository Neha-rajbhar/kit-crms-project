import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import GetAttendence from "./getAttendence/GetAttendence";
import { NavLink } from "react-router-dom";
import RegularizedAttendence from "./regularizedAttendence/RegularizedAttendence";
import style from "./Attendence.module.css";

function Attendence() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // const formattedDate = new Date(currentDate);
  // const formattedTime = formattedDate.toLocaleTimeString("en-US", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  //   hour12: true,
  // });

  const [employe, setEmploye] = useState(
    JSON.parse(localStorage.getItem("login")) || {}
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [attendence, setAttendence] = useState([]);
  const [checkAttendence, setCheckAttendence] = useState([]);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [sucess, setSucess] = useState("");

  const options = [
    { value: "wfh", label: "Work From Home" },
    { value: "wfo", label: "Work From Office" },
    { value: "wfcs", label: "Work From Client Side" },
  ];

  const fetchAttendence = async () => {
    const response = await axios.get(
      "https://accessible-mewing-iguana.glitch.me/getAttendence"
    );
    setCheckAttendence(response.data);

    // console.log(response.data, "hgfyergfndyutrhb");
  };

  useEffect(() => {
    fetchAttendence();
  }, []);

  const formatTime = (date) => {
    const day = date.getDate();
    const days = day < 10 ? "0" + day : day;
    const month = date.getMonth() + 1; // January is 0
    const months = month < 10 ? "0" + month : month;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    return `${days}-${months}-${year}:${formattedHours}-${minutes}-${seconds} ${ampm}`;
  };

  const formattedCurrentDate = formatTime(currentDate);

  const handleSave = async (e) => {
    e.preventDefault();

    const currentDateOnly = formattedCurrentDate.split(":")[0];

    // console.log(
    //   checkAttendence.filter((item) => item.employeId === employe[0]._id),
    //   "all attendence"
    // );

    // console.log(
    //   checkAttendence.filter(
    //     (item) => item.todayDate?.split(":")[0] === currentDateOnly
    //   ),
    //   "all date"
    // );
    const submitted = checkAttendence.filter(
      (item) =>
        item.todayDate?.split(":")[0] === currentDateOnly &&
        item.employeId === employe[0]._id
    );
    // console.log("formattedCurrentDate:", formattedCurrentDate);
    // console.log("submitted:", submitted);
    // console.log(employe, "submitted");

    if (submitted.length > 0) {
      // alert("You have already submitted attendance for today.");
      setMsg("You have already submitted attendance for today.");
      return;
    }

    const newAtt = [
      ...attendence,
      {
        todayDate: formattedCurrentDate,
        placeOfWorkValue: selectedOption.value,
        placeOfWorkFullForm: selectedOption.label,
        employeId: employe[0]._id,
        employeUserId: employe[0].userId,
        employeName: employe[0].firstName + " " + employe[0].lastName,
      },
    ];

    const newAttendence = {
      todayDate: formattedCurrentDate,
      placeOfWorkValue: selectedOption.value,
      placeOfWorkFullForm: selectedOption.label,
      employeId: employe[0]._id,
      employeUserId: employe[0].userId,
      employeName: employe[0].firstName,
      employeLastName: employe[0].lastName,
    };

    setAttendence(newAtt);
    localStorage.setItem("attendence", JSON.stringify(newAtt));

    try {
      // console.log(newAttendence, "backend");
      const response = await axios.post(
        "https://accessible-mewing-iguana.glitch.me/attendence",
        newAttendence
      );
      // console.log(response.data.message);
      if (response.data.status == false) {
        alert(response.data.message);
      } else {
        // alert("Attendence Marked");
        setSucess("Attendance Marked");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hanleShow = () => {
    setShow(!show);
  };

  return (
    <div className={style.main}>
      <p style={{ color: "red", fontSize: "20px" }}>{msg && msg}</p>
      <p style={{ color: "red", fontSize: "20px" }}>{sucess && sucess}</p>
      <div className={style.innerDiv}>
        <div className={style.formDiv}>
          <form className={style.form}>
            <h1>Mark Todays Attendance</h1>
            <label>Todays date</label>
            <input type="text" value={formattedCurrentDate} readOnly />

            <label>Select an option</label>
            <Select
              className={style.select}
              options={options}
              value={selectedOption}
              onChange={setSelectedOption}
            />

            <button onClick={handleSave}>submit</button>
          </form>

          {employe.map((item) => {
            return (
              <>
                <div className={style.nav}>
                  <NavLink
                    className={style.redirect}
                    to={`/getAttendence/${item._id}`}
                  >
                    Get Attendance List
                  </NavLink>
                </div>
              </>
            );
          })}
        </div>
        <div className={style.secondSection}>
          <button
            className={show ? style.hide : style.showBtn}
            onClick={hanleShow}
          >
            {show
              ? "Hide Regularized Attendance Form "
              : "Show Regularized Attendance Form"}
          </button>
          {show ? <RegularizedAttendence /> : ""}
        </div>
      </div>
    </div>
  );
}

export default Attendence;
