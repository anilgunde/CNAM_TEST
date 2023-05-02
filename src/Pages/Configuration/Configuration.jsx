import { useState, useEffect } from "react";
import { Box, Grid, Radio, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import configimage from "../../assets/config.png";
import Button from '@mui/material/Button';
// import "chartjs-adapter-date-fns";
import Authentications from "../../sections/dashboard/Authentications";
import Enrollments from "../../sections/dashboard/Enrollments";
//import { Button } from "bootstrap";

// ! Constance
const channelOptions = [
  { label: "Assisted", value: "ASSISTED" },
  { label: "Self-KYC", value: "SELF_KYC" },
  { label: "All", value: "ALL" },
];
const typeOptionss = [
  { label: "Mobile", value: "MOBILE" },
  { label: "Web", value: "WEB" },
  { label: "All", value: "ALL" },
];

const toggleData = [
  { label: "TODAY", value: "today" },
  { label: "LAST WEEK", value: "lastWeek" },
  { label: "LAST MONTH", value: "lastMonth" },
  // { label: "Total", value: "total" },
];

// const useStyles = makeStyles(() => {
//   return createStyles({
//       heading: {
//           color: '#F3AD14',
//           fontSize: '1.4rem',
//           marginLeft: '2rem',
//       },
//       subHeading: {
//           color: '#F3AD14',
//           fontSize: '1rem',

//           marginTop: '2rem',
//           borderBottom: '1px solid #F1AB15'

//       }, mandatory: {
//           color: '#B00020',
//           fontSize: '.7rem',
//       }, mandatoryStar: {
//           color: '#B00020',
//           fontSize: '1rem',
//       }
//       , formLabel: {
//           fontSize: '.8rem',
//           margin: '.5rem'
//       },
//       submitButton: {
//           background: '#F1AB15',
//           fontSize: '1.125rem', color: 'black',
//           '&:hover': {
//               background: '#F1AB15',
//           },
//           boxShadow: 'unset',
//           height: '2.8rem',
//           borderRadius: '16px',
//           width: '26rem',
//           marginTop: '2.81rem'
//       }
//   })
// });
const Configuration = () => {
  // const classes = useStyles();
  const [typeOptions, setTypeOptions] = useState(typeOptionss);

  const [enrollChannel, setEnrollChannel] = useState("ALL");
  const [enrollType, setEnrollType] = useState("ALL");
  const [authChannel, setAuthChannel] = useState("ALL");
  const [authType, setAuthType] = useState("ALL");
  // ! DATE State_Management
  const [enrollChannelDate, setEnrollChannelDate] = useState("ALL");
  const [enrollTypeDate, setEnrollDateType] = useState("ALL");
  const [authChannelDate, setAuthChannelDate] = useState("ALL");
  const [authTypeDate, setAuthDateType] = useState("ALL");
  const [selectedValue, setSelectedValue] = useState('a');

  useEffect(() => {
    if (
      enrollChannel === "SELF_KYC" ||
      authChannel === "SELF_KYC" ||
      enrollChannelDate === "SELF_KYC" ||
      authChannelDate === "SELF_KYC"
    ) {
      setTypeOptions(typeOptionss.filter(dem => dem.value === "MOBILE"));
    } else {
      setTypeOptions(typeOptionss);
    }
  }, []);
  const theme = useTheme();
  const downLg = useMediaQuery(theme.breakpoints.down('md'));
  return (
    
    <Box>
      
      <Grid container gap={4} style={{background:'#FFFFFF',borderRadius:'0.5rem'}}>
      
        <Box  width={downLg ? '100%' : '45%'} >
          <Box style={{marginLeft:'28rem',marginTop:'2rem'}}><img src={configimage}  alt='' style={{height:'50%'}} /></Box>
        <label style={{marginLeft:'25rem',marginTop:'2rem'}}>Mandatory</label>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'15rem'}}>
            <label style={{margin:'0.5rem'}}>Name</label>
            <Radio style={{marginRight:'-2rem'}} checked={selectedValue === 'a'} value='a'></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'15rem'}}>
            <label style={{margin:'0.5rem'}}>Mother Name</label>
            <Radio style={{marginRight:'-2rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'15rem'}}>
            <label style={{margin:'0.5rem'}}>Father's Name</label>
            <Radio style={{marginRight:'-2rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'15rem'}}>
            <label style={{margin:'0.5rem'}}>Gender</label>
            <Radio style={{marginRight:'-2rem'}}></Radio>  
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'15rem'}}>
            <label style={{margin:'0.5rem'}}>Mobile Number</label>
            <Radio style={{marginRight:'-2rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'15rem'}}>
            <label style={{margin:'0.5rem'}}>Email Id</label>
            <Radio style={{marginRight:'-2rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'15rem'}}>
            <label style={{margin:'0.5rem'}}>Nationality</label>
            <Radio style={{marginRight:'-2rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} style={{marginLeft:'15rem'}}>
            <label style={{margin:'0.5rem'}}>Mother Tongue</label>
            <Radio style={{marginRight:'-2rem'}}></Radio>
            </Grid>
            {/* <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <label style={{margin:'0.5rem'}}>Date of Birth</label>
            <TextField type='text' variant='outlined' size='small' style={{width: '60%'}}/>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <label style={{margin:'0.5rem'}}>Age</label>
            <TextField type='text' variant='outlined' size='small' style={{width: '60%'}}/>
            </Grid> */}
        </Box>

        <Box  width={downLg ? '100%' : '45%'}>
        
            <label style={{marginLeft:'8rem',marginTop:'7rem'}}>Optional</label>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <Radio style={{marginLeft:'9rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <Radio style={{marginLeft:'9rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <Radio style={{marginLeft:'9rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <Radio style={{marginLeft:'9rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <Radio style={{marginLeft:'9rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <Radio style={{marginLeft:'9rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <Radio style={{marginLeft:'9rem'}}></Radio>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <Radio style={{marginLeft:'9rem'}}></Radio>
            </Grid>
            {/* <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <label style={{margin:'0.5rem'}}>Date of Birth</label>
            <TextField type='text' variant='outlined' size='small' style={{width: '60%'}}/>
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'}>
            <label style={{margin:'0.5rem'}}>Age</label>
            <TextField type='text' variant='outlined' size='small' style={{width: '60%'}}/>
            </Grid> */}
        </Box>
        <Box><input
      type="submit"
      className=' btn btn-success mt-4 rounded'
      variant='success'
      value='Submit'
      style={{width:'15rem',marginLeft:'24rem',marginBottom:'4rem'}}
       /></Box>
      </Grid>

      
    </Box>
  );
};

export default Configuration;
