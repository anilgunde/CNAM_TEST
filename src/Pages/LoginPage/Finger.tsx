import React, { useState, useEffect, useCallback } from "react";
import { Box, TextField, Grid, CircularProgress } from "@mui/material";
import leftFinger from "../../assets/leftIndex.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import finger from "../../assets/finger.png";

import { Button } from "react-bootstrap";
import { PATHS } from "../../utils/constants";
import useLocalStorage from "../../hooks/useLocalStorage";
import useResponse from "../../helper";
import axios from "../../api/axios";
const Finger = () => {
  const navigate = useNavigate();
  const { FingerApi } = useResponse();

  const [fingerPosition, setFingerPosition] = useState("");
  const [fingerprint, setFinger] = useState("");

  const [{ identityNumber, fingerPositions }] = useLocalStorage("Details");
  const [isLoading, setIsLoading] = useState(false);
  const handleNext = useCallback(() => {
    FingerApi({ identityNumber, fingerprint })
    .then(res => {
      const { roleName, reportingRoleName, passwordChangeRequired } =
        res.data?.data;

      sessionStorage.setItem(
        "passwordChangeRequest",
        passwordChangeRequired,
      );

      const obj = res.data.data;
      const hasReportingRoleName =
        Object.keys(obj).includes("reportingRoleName");

      if(roleName === 'AGENT' && reportingRoleName === 'NONE' || reportingRoleName === null && hasReportingRoleName === false){
        setIsLoading(false);
        axios.defaults.headers.common.authorization = "";
        toast.error(`User is not an User Manager`);
        sessionStorage.clear();
      }else if(roleName === 'AGENT' && !reportingRoleName){
        setIsLoading(false);
        axios.defaults.headers.common.authorization = "";
        toast.error(`User is not an User Manager`);
        sessionStorage.clear();
        navigate(PATHS.login)
      }
      
      else if(roleName === 'AGENT' && reportingRoleName !== 'NONE' && passwordChangeRequired === true){
        setIsLoading(false);
        navigate(PATHS.passwordChangeRequest);
      }else if(roleName === 'AGENT' && reportingRoleName !== 'NONE' && passwordChangeRequired === false){
        setIsLoading(false);
        navigate(PATHS.dashboard);
      }else if(roleName === 'LEVEL_ONE_ADJUDICATOR' && reportingRoleName === 'NONE' || reportingRoleName === null){
        setIsLoading(false);
        navigate(PATHS.login)
        axios.defaults.headers.common.authorization = "";
        toast.error(`User is not an User Manager`);
        sessionStorage.clear();
      }

      else if(roleName === 'LEVEL_ONE_ADJUDICATOR' && !reportingRoleName){
        setIsLoading(false);
        axios.defaults.headers.common.authorization = "";
        toast.error(`User is not an User Manager`);
        sessionStorage.clear();
        navigate(PATHS.login)
      }
      
      
      
      
      else if(roleName === 'LEVEL_ONE_ADJUDICATOR' && reportingRoleName !== 'NONE'&& passwordChangeRequired === true){
        setIsLoading(false);
        navigate(PATHS.passwordChangeRequest);
      }else if(roleName === 'LEVEL_ONE_ADJUDICATOR' && reportingRoleName !== 'NONE'&& passwordChangeRequired === false){
        setIsLoading(false);
        navigate(PATHS.dashboard);
      }
      

      else if(roleName === 'LEVEL_ONE_BRANCH_ADJUDICATOR' && reportingRoleName === 'NONE' || reportingRoleName === null){
        setIsLoading(false);
        navigate(PATHS.login)
        axios.defaults.headers.common.authorization = "";
        toast.error(`User is not an User Manager`);
        sessionStorage.clear();
      }

      else if(roleName === 'LEVEL_ONE_BRANCH_ADJUDICATOR' && !reportingRoleName){
        setIsLoading(false);
        axios.defaults.headers.common.authorization = "";
        toast.error(`User is not an User Manager`);
        sessionStorage.clear();
        navigate(PATHS.login)
      }
      
      
      else if(roleName === 'LEVEL_ONE_BRANCH_ADJUDICATOR' && reportingRoleName !== 'NONE'&& passwordChangeRequired === true){
        setIsLoading(false);
        navigate(PATHS.passwordChangeRequest);
      }else if(roleName === 'LEVEL_ONE_BRANCH_ADJUDICATOR' && reportingRoleName !== 'NONE'&& passwordChangeRequired === false){
        setIsLoading(false);
        navigate(PATHS.dashboard);
      }

      
      
      
      
      
      else if(roleName === 'LEVEL_TWO_ADJUDICATOR' && reportingRoleName === 'NONE' || reportingRoleName === null){
        setIsLoading(false);
        navigate(PATHS.login)
        axios.defaults.headers.common.authorization = "";
        toast.error(`User is not an User Manager`);
        sessionStorage.clear();
      }

      else if(roleName === 'LEVEL_TWO_ADJUDICATOR' && !reportingRoleName){
        setIsLoading(false);
        axios.defaults.headers.common.authorization = "";
        toast.error(`User is not an User Manager`);
        sessionStorage.clear();
        navigate(PATHS.login)
      }
      
      
      else if(roleName === 'LEVEL_TWO_ADJUDICATOR' && reportingRoleName !== 'NONE'&& passwordChangeRequired === true){
        setIsLoading(false);
        navigate(PATHS.passwordChangeRequest);
      }else if(roleName === 'LEVEL_TWO_ADJUDICATOR' && reportingRoleName !== 'NONE'&& passwordChangeRequired === false){
        setIsLoading(false);
        navigate(PATHS.dashboard);
      }


      

      else if(roleName === 'LEVEL_TWO_BRANCH_ADJUDICATOR' && reportingRoleName === 'NONE' || reportingRoleName === null){
        setIsLoading(false);
        navigate(PATHS.login)
        axios.defaults.headers.common.authorization = "";
        toast.error(`User is not an User Manager`);
        sessionStorage.clear();
      }


      else if(roleName === 'LEVEL_TWO_BRANCH_ADJUDICATOR' && !reportingRoleName){
        setIsLoading(false);
        axios.defaults.headers.common.authorization = "";
        toast.error(`User is not an User Manager`);
        sessionStorage.clear();
        navigate(PATHS.login)
      }
      
      
      else if(roleName === 'LEVEL_TWO_BRANCH_ADJUDICATOR' && reportingRoleName !== 'NONE'&& passwordChangeRequired === true){
        setIsLoading(false);
        navigate(PATHS.passwordChangeRequest);
      }else if(roleName === 'LEVEL_TWO_BRANCH_ADJUDICATOR' && reportingRoleName !== 'NONE'&& passwordChangeRequired === false){
        setIsLoading(false);
        navigate(PATHS.dashboard);
      }

      
      
      
      
      else if(roleName === 'USER_MANAGER' && reportingRoleName !== 'NONE' && passwordChangeRequired === true){
        setIsLoading(false);
        navigate(PATHS.passwordChangeRequest);
      }

      else if(roleName === 'USER_MANAGER' && !reportingRoleName){
        setIsLoading(false);
        navigate(PATHS.userManagement.root);
      }
      
      
      else if(roleName === 'USER_MANAGER' && reportingRoleName !== 'NONE' && passwordChangeRequired === false){
        setIsLoading(false);
        navigate(PATHS.dashboard);
      }else if(roleName === 'USER_MANAGER' && hasReportingRoleName === false && passwordChangeRequired === false){
        setIsLoading(false);
        navigate(PATHS.userManagement.root);
      } else if(roleName === 'USER_MANAGER' && reportingRoleName === 'NONE' && passwordChangeRequired === true){
        setIsLoading(false);
        navigate(PATHS.passwordChangeRequest);
      }
      else if(roleName === 'USER_MANAGER' && reportingRoleName === 'NONE' && passwordChangeRequired === false){
        setIsLoading(false);
        navigate(PATHS.userManagement.root);
      }





      else if(roleName === 'PRIMORDIAL_USER' && reportingRoleName !== 'NONE' && passwordChangeRequired === true){
        setIsLoading(false);
        navigate(PATHS.passwordChangeRequest);
      }
      

      else if(roleName === 'USER_MANAGER' && !reportingRoleName){
        setIsLoading(false);
        navigate(PATHS.dashboard);
      }
      
      else if(roleName === 'PRIMORDIAL_USER' && reportingRoleName !== 'NONE' && passwordChangeRequired === false){
        setIsLoading(false);
        navigate(PATHS.dashboard);
      }else if(roleName === 'PRIMORDIAL_USER' && hasReportingRoleName === false && passwordChangeRequired === false){
        setIsLoading(false);
        navigate(PATHS.dashboard);
      } else if(roleName === 'PRIMORDIAL_USER' && reportingRoleName === 'NONE' && passwordChangeRequired === true){
        setIsLoading(false);
        navigate(PATHS.passwordChangeRequest);
      }
      else if(roleName === 'PRIMORDIAL_USER' && reportingRoleName === 'NONE' && passwordChangeRequired === false){
        setIsLoading(false);
        navigate(PATHS.dashboard);
      }
      
      
    }).catch((error)=>{
        setIsLoading(false);
        navigate(PATHS.login)
        axios.defaults.headers.common.authorization = "";
        toast.error(error.response.data.error.message);
      //console.log('error',error)
    })
  }, [FingerApi, fingerprint, identityNumber, navigate]);

  const handleScan = () => {
    fetch("https://device.aptiway.com:9004", {
      method: "POST",
      body: JSON?.stringify({
        cmd: 2,
        finger_index: 1,
        compression_type: 1,
        export_bmp: false,
      }),
    })
      .then(function (response) {
        return response?.json();
      })
      .then(function (data) {
        setFinger(data.awmsosvc_response);
      })
      .catch(() => toast?.error("Please Select Again"));
  };

  const handleClear = () => {
    setFinger("");
  };

  return (
    <>
      <div
        className='d-flex justify-content-center align-items-center'
        id='contentContainer'
      >
        <div id='containerLeft'></div>
        {isLoading ? (
            <Box sx={{ margin: "30%", marginLeft: "45%" }}>
              <CircularProgress color='primary' />
            </Box>
          ) :(
        <div id='containerRight'>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignContent={"center"}
            justifyContent={"center"}
            height={"8rem"}
            width={"90%"}
            margin={"1rem 2rem 2rem 2rem"}
          >
            <img alt={"left-index-finger"} src={leftFinger} />
          </Box>
          <Grid
            item
            md={12}
            xs={12}
            lg={12}
            display={"flex"}
            justifyContent={"center"}
          >
            <div
              style={{
                height: ".15rem",
                background: "#1c1c1c",
                width: "14rem",
              }}
            />
          </Grid>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignContent={"center"}
            justifyContent={"center"}
            width={"100%"}
            marginTop={"2rem"}
          >
            <TextField
              variant='outlined'
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "2rem",
                },
              }}
              select
              value={fingerPosition}
              onChange={event => {
                setFingerPosition(event.target.value);
              }}
              SelectProps={{ native: true }}
              style={{ width: "60%" }}
            >
              <option value={""}>Select Finger Position</option>
              {fingerPositions?.map((position: any) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </TextField>
          </Box>

          <Box
            display={"flex"}
            flexDirection={"row"}
            alignContent={"center"}
            justifyContent={"center"}
            width={"100%"}
            marginTop={"1rem"}
          >
            {fingerprint ? <img src={finger} alt={"finger-print"} /> : null}
          </Box>

          <Box
            display={"flex"}
            flexDirection={"column"}
            alignContent={"center"}
            justifyContent={"center"}
          >
            {!fingerprint?.length ? (
              <Button
                variant={"contained"}
                style={{
                  background: "#F1AB15",
                  fontSize: "1.125rem",
                  boxShadow: "unset",
                  height: "2.8rem",
                  borderRadius: "16px",
                  width: "26rem",
                }}
                onClick={() => {
                  handleScan();
                }}
              >
                Scan
              </Button>
            ) : null}
            {fingerprint?.length ? (
              <Button
                variant={"contained"}
                style={{
                  background: "#F1AB15",
                  fontSize: "1.125rem",
                  boxShadow: "unset",
                  height: "2.8rem",
                  borderRadius: "16px",
                  width: "26rem",
                  marginBottom: "1rem",
                  marginTop: "1rem",
                }}
                onClick={() => {
                  handleClear();
                }}
              >
                Clear
              </Button>
            ) : null}
            {fingerprint?.length ? (
              <Button
                variant={"contained"}
                style={{
                  background: "#F1AB15",
                  fontSize: "1.125rem",
                  boxShadow: "unset",
                  height: "2.8rem",
                  borderRadius: "16px",
                  width: "26rem",
                }}
                onClick={() => {
                  handleNext();
                }}
                disabled={!fingerPosition.length || !fingerprint?.length}
              >
                Proceed
              </Button>
            ) : null}
          </Box>
        </div>
        )}
      </div>
      
    </>
    
  );
};

export default Finger;
