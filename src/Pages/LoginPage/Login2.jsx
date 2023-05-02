import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import image from "../../assets/BoA logo.png";

import { getConfig } from "../../utils/config";
import LoadingSpinner from "../../components/Common/Spinner";
import { PATHS } from "../../utils/constants";
const Login = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const HandelSubmit = async event => {
    event.preventDefault();
    if (mobile === "") {
      toast("Please Enter Mobile Number");
    } else if (mobile.length < 9) {
      toast("Mobile number lenght Not Matched");
    }
    try {
      setIsLoading(true);

      const res = await axios({
        method: "get",
        url: `${getConfig(
          "API_URL",
        )}user/credential?attribute-name=MobileNumber&attribute-value=${mobile}`,
      });
      let userStatus = res.data.data.userStatus;
      let identityNumber = res.data.data.identityNumber;
      let credentials = res.data.data.credentials;
      let fingerPositions = res.data.data.fingerPositions;

      if (userStatus === "ACTIVE") {
        localStorage.setItem("Id", identityNumber);
        localStorage.setItem("credintial", credentials);
        localStorage.setItem("fingerarray", fingerPositions);
        if (identityNumber) {
          navigate(PATHS.loginTypes);
        } else {
          alert("Please provide correct details");
        }
        setIsLoading(false);
      } else {
        alert("This Account Has Been Deactivated");
        navigate(PATHS.login);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleNumber = e => {
    if (!e.target.validity.patternMismatch) {
      setMobile(e.target.value);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      id="contentContainer"
    >
      <div id="containerLeft">
        <h2 id="regTextTwo">Bank 24/7 with our virtual banking</h2>
        <p id="regType">Discover more ways to bank than ever</p>
      </div>

      <div id="containerRight" className="homeContainer">
        {isLoading ? (
          <LoadingSpinner style={{ marginTop: "40rem" }} />
        ) : (
          <>
            <center>
              <img src={image} id="logoImg" alt="" />
            </center>
            <br />
            <br />
            <p id="regTextMain">Web Admin</p>
            <p id="mobileText">Please Enter Mobile Number</p>
            <form>
              <div className="input-group">
                <select
                  className="input-group-text number form-select w-25"
                  style={{ height: "50px" }}
                >
                  <option>+251</option>
                </select>

                <input
                  type="text"
                  style={{ height: "50px" }}
                  required
                  className="form-control w-75"
                  placeholder="Enter Mobile Number"
                  value={mobile || ""}
                  pattern="^[0-9]*$"
                  onChange={handleNumber}
                  maxLength={9}
                />
              </div>

              <input
                type="submit"
                className=" btn btn-warning w-100 mt-4 rounded"
                variant="warning"
                value="Submit"
                onClick={HandelSubmit}
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
