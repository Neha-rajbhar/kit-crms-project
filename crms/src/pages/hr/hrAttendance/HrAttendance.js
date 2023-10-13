import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Select from "react-select";
import style from "./HrAttendance.module.css";
function HrAttendance() {
  const { id } = useParams();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedOption, setSelectedOption] = useState(null);

  const [employe, setEmploye] = useState(
    JSON.parse(localStorage.getItem("hr")) || {}
  );

  const [currentUser, setCurrentHr] = useState([]);
  const [allAttendanceHr, setAllAttendanceHr] = useState([]);

  const fetchAttendenceHr = async () => {
    const response = await axios.get(
      "https://accessible-mewing-iguana.glitch.me/getAttendanceHr"
    );

    setAllAttendanceHr(response.data);
  };

  useEffect(() => {
    fetchAttendenceHr();
  }, []);

  const fetchData = async () => {
    const response = await axios.get(
      "https://accessible-mewing-iguana.glitch.me/getHrById/" + id
    );
    setCurrentHr(response.data);
    localStorage.setItem("hr", JSON.stringify(response.data));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const options = [
    { value: "wfh", label: "Work From Home" },
    { value: "wfo", label: "Work From Office" },
    { value: "wfcs", label: "Work From Client Side" },
  ];

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
    //   allAttendanceHr.filter(
    //     (item) =>
    //       item.todayDate?.split(":")[0] === currentDateOnly &&
    //       item.hrId === currentUser._id
    //   ),
    //   "all date"
    // );

    const checkAttendence = allAttendanceHr.filter(
      (item) =>
        item.todayDate?.split(":")[0] === currentDateOnly &&
        item.hrId === currentUser._id
    );

    if (checkAttendence.length > 0) {
      alert("You Have already marked the attendence for today");
      return;
    }

    const newAttendence = {
      todayDate: formattedCurrentDate,
      placeOfWorkValue: selectedOption.value,
      placeOfWorkFullForm: selectedOption.label,
      hrId: currentUser._id,
      hrHridId: currentUser.hrId,
      hrName: currentUser.firstName,
      hrLastName: currentUser.lastName,
    };

    try {
      const response = await axios.post(
        "https://accessible-mewing-iguana.glitch.me/attendanceByHr",
        newAttendence
      );

      if (response.data.status === false) {
        alert(response.data.message);
      } else {
        alert(`Attendance Marked for ${formattedCurrentDate}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.innerDiv}>
        <h1>Mark Attendance for {formattedCurrentDate}</h1>
        <form className={style.form}>
          <label>
            Todays date <p>You Cannot change Date</p>
          </label>
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

        <NavLink
          className={style.redirect}
          to={`/getAttendanceHrById/${employe._id}`}
        >
          Get Attendance List
        </NavLink>
      </div>
    </div>
  );
}

export default HrAttendance;
