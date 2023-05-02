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

const PasswordChangeRequest = () => {
  const navigate = useNavigate();
  const { ConfirmPasswordApi } = useResponse();
  const [{ identityNumber }] = useLocalStorage("Details");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const Password = btoa(password);
  const PasswordConfirmation = btoa(confirmPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = useCallback(
    () => setShowPassword(prev => !prev),
    [],
  );
  const handleMouseDownPassword = useCallback(
    () => setShowPassword(prev => !prev),
    [],
  );
  const handleClickShowConfirmPassword = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);
  const handleMouseDownConfirmPassword = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  const HandelSubmit = useCallback(
    async event => {
      event.preventDefault();

      if (!password.length) {
        toast.error(`Please enter Password`);
      }
      if (!confirmPassword.length) {
        toast.error(`Please enter Confirm Password`);
      }
      if (password === confirmPassword) {
        setIsLoading(true);
        ConfirmPasswordApi({
          identityNumber,
          Password,
          PasswordConfirmation,
        })
          .then(res => {
            if (res.data.status === "COMPLETED") {
              navigate(PATHS.login);
              axios.defaults.headers.common.authorization = "";
              toast.success("Password Changed Successfully Please Login Again");
              sessionStorage.clear();
            }
          })
          .catch(err => {
            setIsLoading(false);
            toast.error(`${err.response.data.error.message}`);
            navigate(PATHS.login);
            sessionStorage.clear();
          });
      } else if (
        password !== confirmPassword &&
        password.length &&
        confirmPassword.length
      ) {
        toast.error(`Password Doesn't Match`);
      }
    },
    [
      ConfirmPasswordApi,
      Password,
      PasswordConfirmation,
      confirmPassword,
      identityNumber,
      navigate,
      password,
    ],
  );

  useEffect(() => {
    if (password.length === 1) {
      setTimeout(() => {
        setShowPassword(true);
        setShowConfirmPassword(true);
      }, 1);
      setTimeout(() => {
        setShowPassword(false);
        setShowConfirmPassword(false);
      }, 2);
    }
    if (confirmPassword.length === 1) {
      setTimeout(() => {
        setShowConfirmPassword(true);
      }, 1);
      setTimeout(() => {
        setShowConfirmPassword(false);
      }, 2);
    }
  }, [confirmPassword.length, password]);

  return (
    <div
      className='d-flex justify-content-center align-items-center'
      id='contentContainer'
    >
      <div id='containerLeft'></div>
      <form>
        <div id='containerRight'>
          <center>
            <img src={image} id='logoImg' alt='ds' />
          </center>
          {isLoading ? (
            <Box sx={{ margin: "30%", marginLeft: "45%" }}>
              <CircularProgress color='primary' />
            </Box>
          ) : (
            <>
              <br />
              
              <div id='passwordContainer'>
                <dl>
                  <dt id='pswText'>Password Change Request</dt>
                  <dd>
                    <TextField
                      label='New Password'
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
                  <dd>
                    <TextField
                      label='Confirm Password'
                      variant='outlined'
                      type={showConfirmPassword ? "text" : "password"}
                      onChange={e => setConfirmPassword(e.target.value)}
                      fullWidth
                      value={confirmPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label='toggle password visibility'
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={handleMouseDownConfirmPassword}
                            >
                              {showConfirmPassword ? (
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
              

<div  style={{width:'100%'}}>
        <div style={{width:'50%',height:'100px',float:'left',paddingRight:'4px' }}> 
        <input
                type='submit'
                className='btn btn-warning w-100 rounded rounded-pill'
                value='Cancel'
                onClick={()=>navigate(PATHS.login)}
              />
        </div>
        <div style={{marginLeft:'50%',height:'100%'}} > 
        

<input
                type='submit'
                className='btn btn-warning w-100 rounded rounded-pill'
                value='Submit'
                onClick={HandelSubmit}
              />
        </div>
    </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeRequest;
