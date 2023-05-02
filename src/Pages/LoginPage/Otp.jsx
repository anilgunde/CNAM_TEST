import { useState, useCallback, useEffect, useRef } from "react";
// import LoadingSpinner from "../../components/Common/Spinner";
import image from "../../assets/LOGO-CNAM.png";
import useResponse from "../../helper";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/constants";
import { toast } from "react-toastify";
import { Box, CircularProgress,Button } from "@mui/material";
import axios from "../../api/axios";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
const OTP = () => {
  const navigate = useNavigate();
  // const { LoginApi } = useResponse();
const login = JSON.parse(sessionStorage?.getItem('login'))
const mobile = sessionStorage?.getItem('mobile')
const password = sessionStorage?.getItem('password')
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t} = useTranslation();
  const [code, setCode] = useState("fr");

  const [isValid, setValid] = useState(false);

useEffect(()=>{
    if(!login?.data?.otpRequired){
        navigate('/')
    }
},[])


  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  const [values, setValues] = useState(['', '', '', '']);

  const handleInput = (event, index) => {
    if (!event.target.validity.patternMismatch) {
    const newValues = [...values];
    newValues[index] = event.target.value;
    setValues(newValues);
    if (event.target.value.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    } else if (event.target.value.length === 0 && index > 0) {
      inputRefs[index - 1].current.focus();
    }
}
else{
    return
}
  };
  const displayValues = values.join('');
  const length = displayValues.length;
  // const HandelSubmit = useCallback( ()=>{
    
  //   navigate(PATHS.dashboard);

  // },[])

  // useEffect(() => {
  //   axios.defaults.headers.common.authorization = "";
  //   sessionStorage.clear();
  // }, []);
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
  const HandelSubmit = useCallback(
    async e => {
    //   e.preventDefault();
      if (length!==4) {
        toast.error(`Please enter 4 digit OTP`);
        // console.log(login)
        // console.log(length)
        return
      } 
      // else if (mobile.length < 9) {
      //   toast.error(`Please enter valid Mobile Number`);
      // } 
      else  {
        setIsLoading(true);
        axios?.post('/api/auth/otp/verify',
                {
                    "otpChallengeId": login?.data?.otpChallengeId,
                    "otp": displayValues,
                    "deviceId": "ba6528dfbf8745968f457756ee732891",
                    "model": "Google Pixel 7",
                    "operatingSystem": "WINDOWS",
                    "networkConnectionMode": "ETHERNET","location": {
                        "latitude": latitude,
                        "longitude": longitude
                        }
                })
          .then(res => {
            if(res.data.data?.accessToken?.length){
              const data = JSON.stringify(res.data)
            const response = sessionStorage?.setItem('login',data)
              navigate('/dashboard')
            }
            if(res.data.data?.code==='E401-51-004'){
                setIsLoading(false);
                setValues(['','','',''])
                return toast.error("OTP challenge expired,please request another OTP");
            }
            if(res.data.data?.code==='E401-51-005'){
                setIsLoading(false);
                setValues(['','','',''])
                return toast.error("OTP not matched,Please enter a valid OTP");
            }
            if(res.data.data.kind==='REGISTRATION_OTP_VERIFIED'){
              navigate('/')
              return toast.success("Registration successful, please login again");
            }
          })
          .catch((err) => {
            // setMobile("");
            // setPassword("");
            setIsLoading(false);
            // return toast.error("Number Entered is Incorrect");
          }).finally(()=>{setIsLoading(false)});
      }
    },
    [length, navigate,displayValues],
  );
const handleReSend =()=>{
    if(mobile){
        setIsLoading(true)
        setValues(['','','',''])
    axios?.post('/api/auth/token',
                {
                    mobileNumber:`+225${mobile}`,
                    password:password,
                    "deviceId": "ba6528dfbf8745968f457756ee732891",
                    "model": "Google Pixel 7",
                    "operatingSystem": "ANDROID",
                    "networkConnectionMode": "WIFI",
                }).then(res => {
                    const data = JSON.stringify(res.data)
                    const response = sessionStorage?.setItem('login',data)
                    const otp = sessionStorage?.setItem('otp',data)
                }).catch((err)=>{}).finally(()=>{setIsLoading(false)})
    }
}
const handleKeyUp = (e) =>{
    if (e.keyCode === 13) {
    HandelSubmit() 
}
    // console.log('hhh')
}
  return (
    <>
      <div
        className='d-flex justify-content-center align-items-center'
        id='contentContainer'
      >
        {/* <div id='containerLeft'>
          <h2 id='regTextTwo'>Bank 24/7 with our virtual banking</h2>
          <p id='regType'>Discover more ways to bank than ever</p>
        </div> */}
        
        <div id='containerRight'>

        <Button
        onClick={() => {
          i18next.changeLanguage("en");
          setCode("en");
        }}
        style={code === "fr" ? { display: "block",marginLeft:'80%',marginTop:'-3%' } : { display: "none",marginLeft:'80%',marginTop:'-3%' }}
        
        variant='contained'
      >
        En
      </Button>
      <Button
        onClick={() => {
          i18next.changeLanguage("fr");
          setCode("fr");
        }}
        style={code === "en" ? { display: "block",marginLeft:'80%',marginTop:'-3%' } : { display: "none",marginLeft:'80%',marginTop:'-3%' }}
        variant='contained'
      >
        Fr
      </Button>
       
          {isLoading ? (
            <Box sx={{ margin: "45%", marginLeft: "42%" }}>
              <CircularProgress color='primary' />
            </Box>
          ) : (
            <>
              <center>
                <img src={image} id='logoImg' alt='' />
              </center>
              <br />
              <div style={{textAlign:'center',fontSize:'14px',marginBottom:'30px',marginTop:'20px'}}>
                <p>{t('otp1')}</p>
                <p style={{'marginTop':'-15px'}}>{t('otp2')}</p>
              </div>
             
              <div className="otp-box" style={{'display':'flex',justifyContent:'center'}}>

      <input ref={inputRefs[0]} value={values[0]} style={{width: '40px',height: '40px',textAlign: 'center',fontSize: '24px',margin: '0 5px',border:'1px solid black'}} type="text" maxLength="1" onInput={(event) => handleInput(event, 0)} onKeyUp={handleKeyUp} pattern='^[0-9]*$'/>

      <input ref={inputRefs[1]} value={values[1]} style={{width: '40px',height: '40px',textAlign: 'center',fontSize: '24px',margin: '0 5px',border:'1px solid black'}}  type="text" maxLength="1" onInput={(event) => handleInput(event, 1)} onKeyUp={handleKeyUp} pattern='^[0-9]*$'/>

      <input ref={inputRefs[2]} value={values[2]} style={{width: '40px',height: '40px',textAlign: 'center',fontSize: '24px',margin: '0 5px',border:'1px solid black'}}  type="text" maxLength="1" onInput={(event) => handleInput(event, 2)} onKeyUp={handleKeyUp} pattern='^[0-9]*$'/>

      <input ref={inputRefs[3]} value={values[3]} style={{width: '40px',height: '40px',textAlign: 'center',fontSize: '24px',margin: '0 5px',border:'1px solid black'}}  type="text" maxLength="1" onInput={(event) => handleInput(event, 3)} onKeyUp={handleKeyUp} pattern='^[0-9]*$'/>

    </div>
        <div style={{'marginLeft':'35px'}}>
              <Button style={{textTransform:'NONE',color:'#1A73E8'}} onClick={()=>{handleReSend()}}>{t('resend')}</Button>
        </div>
                <Box marginTop={'3.5rem'}>
                <input
                  type='submit'
                  className=' btn btn-success w-100 mt-4 rounded'
                  variant='success'
                  value={t('submit')}
                  onClick={HandelSubmit}
                  // disabled={!isValid}
                />
                <input
                  type='submit'
                  className=' btn btn-white w-100 mt-2 rounded'
                  variant='success'
                  style={{color:'#1A73E8'}}
                  value={t('back')}
                  onClick={()=>{navigate('/')}}
                  // disabled={!isValid}
                />
                </Box>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OTP;
