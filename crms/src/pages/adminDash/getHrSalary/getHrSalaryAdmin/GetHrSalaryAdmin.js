import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import style from "./GetHrSalaryAdmin.module.css";

function GetHrSalaryAdmin() {
  const { id } = useParams();
  const [getAttendanceHrById, setGetAttendenceHrById] = useState([]);
  const [filteredMonth, setFilteredMonth] = useState(getAttendanceHrById);

  const [selectedOption, setSelectedOption] = useState(null);
  const [salarys, setSalary] = useState("");
  const [getSalary, setGetSalary] = useState([]);
  const [currentMonthSalary, setCurrentMonthSalary] = useState("");
  const [daysWorked, setDaysWorked] = useState("");
  const [currentMonthLabels, setCurrentMonthLabel] = useState({});
  const [salaryEmploye, setSalaryEmploye] = useState([]);
  const [datas, setDatas] = useState({});

  const options = [
    { value: "01", label: "Jan" },
    { value: "02", label: "feb" },
    { value: "03", label: "march" },
    { value: "04", label: "April" },

    { value: "05", label: "May" },

    { value: "06", label: "June" },

    { value: "07", label: "July" },

    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    axios
      .get("https://accessible-mewing-iguana.glitch.me/getAttendanceHr")
      .then((result) => {
        // console.log(result.data, "perticular");
        const data = result.data;
        if (data) {
          const getAttendanceByIds = data.filter((item) => item.hrId === id);
          setGetAttendenceHrById(getAttendanceByIds);

          setFilteredMonth(getAttendanceByIds);
        }
        setGetSalary(result.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get("https://accessible-mewing-iguana.glitch.me/getHrById/" + id)
      .then((result) => {
        // console.log(result.data);
        const data = result.data;
        if (data) {
          setDatas(data);
          // console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  const currentDate = new Date();
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
  const currentDateOnly = formattedCurrentDate.split(":")[0];

  const monthsWith30Days = ["04", "06", "09", "11"];

  const monthsWith31Days = ["01", "03", "05", "07", "08", "10", "12"];

  const monthsWithLessThan30Days = ["02"];

  const handlefiterMonth = () => {
    if (!selectedOption) {
      setFilteredMonth(getAttendanceHrById);
      return;
    }

    const filterMonth = getAttendanceHrById.filter(
      (item) =>
        item.todayDate?.substring(3, 5) === selectedOption.value &&
        item.hrId === id
    );

    const firstUserSalary = datas?.salary;
    let curr = selectedOption.value;
    let days30, days31, days29;
    //console.log(curr, "curre");
    if (curr) {
      if (monthsWith31Days.includes(curr)) {
        days31 = monthsWith31Days.filter((item) => item === curr);
      }
      if (monthsWith30Days.includes(curr)) {
        days30 = monthsWith30Days.filter((item) => item === curr);
      }
      if (monthsWithLessThan30Days.includes(curr)) {
        days29 = monthsWithLessThan30Days.filter((item) => item === curr);
      }
    }

    //console.log(days29, days30, days31, "days");
    let sal;
    if (days30) {
      sal = Math.floor(firstUserSalary / 30);
    } else if (days31) {
      sal = Math.floor(firstUserSalary / 31);
    } else if (days29) {
      sal = Math.floor(firstUserSalary / 29);
    }

    //console.log(sal);

    const salary = filterMonth.length * sal;
    setSalary(salary);

    setFilteredMonth(filterMonth);
  };

  const calculateSalary = () => {
    // let currentMonth = new Date().toISOString().split("T")[0];
    // let currentMonth = "2023-09-08";
    // currentMonth = currentMonth.substring(5, 7);
    // console.log(getSalary, "bbbbbbbb");
    const filterSalary = getSalary.filter(
      (item) =>
        item.todayDate?.substring(3, 5) === currentDateOnly.substring(3, 5) &&
        item.hrId === id
    );

    const daysWorked = filterSalary.length;

    const firstUserSalary = datas?.salary;
    let curr = currentDateOnly.substring(3, 5);
    let days30, days31, days29;
    // console.log(curr, "curre");
    if (curr) {
      if (monthsWith31Days.includes(curr)) {
        days31 = monthsWith31Days.filter((item) => item === curr);
      }
      if (monthsWith30Days.includes(curr)) {
        days30 = monthsWith30Days.filter((item) => item === curr);
      }
      if (monthsWithLessThan30Days.includes(curr)) {
        days29 = monthsWithLessThan30Days.filter((item) => item === curr);
      }
    }

    //console.log(days29, days30, days31, "days");
    let sal;
    if (days30) {
      sal = Math.floor(firstUserSalary / 30);
    } else if (days31) {
      sal = Math.floor(firstUserSalary / 31);
    } else if (days29) {
      sal = Math.floor(firstUserSalary / 29);
    }

    const salary = daysWorked * sal;

    const currentMonthLabel = options.filter(
      (item) => item.value === currentDateOnly.substring(3, 5)
    );
    // console.log(currentMonthLabel, 95);
    setCurrentMonthLabel(currentMonthLabel);
    const salaryData = {
      id,
      daysWorked,
      salary,
    };
    setSalaryEmploye(salaryData);

    setDaysWorked(daysWorked);
    setCurrentMonthSalary(salary);
  };

  useEffect(() => {
    calculateSalary();
  }, [getSalary]);

  const generateExcel = () => {
    const userData = [];
    userData.push(salaryEmploye);
    // console.log(salaryEmploye,112);

    //console.log(userData, 115);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("UserData");

    // Adding headers
    const headerRow = worksheet.addRow([
      "User Name",
      "Salary",
      "Attended Days",
    ]);
    headerRow.font = { bold: true };

    // Adding data with styles
    userData.forEach((user) => {
      const row = worksheet.addRow([user.id, user.salary, user.daysWorked]);
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = { top: { style: "thin" }, bottom: { style: "thin" } };
      });
    });

    // Set column widths
    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    // Generate Excel file
    const excelBlob = workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "user_data.xlsx");
    });
  };

  return (
    <div className={style.container}>
      <div className={style.innerDiv}>
        <div className={style.firstSection}>
          <h1>Can see Hr Salary By Months</h1>
          <label>Select an option</label>
          <Select
            className={style.select}
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
          />

          <button onClick={handlefiterMonth}>submit</button>
        </div>
        <div className={style.result}>
          {getAttendanceHrById.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date Of Attendance</th>
                  <th>Employee User ID</th>
                  <th>Attendance ID</th>
                  {/* <th>Place of Work Value</th> */}
                  <th>Place of Work Full Form</th>
                  {/* <th>Employe Id</th> */}
                  <th>Employe firstName</th>
                  <th>Employe LasttName</th>
                </tr>
              </thead>
              <tbody>
                {filteredMonth.map((item) => (
                  <tr key={item._id}>
                    <td>{item.todayDate}</td>
                    <td>{item.hrHridId}</td>
                    <td>{item._id}</td>
                    {/* <td>{item.placeOfWorkValue}</td> */}
                    <td>{item.placeOfWorkFullForm}</td>
                    {/* <td>{item.hrId}</td> */}
                    <td>{item.hrName}</td>
                    <td>{item.hrLastName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Data Found</p>
          )}

          {/* <div>
        Your Monthly Salary counted by attendance
        <p>
          {salarys ? <p>Your Salary for this Months is {salarys}</p> : <p></p>}
        </p>
      </div> */}

          <div className={style.filterSalary}>
            <p>
              {salarys ? (
                <div>
                  <p>Hr Monthly Salary counted by attendance</p>
                  <p>
                    Hr Salary for {selectedOption.label} Months is {salarys}
                  </p>
                </div>
              ) : (
                <p></p>
              )}
            </p>
          </div>
        </div>
        <div className={style.current}>
          Hr current Month Salary counted by attendance
          <p>
            {daysWorked ? (
              <p>
                Hr worked {daysWorked} days in {currentMonthLabels[0].label}{" "}
                month
              </p>
            ) : (
              <p></p>
            )}
            {currentMonthSalary ? (
              <p>
                Hr Salary for {currentMonthLabels[0].label} Month is{" "}
                {currentMonthSalary}
              </p>
            ) : (
              <p></p>
            )}
          </p>
        </div>

        {/* <div>
        Your current Month Salary counted by attendance
        <p>
          {daysWorked ? (
            <p>Your worked this much {daysWorked} days in this month</p>
          ) : (
            <p></p>
          )}
          {currentMonthSalary ? (
            <p>Your Salary for this Months is {currentMonthSalary}</p>
          ) : (
            <p></p>
          )}
        </p> */}
        <div className={style.excelBtn}>
          <button className={style.excel} onClick={generateExcel}>
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
}

export default GetHrSalaryAdmin;
