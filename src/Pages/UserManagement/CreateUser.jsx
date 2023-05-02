import { useEffect, useCallback, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { toast } from "react-toastify";
import useResponse from "../../helper";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { PATHS } from "../../utils/constants";
const lstatus = ["ACTIVE", "INACTIVE"];

const roles = [
  "AGENT",
  "SELF_KYC_CLIENT",
  "LEVEL_ONE_ADJUDICATOR",
  "LEVEL_TWO_ADJUDICATOR",
  "USER_MANAGER",
  "LEVEL_ONE_BRANCH_ADJUDICATOR",
  "LEVEL_TWO_BRANCH_ADJUDICATOR",
];

const reportingRoles = [
  "DISTRICT_REPORT_VIEWER",
  "GLOBAL_REPORT_VIEWER",
  "BRANCH_REPORT_VIEWER",
];
const CreateUser = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  //const [{ accessToken }] = useLocalStorage("jwtWithDetails");
  // const [
  //   { accessToken, reportingRoleName, branchId, branchDistrict, roleName },
  // ] = useLocalStorage("jwtWithDetails");
  const { CreateUserApi, BranchApi } = useResponse();
  const [cmobile, setCmobile] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [reportingRole, setReportingRole] = useState("");
  const [branchlist, setBranchlist] = useState([]);

  const [password, setPassword] = useState("");
  const [passwordchecked, setPasswordChecked] = useState(false);

  const [status, setStatus] = useState("");
  const [branch, setBranch] = useState("");

  // useEffect(()=>{
  //   if(roleName === 'USER_MANAGER' || roleName === 'PRIMORDIAL_USER'){
  //     return
  //   }
  //   else{
  //     navigate(PATHS.dashboard)
  //     toast.error('You Are Not Authorized ')
  //   }
  // },[roleName])
  const handleBranch = useCallback((_event, value) => {
    setBranch(value.value);
  }, []);
  const handleChange = useCallback(() => {
    setChecked(prev => !prev);
  }, []);

  const handlePasswordChange = useCallback(() => {
    setPasswordChecked(prev => !prev);
  }, []);

  const handlePassword = e => {
    const value = e.target.value;
    setPassword(value);
  }

  const handleNumber = e => {
    const value = e.target.value.replace(/\D/g, "");
    setCmobile(value);
  };
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  useEffect(() => {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        //   console.log(position.coords.latitude);
        //   console.log(position.coords.longitude);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);
  // console.log('testpass',password)

  const Password = btoa(password);

  // useEffect(() => {
  //   BranchApi({ accessToken }).then(res => {
  //     const { labelValues } = res?.data?.data;
  //     setBranchlist(labelValues.sort((a, b) => a.label.localeCompare(b.label)));
  //   });
  // }, [BranchApi, accessToken]);

  // useEffect(() => {
  //   if (cmobile.length === 9) {
  //     axios
  //       .get(`user/credential`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           authorization: `Bearer ${accessToken}`,
  //         },
  //         params: {
  //           "attribute-name": "MobileNumber",
  //           "attribute-value": cmobile,
  //         },
  //       })
  //       .then(res => {
  //         //console.log("res", res.data.data.identityNumber);

  //         axios
  //           .get(`identity/${res.data.data.identityNumber}/profile/fullName`, {
  //             headers: {
  //               "Content-Type": "application/json",
  //               authorization: `Bearer ${accessToken}`,
  //             },
  //           })
  //           .then(response => {
  //             //setList(response.data.data);
  //             //console.log('zxczCX',response.data.data.demographics[3].value)
  //             setName(response.data.data?.fullName);
  //           })
  //           .catch(err => {
  //             toast.error(`Please Provide Enrolled Mobile Number`);
  //           });
  //       });
  //   }
  // }, [accessToken, cmobile]);

  // const UserCreation = e => {}
const [isLoading,setIsLoading] = useState(false)
  const UserCreation = e => {
    e.preventDefault();
      if (cmobile === "") {
        toast.error(`Please Enter Mobile Number`);
      } else if (name === "") {
        toast.error(`Please Enter Name`);
      } 
      else if(password===''){
        toast.error(`Please Enter Password`);
      }
    // else if (role === "") {
    //   toast.error(`Please Select Role`);
    // } else if (branch === "") {
    //   toast.error(`Please Select Branch`);
    // } else if (status === "") {
    //   toast.error(`Please Select Status`);
    // } 
    else {
      // if (checked === true) {
      //   return CreateUserApi({
      //     MobileNumber: cmobile,
      //     role,
      //     reportingRole: reportingRole,
      //     name,
      //     branchId: branch,
      //     status,
      //     password:Password,
      //     accessToken,
      //   });
      // }
      // if (checked === false) {
      //   return CreateUserApi({
      //     MobileNumber: cmobile,
      //     role,
      //     name,
      //     branchId: branch,
      //     status,
      //     password:Password,
      //     accessToken,
      //   });
      // }
      setIsLoading(true)
      axios.post('user',{
        "mobileNumber": '+225'+cmobile,
        "displayName": name,
        "password": Password,
        "deviceId": "asdasdad",
        "model": "Google Pixel 7",
        "operatingSystem": "WINDOWS",
        "networkConnectionMode": "ETHERNET",
        "location": {
        "latitude": latitude,
        "longitude": longitude
        }
      }).then(res=>{

      }).catch(err=>{

      }).finally(()=>{
        setIsLoading(false)
      })
      // console.log('+251'+cmobile,name,Password)
    }
  };

  return (
    <Box>
      <Stack justifyContent="center" alignItems={"center"} marginTop={3}>
        <Card
          sx={{
            maxWidth: 450,
            minWidth:450,
            minHeight:400,
            bordertop: `3px solid ${theme.palette.primary.main}`,
            paddingX: 2,
          }}
        >
          <CardContent>
            <Grid container spacing={2} position={'relative'}>
              {isLoading? <Box  position={'absolute'} display={'flex'} justifyContent={'center'} alignItems={'center'} top={'50%'} left={'50%'} style={{'transform':'translate(-50%,-50%)'}} marginTop={'12rem'}>
                <Box >
              <Typography  textAlign='center'>
                    <CircularProgress />
                  </Typography>

              </Box></Box> : <>
              <Grid item xs={12} sm={12}>
                <Stack justifyContent="center" alignItems="center">
                  <PersonAddAltOutlinedIcon
                    sx={{
                      fontSize: "4rem",
                      color: `${theme.palette.grey[500]}`,
                      borderRadius: "5%",
                      fontSizeAdjust: 4,
                    }}
                  />
                  <Typography
                    variant="h5"
                    color={theme => theme.palette.grey[500]}
                    component="h2"
                    guttertop={"true"}
                    textTransform={"uppercase"}
                    fontWeight={600}
                    letterSpacing={3}
                  >
                    Create User
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  size="small"
                  required
                  placeholder="Enter Mobile Number"
                  label="Mobile Number"
                  name="mnumber"
                  maxLength={9}
                  value={cmobile || ""}
                  // onKeyUp={handleKeyUp}
                  pattern="^[0-9]*$"
                  fullWidth
                  autoFocus
                  onChange={handleNumber}
                  inputProps={{ maxLength: 9 }}
                />
              </Grid>
              <Grid xs={12} sm={12} item>
                <TextField
                  size="small"
                  margin="normal"
                  // InputProps={{
                  //   readOnly: true,
                  // }}
                  onChange={(e)=>{setName(e.target.value)}}
                  fullWidth
                  value={name}
                  name="Name"
                  label="Name"
                />
              </Grid>
              {/* <Grid item xs={12} sm={12}>
                <Autocomplete
                  size="small"
                  disablePortal
                  name="role"
                  onChange={(event, value) => setRole(value)}
                  options={roles.sort()}
                  renderInput={params => <TextField {...params} label="Role" />}
                />
              </Grid> */}
              {/* <Grid item xs={12} sm={12}>
                <Autocomplete
                  value={
                    branchlist?.length > 1
                      ? branchlist?.find(name => name?.value === branch)?.label
                      : branch
                  }
                  options={branchlist}
                  onChange={handleBranch}
                  isOptionEqualToValue={(option, value) =>
                    option?.code === value?.value
                  }
                  renderInput={params => (
                    <TextField {...params} label="Branch" />
                  )}
                  size="small"
                />
              </Grid> */}
              {/* <Grid item xs={12} sm={12}>
                <Autocomplete
                  size="small"
                  disablePortal
                  name="status"
                  onChange={(event, value) => setStatus(value)}
                  options={lstatus}
                  renderInput={params => (
                    <TextField {...params} label="Status" />
                  )}
                />
              </Grid> */}


              <Grid item xs={12} sm={12}>
                {/* <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Password (optional)"
                    onChange={handlePasswordChange}
                  />
                </FormGroup> */}
               
                  <TextField
                  size="small"
                  // margin="normal"
                  type="password"
                  fullWidth
                  value={password}
                  name="Password"
                  label="Password"
                  onChange={handlePassword}
                />
                
              </Grid>


                {/* <Grid item xs={12} sm={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Reporting Role (optional)"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  {checked && (
                    <Autocomplete
                      size="small"
                      disablePortal
                      name="Reporting Role"
                      onChange={(_event, value) => setReportingRole(value)}
                      options={reportingRoles.sort()}
                      renderInput={params => (
                        <TextField {...params} label="Reporting_Role" />
                      )}
                    />
                  )}
                </Grid> */}
              <Grid item xs={12} sm={12}>
                <Stack justifyContent="center" alignItems="center">
                  <Button
                    // fullWidth
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={UserCreation}
                  >
                    Submit
                  </Button>
                </Stack>
              </Grid>
              </>}
              
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default CreateUser;
