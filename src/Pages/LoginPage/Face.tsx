import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Card, CardContent, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { toast } from "react-toastify";
import Webcam from "react-webcam";
import { Button } from "react-bootstrap";
import useLocalStorage from "../../hooks/useLocalStorage";
import useResponse from "../../helper";
import { PATHS } from "../../utils/constants";
import axios from "../../api/axios";
const videoConstraints = {
  width: 519,
  height: 400,
  facingMode: "user",
};

const Face = () => {
  const { FaceApi } = useResponse();
  const navigate = useNavigate();
  // ! useCase of useLocalStorage Hook
  const [{ identityNumber }] = useLocalStorage("Details");
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [cropped, setCropped] = useState<boolean>(false);
  const webcamRef = useRef<any>(null);
  const [image, setImage] = useState<string | any>("");
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef<any>(null);

  const [deviceId, setDeviceId] = React.useState({});
  const [devices, setDevices] = React.useState([]);

  const handleDevices = React.useCallback(
    mediaDevices =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices],
  );

  //   ! Functionality

  const handleCropChange = useCallback(() => {
    const croppedImgData = imgRef.current.cropper
      .getCroppedCanvas()
      .toDataURL("image/jpeg", 0.5);
    setCroppedImage(croppedImgData);
  }, []);

  const cropImage = () => {
    setImage(croppedImage);
    setCropped(true);
  };

  const capture = useCallback(() => {
    setImage(webcamRef!.current!.getScreenshot());
  }, [webcamRef]);

  const handleNext = useCallback(() => {
    FaceApi({ identityNumber, croppedImage })
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
  }, [FaceApi, croppedImage, identityNumber, navigate]);

  const retake = () => {
    setCroppedImage("");
    setImage("");
    setCropped(false);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <div>
      <div
        className='d-flex justify-content-center align-items-center'
        id='contentContainer'
      >
        <div id='containerLeft'>
          <Box style={{ paddingLeft: "35px" }}>
            <Box
              display={"flex"}
              border={"1px solid black"}
              flexDirection={"row"}
              width={"21.5rem"}
              marginTop={"6.25rem"}
            >
              <Card
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <CardContent>
                  {devices.map((device, key) => (
                    <div>
                      <button
                        style={{
                          background: "#F1AB15",
                          fontSize: "1.12rem",
                          color: "white",
                          "&:hover": {
                            background: "#F1AB15",
                          },
                          boxShadow: "none",
                          height: "3.5rem",
                          borderRadius: "16px",
                          width: "16rem",
                          marginTop: ".60rem",
                          cursor: "pointer",
                          borderColor: "#F1AB15",
                        }}
                        key={device?.deviceId}
                        onClick={() => setDeviceId(device?.deviceId)}
                      >
                        {device.label?.includes("USB")
                          ? "FACE (ELOAM)"
                          : device.label?.includes("AF")
                          ? "DOCUMENT (ELOAM)"
                          : device.label}
                      </button>
                      <br />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </div>

        {isLoading ? (
            <Box sx={{ margin: "30%", marginLeft: "45%" }}>
              <CircularProgress color='primary' />
            </Box>
          ):(
        <div id='containerRight'>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignContent={"center"}
            justifyContent={"center"}
            height={"20.9rem"}
            width={"100%"}
          >
            {/* //! image.length !== 0 ? "Activate WebCam " : cropper === true and cropperImage.length ? Show Image : <Cropper />   */}

            {!image?.length ? (
              <Webcam
                audio={false}
                height={300}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                width={500}
                style={{
                  borderRadius: 5,
                }}
                //videoConstraints={videoConstraints}
                videoConstraints={{
                  width: 519,
                  height: 400,
                  //facingMode,
                  deviceId,
                }}
              />
            ) : (
              <Box marginTop={".5rem"}>
                {cropped && croppedImage?.length ? (
                  <img
                    alt='sda'
                    style={{
                      width: 450,
                      height: 300,
                    }}
                    src={croppedImage}
                  />
                ) : (
                  <Cropper
                    cropend={() => handleCropChange()}
                    ref={imgRef}
                    src={image as string}
                    zoomable={false}
                    autoCropArea={-0.01}
                    background={false}
                  />
                )}
              </Box>
            )}
          </Box>

          <Box
            display={"flex"}
            flexDirection={"column"}
            alignContent={"center"}
            justifyContent={"center"}
          >
            {/* //! image.length !== 0 ? "Capture-btn" : "Retake-btn"   */}
            {!image?.length ? (
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
                  capture();
                }}
              >
                Capture
              </Button>
            ) : (
              <Box
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant={"contained"}
                  style={{
                    background: "#F1AB15",
                    fontSize: "1.125rem",
                    boxShadow: "unset",
                    height: "2.8rem",
                    borderRadius: "16px",
                    width: "26rem",
                    marginRight: "2rem",
                  }}
                  onClick={() => {
                    retake();
                  }}
                >
                  Re-take
                </Button>

                {/* //! cropper  === true ? "Continue-btn" : "Crop-btn"   */}

                {cropped ? (
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
                  >
                    Continue
                  </Button>
                ) : (
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
                      cropImage();
                    }}
                  >
                    Crop
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </div>
        )}
      </div>
    </div>
  );
};

export default Face;
