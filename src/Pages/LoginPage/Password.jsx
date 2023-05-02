import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image from "../../assets/BoA logo.png";
import { PATHS } from "../../utils/constants";
import useResponse from "../../helper";
import { toast } from "react-toastify";
import useLocalStorage from "../../hooks/useLocalStorage";
import {
  CircularProgress,
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "../../api/axios";

const Password = () => {
  const navigate = useNavigate();
  const { PasswordApi } = useResponse();
  const [{ identityNumber }] = useLocalStorage("Details");

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const Password = btoa(password);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const HandelSubmit = useCallback(
    async event => {
      event.preventDefault();
      if (!password.length) {
        toast.error(`Please enter Password`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (password.length > 0) {
        setIsLoading(true);

        PasswordApi({
          identityNumber,
          Password,
        }).then(res => {
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
      }
    },
    [Password, PasswordApi, identityNumber, navigate, password.length],
  );

  useEffect(() => {
    if (password.length === 1) {
      setTimeout(() => {
        setShowPassword(true);
      }, 1);
      setTimeout(() => {
        setShowPassword(false);
      }, 2);
    }
  }, [password]);

  return (
    <div
      className='d-flex justify-content-center align-items-center'
      id='contentContainer'
    >
      <div id='containerLeft'></div>
      <form>
        <div id='containerRight'>
          <center>
            <img
              src={image}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(PATHS.login)}
              id='logoImg'
              alt='ds'
            />
          </center>
          {isLoading ? (
            <Box sx={{ margin: "30%", marginLeft: "45%" }}>
              <CircularProgress color='primary' />
            </Box>
          ) : (
            <>
              <br />
              <br />
              <div id='passwordContainer'>
                <dl>
                  <dt id='pswText'>Password</dt>
                  <dd>
                    <TextField
                      label='Password'
                      variant='outlined'
                      type={showPassword ? "text" : "password"}
                      onChange={e => setPassword(e.target.value)}
                      fullWidth
                      value={password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label='toggle password visibility'
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </dd>
                </dl>
                <br />
              </div>
              <input
                type='submit'
                className='btn btn-warning w-100 rounded rounded-pill'
                value='Submit'
                onClick={HandelSubmit}
              />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Password;
