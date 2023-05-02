import image from "../../assets/BoA logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaceOutlined,
  FingerprintOutlined,
  PasswordOutlined,
} from "@mui/icons-material";
import { PATHS } from "../../utils/constants";
import useLocalStorage from "../../hooks/useLocalStorage";

const LoginTypes = () => {
  const [{ credentials }] = useLocalStorage("credential");
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      id="contentContainer"
    >
      <div id="containerLeft" />
      <div id="containerRight">
        <center>
          <Link to="/">
            <img src={image} id="logoImg" alt="img" />
          </Link>
        </center>

        <div
          style={{
            marginTop: "80px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              paddingLeft: "168px",
              color: "#F1AB15",
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >
            welcome
          </div>
          <div
            style={{
              paddingLeft: "80px",
              fontFamily: 'Roboto","Helvetica","Arial',
            }}
          >
            Please select the mode of authentication
          </div>
          {/* <p id="authtext">Please select the mode of authentication<br /></p> */}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {credentials?.includes("FACE") ? (
            <Link
              className="btn btn-light"
              id="adminButtons"
              to={PATHS.face}
              style={{
                borderRadius: "100%",
                backgroundColor: "#F1AB15",
                height: "85px",
                width: "85px",
                margin: "10px",
              }}
            >
              <FaceOutlined htmlColor={"#FFF"} style={{ fontSize: "4rem" }} />
            </Link>
          ) : null}
          {credentials?.includes("FINGERPRINT") ? (
            <Link
              className="btn btn-light"
              id="adminButtons"
              to={PATHS.finger}
              style={{
                borderRadius: "100%",
                backgroundColor: "#F1AB15",
                height: "85px",
                width: "85px",
                margin: "10px",
              }}
            >
              <FingerprintOutlined
                htmlColor={"#FFF"}
                style={{ fontSize: "4rem" }}
              />
            </Link>
          ) : null}
          {credentials?.includes("PASSWORD") ? (
            <Link
              className="btn btn-light"
              id="adminButtons"
              to={PATHS.password}
              style={{
                borderRadius: "100%",
                backgroundColor: "#F1AB15",
                height: "85px",
                width: "85px",
                margin: "10px",
              }}
            >
              <PasswordOutlined
                htmlColor={"#FFF"}
                style={{ fontSize: "4rem" }}
              />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LoginTypes;
