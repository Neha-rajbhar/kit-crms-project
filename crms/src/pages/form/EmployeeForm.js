import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./EmployeeForm.module.css";

function EmployeeForm() {
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [email, setEmail] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [highestQualification, setHighestQualification] = useState("");
  const [adharCard, setAdharCard] = useState("");
  const [panCard, setPanCard] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [salary, setSalary] = useState("");
  const [employe, setEmploye] = useState([]);

  const [fieldError, setFieldError] = useState({});

  const [lastUserIdCount, setLastUserIdCount] = useState(0);

  useEffect(() => {
    fetchLastUserIdCount();
  }, []);
  //https://accessible-mewing-iguana.glitch.me/
  const fetchLastUserIdCount = async () => {
    try {
      const response = await axios.get(
        "https://accessible-mewing-iguana.glitch.me/generate-userid"
      );
      setLastUserIdCount(response.data.lastUserIdCount);
    } catch (error) {
      console.error("Error fetching last user ID count:", error);
    }
  };

  const generateUserId = async () => {
    try {
      const newUserIdCount = lastUserIdCount + 1;
      const newUserId = `VIBRANT${newUserIdCount}`;
      setUserId(newUserId);
      setLastUserIdCount(newUserIdCount);

      await fetchLastUserIdCount();
    } catch (error) {
      console.error("Error generating userId:", error);
    }
  };

  const pass = (newUserId) => {
    if (firstName && personalPhone) {
      const newPass = firstName.toUpperCase() + personalPhone.substring(6);
      newUserId.substring(6);
      setPassword(newPass);
    } else {
      // alert("Please enter both first name and last name.");
    }
  };

  useEffect(() => {
    pass(userId);
  }, [userId]);

  useEffect(() => {
    pass(userId);
  }, [firstName, personalPhone]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(
      firstName,
      lastName,
      dateOfBirth,
      personalPhone,
      alternatePhone,
      email,
      companyEmail,
      highestQualification,
      adharCard,
      panCard,
      address,
      salary
    );

    setFieldError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          "https://accessible-mewing-iguana.glitch.me/submit-employee",
          {
            userId,
            firstName,
            lastName,
            dateOfBirth,
            personalPhone,
            alternatePhone,
            email,
            companyEmail,
            highestQualification,
            adharCard,
            panCard,
            password,
            address,
            salary,
          }
        );

        //console.log("Employee added:", response.data);

        if (response.data.status === false) {
          alert(response.data.message);
        } else {
          alert("Employee added successfully!");
        }

        setUserId("");
        setFirstName("");
        setLastName("");
        setDateOfBirth("");
        setPersonalPhone("");
        setAlternatePhone("");
        setEmail("");
        setCompanyEmail("");
        setHighestQualification("");
        setAdharCard("");
        setPanCard("");
        setPassword("");
        setAddress("");
        setSalary("");
        await fetchLastUserIdCount();
      } catch (error) {
        console.error("Error adding employee:", error);
      }
    }
  };

  useEffect(() => {
    // console.log(fieldError);
    if (Object.keys(fieldError).length === 0) {
      // console.log(
      //   userId,
      //   firstName,
      //   lastName,
      //   dateOfBirth,
      //   personalPhone,
      //   alternatePhone,
      //   email,
      //   companyEmail,
      //   highestQualification,
      //   adharCard,
      //   panCard,
      //   password,
      //   address
      // );
    }
  }, [fieldError]);

  const validate = () => {
    const error = {};
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!firstName) {
      error.firstName = "FirstName is required";
    }
    if (!lastName) {
      error.lastName = "LastName is required";
    }
    if (!dateOfBirth) {
      error.dateOfBirth = "choose date is required";
    }
    if (!personalPhone) {
      error.personalPhone = "Phone Number is required";
    } else if (personalPhone.length < 10) {
      error.personalPhone = "There should be 10 digits";
    }

    if (!alternatePhone) {
      error.alternatePhone = "Alternate phone number is required";
    } else if (alternatePhone.length < 10) {
      error.alternatePhone = "There should be 10 digits";
    }

    if (!highestQualification) {
      error.highestQualification = "Heighst Qualification is required";
    }
    if (!adharCard) {
      error.adharCard = "Adhar card Number is required";
    }
    if (!panCard) {
      error.panCard = "Pancard Number is required";
    }
    if (!address) {
      error.address = "Address is required";
    }
    if (!salary) {
      error.salary = "Salary is required";
    }
    if (!email) {
      error.email = "Email is required";
    } else if (!regex.test(email)) {
      error.email = "This is not a valid email format!";
    }
    if (!companyEmail) {
      error.companyEmail = "Company Email is required";
    } else if (!regex.test(companyEmail)) {
      error.companyEmail = "This is not a valid email format!";
    }

    return error;
  };

  return (
    <div className={style.main}>
      <div className={style.innerDiv}>
        <h1>Create Employe Form</h1>
        <button className={style.button} onClick={generateUserId}>
          Generate UserId
        </button>
        <form className={style.form} onSubmit={handleSubmit}>
          <div className={style.firstHalf}>
            <label htmlFor="userId">User ID:</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              readOnly
            />
            <label>FirstName</label>
            <input
              type="text"
              value={firstName}
              placeholder="Enter Firstname"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <p>{fieldError.firstName}</p>

            <label>LastName</label>
            <input
              type="text"
              value={lastName}
              placeholder="Enter Lastname"
              onChange={(e) => setLastName(e.target.value)}
            />
            <p>{fieldError.lastName}</p>
            <label>Date Of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              placeholder="Select Date of Birth"
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <p>{fieldError.dateOfBirth}</p>
            <label>Personal Phone Number</label>
            <input
              type="number"
              value={personalPhone}
              placeholder="Enter Personal Phone Number"
              onChange={(e) => setPersonalPhone(e.target.value)}
            />
            <p>{fieldError.personalPhone}</p>
            <label>Alternate Phone Number</label>
            <input
              type="number"
              value={alternatePhone}
              placeholder="Enter Alternate Phone Number"
              onChange={(e) => setAlternatePhone(e.target.value)}
            />
            <p>{fieldError.alternatePhone}</p>

            <label>Personal Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <p>{fieldError.email}</p>
          </div>

          <div className={style.secondHalf}>
            <label>Company Email</label>
            <input
              type="email"
              value={companyEmail}
              placeholder="Enter Company Email"
              onChange={(e) => setCompanyEmail(e.target.value)}
            />
            <p>{fieldError.companyEmail}</p>
            <label>Heighst Qualification</label>
            <input
              type="text"
              name="highestQualification"
              value={highestQualification}
              placeholder="Enter Heighst Qualification"
              onChange={(e) => setHighestQualification(e.target.value)}
            />
            <p>{fieldError.highestQualification}</p>
            <label>AdharCard Number</label>
            <input
              type="text"
              name="adharCard"
              value={adharCard}
              placeholder="Enter Adharcard Number"
              onChange={(e) => setAdharCard(e.target.value)}
            />
            <p>{fieldError.adharCard}</p>

            <label>Pancard Number</label>
            <input
              type="text"
              name="panCard"
              value={panCard}
              placeholder="Enter Pan card"
              onChange={(e) => setPanCard(e.target.value)}
            />
            <p>{fieldError.panCard}</p>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className={style.err}>Password is Auto generated</p>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={address}
              placeholder="Enter Address"
              onChange={(e) => setAddress(e.target.value)}
            />
            <p>{fieldError.address}</p>

            <label>Salary</label>
            <input
              type="text"
              name="salary"
              value={salary}
              placeholder="Enter Salary here"
              onChange={(e) => setSalary(e.target.value)}
            />
            <p>{fieldError.salary}</p>

            <button type="submit">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
