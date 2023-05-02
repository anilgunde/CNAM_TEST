import { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useLocalStorage from "../../hooks/useLocalStorage";
import {
  Button,
  Box,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  CardContent,
  Card,
  useTheme,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Grid,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import useResponse from "../../helper";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/constants";

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
  "NONE",
];

const UpdateUser = () => {
  const { UpdateUserApi, getSingleUser } = useResponse();
const login = JSON.parse(sessionStorage?.getItem('login'))
  //const { accessToken } = JSON.parse(sessionStorage.getItem("jwtWithDetails"));
  // const [
  //   { accessToken, reportingRoleName, branchId, branchDistrict, roleName },
  // ] = useLocalStorage("jwtWithDetails");
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const { enrolmentId } = params;
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // const userMobileNumber = userNumber.slice(4, 14);
  const [mobilenumber, setMobilenumber] = useState('');
  const [values, setValues] = useState({
    personalDetails:{},
    birthDetails:{},
    address:{},
    contactDetails:{},
    professionalDetails:{},
    subscriptionDetails:{}
  });
  const [value, setValue] = useState({
    personalDetails:{},
    birthDetails:{},
    address:{},
    contactDetails:{},
    professionalDetails:{},
    subscriptionDetails:{}
  });
  const [checked, setChecked] = useState(false);
  // const fun1 = useCallback(() => {
  //   if (reportingRole.includes("REPORT_VIEWER")) {
  //     return true;
  //   }
  // }, [reportingRole]);
  // const [reportingRoleChecked, setReportingRoleChecked] = useState(false);
  // const [roless, setRole] = useState(`${values.role}`);

  const [branchlist, setBranchlist] = useState([]);

  const [password, setPassword] = useState("");

  const Password = btoa(password);
  const [loading,setLoading] = useState(false)
  

  // useEffect(() => {
  //   setReportingRoleChecked(fun1());
  // }, [fun1]);

  const handleChange = useCallback(() => {
    setChecked(prev => !prev);
  }, []);
  // const handleReportingRoleToggle = useCallback(() => {
  //   setReportingRoleChecked(prev => !prev);
  //   console.log("fun1()", fun1());

  //   // alert(reportingRoleChecked)
  // }, [fun1]);
   useEffect(() => {
    axios.get(`/api/management/enrolment/${enrolmentId}/completed`,
     {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${login?.data?.accessToken}`,
      },
    }
    ).then( async (res) => {
      if (!res) {
        alert("SINGLE ERROR");
      } else {
        setValues(res?.data?.data?.enrolment?.enrolmentDetails);
      }
    }).catch(err=>{
      toast.error(`${err.response.data.error.message}`);
    });
  }, []);

useEffect(()=>{
    // console.log(values)
    setValue(
      {
        "personalDetails": {
        "titleCode": values?.personalDetails?.title?.code,
        "firstNames": values?.personalDetails?.firstNames,
        "lastName": values?.personalDetails?.lastName,
        "currentNationalityCode": values?.personalDetails?.currentNationality?.code,
        "maritalStatusCode": values?.personalDetails?.maritalStatus?.code,
        "maidenName": values?.personalDetails?.maidenName
        },
        "birthDetails": {
        "date": values?.birthDetails?.date,
        "certificateNumber": values?.birthDetails?.certificateNumber,
        "certificateIssueDate": values?.birthDetails?.certificateIssueDate,
        "countryCode": values?.birthDetails?.country?.code,
        "subPrefectureCode": values?.birthDetails?.subPrefecture?.code
        },
        "address": {
        "subPrefectureCode": values?.address?.subPrefecture?.code,
        "agencyCode": values?.address?.agency?.code
        },
        "contactDetails": {
        "mobileNumber": values?.contactDetails?.mobileNumber,
        "landlineNumber": values?.contactDetails?.landlineNumber,
        "email": values?.contactDetails?.email,
        "postOfficeBox": values?.contactDetails?.postOfficeBox
        },
        "professionalDetails": {
        "personTypeCode": values?.professionalDetails?.personCategory?.code,
        "professionCode": values?.professionalDetails?.profession?.code,
        "employerCompanyCode": values?.professionalDetails?.employer?.code,
        "registrationNumberTypeCode": values?.professionalDetails?.registrationNumberTypeCode,
        "registrationNumber": values?.professionalDetails?.registrationNumber,
        },
        "subscriptionDetails": {
        "paidByCode": values?.subscriptionDetails?.paidBy?.code,
        "payer": {
        "cnamNumber": values?.subscriptionDetails?.payer?.cnamNumber,
        "enrolmentId": values?.subscriptionDetails?.payer?.enrolmentId,
        "firstName": values?.subscriptionDetails?.payer?.firstName,
        "lastName": values?.subscriptionDetails?.payer?.lastName
        }
        }
       }
    )
    // console.log(value)
},[values])

  const lstatus = ["ACTIVE", "INACTIVE"];
  

  const handleNumber = e => {
    const value = e.target.value.replace(/\D/g, "");
    setMobilenumber(value);
  };
  const handlePassword = e => {
    const value = e.target.value;
    setPassword(value);
  };
  const downLg = useMediaQuery(theme.breakpoints.down('md'));
  const handleName = useCallback(e => {
    const value = e.target.value;
    setValues(prev => ({ ...prev, displayName: value }));
  }, []);
  const handleRole = useCallback((e, value) => {
    setValues(prev => ({ ...prev, role: value }));
  }, []);
  const handleReportingRole = useCallback((e, value) => {
    setValues(prev => ({ ...prev, reportingRole: value }));
  }, []);
  const handleStatus = useCallback((e, value) => {
    setValues(prev => ({ ...prev, status: value }));
  }, []);
  const handleBranch = useCallback((e, value) => {
    setValues(prev => ({ ...prev, branchId: value?.value }));
  }, []);
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

  const handleSubmit =() => {
      // e.preventDefault();
      setLoading(true)
      axios.put(`/api/enrolment/${enrolmentId}/details`,
      {
          ...value
      },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${login?.data?.accessToken}`,
          },
        },
      ).then(res=>{
        toast.success(`Enrolment Updated Successfully`);
        navigate('/enrollments')
      }).catch(err=>{
        toast.error(`${err.response.data.error.message}`);
      }).finally(()=>{
        setLoading(false)
      })
    }
    

  return (
    
    <Box>
      
      <Grid container gap={4} style={{background:'#FFFFFF',borderRadius:'0.5rem'}} position={'relative'} minHeight={'70vh'}>
      {loading ?  <Box position={'absolute'} display={'flex'} alignItems={'center'} justifyContent={'center'} top={'50%'} left={'50%'} style={{'transform':'translate(-50%,-50%)'}}><CircularProgress /></Box>:<> <Box  width={downLg ? '100%' : '45%'}>
         
         <label style={{marginLeft:'5rem',marginTop:'2rem'}}><b>Personal Details</b></label>
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>TitleCode :</label>
             <TextField size="small" required placeholder="Title Code"  name="name"  value={values?.personalDetails?.title?.code} autoFocus onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,title:{
               ...values.personalDetails.title,code:e.target.value
             }}})}}
             />
             </Grid>
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>FirstName :</label>
             <TextField size="small" required placeholder="firstName"  name="firstName"  value={values?.personalDetails?.firstNames} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,firstNames:e.target.value}})}}/>
             </Grid>
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>LastName :</label>
             <TextField size="small" required placeholder="lastName"  name="lastName"  value={values?.personalDetails?.lastName}
             onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,lastName:e.target.value}})}} />
             </Grid>
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>NationalityCode :</label>
             <TextField size="small" required placeholder="currentNationalityCode"  name="currentNationalityCode"  value={values?.personalDetails?.currentNationality?.code} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,currentNationality:{
               ...values.personalDetails.currentNationality,code:e.target.value
             }}})}}/>
             </Grid>
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>MaritalStatus :</label>
             <TextField size="small" required placeholder="maritalStatusCode" name="MaritalStatusCode"  value={values?.personalDetails?.maritalStatus?.code} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,maritalStatus:{
               ...values.personalDetails.maritalStatus,code:e.target.value
             }}})}}/>
             </Grid>
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>MaidenName :</label>
             <TextField size="small" required placeholder="MaidenName" name="maidenName"  value={values?.personalDetails?.maidenName} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,maidenName:e.target.value}})}}/>
             </Grid>
 
             <label style={{marginLeft:'5rem',marginTop:'2rem'}}><b>Birth Details</b></label>
 
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>Date :</label>
             <TextField size="small" required placeholder="Date"  name="date"  value={values?.birthDetails?.date} onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,date:e.target.value}})}}/>
             </Grid>
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'4rem'}}>
             <label style={{margin:'0.5rem'}}>CertificateNumber :</label>
             <TextField size="small" required placeholder="CertificateNumber" name="certificateNumber"  value={values?.birthDetails?.certificateNumber}  onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,certificateNumber:e.target.value}})}}/>
             </Grid>
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'3rem'}}>
             <label style={{margin:'0.5rem'}}>CertificateIssueDate :</label>
             <TextField size="small" required placeholder="CertificateIssueDate"  name="CertificateIssueDate"  value={values?.birthDetails?.certificateIssueDate}  onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,certificateIssueDate:e.target.value}})}}/>
             </Grid>
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>CountryCode :</label>
             <TextField size="small" required placeholder="CountryCode"  name="CountryCode"  value={values?.birthDetails?.country?.code} onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,country:{
               ...values.birthDetails.country,code:e.target.value
             }}})}}/>
             </Grid>
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'3rem'}}>
             <label style={{margin:'0.5rem'}}>SubPrefectureCode :</label>
             <TextField size="small" required placeholder="SubPrefectureCode" name="subPrefectureCode"  value={values?.birthDetails?.subPrefecture?.code} onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,subPrefecture:{
               ...values.birthDetails.subPrefecture,code:e.target.value
             }}})}}/>
             </Grid>
 
 
 
 
             <label style={{marginLeft:'5rem',marginTop:'2rem'}}><b>Address</b></label>
 
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'3rem'}}>
             <label style={{margin:'0.5rem'}}>SubPrefectureCode :</label>
             <TextField size="small" required placeholder="SubPrefectureCode" name="subPrefectureCode"  value={values?.address?.subPrefecture?.code} onChange={(e)=>{setValues({...values,address:{...values?.address,subPrefecture:{
               ...values.address.subPrefecture,code:e.target.value
             }}})}}/>
             </Grid>
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>AgencyCode :</label>
             <TextField size="small" required placeholder="AgencyCode" name="agencyCode"  value={values?.address?.agency?.code} 
             onChange={(e)=>{setValues({...values,address:{...values?.address,agency:{
               ...values.address.agency,code:e.target.value
             }}})}}/>
             </Grid>
         </Box>
 
         <Box  width={downLg ? '100%' : '45%'}>
         
         <label style={{marginLeft:'5rem',marginTop:'2rem'}}><b>ContactDetails</b></label>
             
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>MobileNumber :</label>
             <TextField size="small" required placeholder="MobileNumber" name="agencyCode"  value={values?.contactDetails?.mobileNumber} onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,mobileNumber:e.target.value}})}}/>
             </Grid>
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>LandlineNumber :</label>
             <TextField size="small" required placeholder="LandlineNumber" name="landlineNumber"  value={values?.contactDetails?.landlineNumber} onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,landlineNumber:e.target.value}})}}/>
             </Grid>
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>Email :</label>
             <TextField size="small" required placeholder="Email"  name="email"  value={values?.contactDetails?.email}  onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,email:e.target.value}})}}/>
             </Grid>
 
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>PostOfficeBox :</label>
             <TextField size="small" required placeholder="PostOfficeBox" name="postOfficeBox"  value={values?.contactDetails?.postOfficeBox} onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,postOfficeBox:e.target.value}})}}/>
             </Grid>
 
 
 
 
             <label style={{marginLeft:'5rem',marginTop:'2rem'}}><b>ProfessionalDetails</b></label>
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>PersonTypeCode :</label>
             <TextField size="small" required placeholder="PersonTypeCode" name="personTypeCode"  value={values?.professionalDetails?.personCategory?.code} onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,personCategory:{
               ...values.professionalDetails.personCategory,code:e.target.value
             }}})}}/>
             </Grid>
 
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'5rem'}}>
             <label style={{margin:'0.5rem'}}>ProfessionCode :</label>
             <TextField size="small" required placeholder="ProfessionCode" name="professionCode"  value={values?.professionalDetails?.profession?.code}  onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,profession:{
               ...values.professionalDetails.profession,code:e.target.value
             }}})}}/>
             </Grid>
 
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'1rem'}}>
             <label style={{margin:'0.5rem'}}>EmployerCompanyCode :</label>
             <TextField size="small" required placeholder="EmployerCompanyCode"  name="employerCompanyCode"  value={values?.professionalDetails?.employer?.code} onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,employer:{
               ...values.professionalDetails.employer,code:e.target.value
             }}})}}/>
             </Grid>
 
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'-1rem'}}>
             <label style={{margin:'0.5rem'}}>RegistrationNumberTypeCode :</label>
             <TextField size="small" required placeholder="RegistrationNumberTypeCode"  name="registrationNumberTypeCode"  value={values?.professionalDetails?.registrationNumberType} onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,registrationNumberType:e.target.value}})}}/>
             </Grid>
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'3rem'}}>
             <label style={{margin:'0.5rem'}}>RegistrationNumber :</label>
             <TextField size="small" required placeholder="RegistrationNumber"  name="registrationNumber"  value={values?.professionalDetails?.registrationNumber} onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,registrationNumber:e.target.value}})}}/>
             </Grid>
 
 
             <label style={{marginLeft:'5rem',marginTop:'2rem'}}><b>SubscriptionDetails</b></label>
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'3rem'}}>
             <label style={{margin:'0.5rem'}}>PaidByCode :</label>
             <TextField size="small" required placeholder="PaidByCode"  name="paidByCode"  value={values?.subscriptionDetails?.paidBy?.code} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,paidBy:{
               ...values.subscriptionDetails.paidBy,code:e.target.value
             }}})}}/>
             </Grid>
 
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'3rem'}}>
             <label style={{margin:'0.5rem'}}>Payer CnamNumber :</label>
             <TextField size="small" required placeholder="CnamNumber"  name="paidByCode"  value={values?.subscriptionDetails?.payer?.cnamNumber} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
               ...values.subscriptionDetails.payer,cnamNumber:e.target.value
             }}})}}/>
             </Grid>
 
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'3rem'}}>
             <label style={{margin:'0.5rem'}}>Payer EnrolmentId :</label>
             <TextField size="small" required placeholder="EnrolmentId"  name="enrolmentId"  value={values?.subscriptionDetails?.payer?.enrolmentId} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
               ...values.subscriptionDetails.payer,enrolmentId:e.target.value
             }}})}}/>
             </Grid>
 
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'3rem'}}>
             <label style={{margin:'0.5rem'}}>Payer FirstName :</label>
             <TextField size="small" required placeholder="FirstName"  name="firstName"  value={values?.subscriptionDetails?.payer?.firstName} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
               ...values.subscriptionDetails.payer,firstName:e.target.value
             }}})}}/>
             </Grid>
 
             <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'3rem'}}>
             <label style={{margin:'0.5rem'}}>Payer LastName :</label>
             <TextField size="small" required placeholder="LastName"  name="lastName"  value={values?.subscriptionDetails?.payer?.lastName} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
               ...values.subscriptionDetails.payer,lastName:e.target.value
             }}})}}/>
             </Grid>
 
 
 
 
 
 
             
         </Box>
         <Box display={'flex'} justifyContent={'center'} width={'100%'} marginBottom={'20px'}><input
       type="submit"
       className=' btn btn-success mt-4 rounded'
       variant='success'
       value='Submit'
       onClick={()=>{handleSubmit()}}
       style={{width:'15rem'}}
        /></Box></>}
       
      </Grid>

      
    </Box>
  );
};

export default UpdateUser;
