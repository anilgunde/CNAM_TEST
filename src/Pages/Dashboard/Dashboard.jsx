import { useState, useCallback } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Box, Stack, Grid } from "@mui/material";
import AuthenticationCard1 from "../../sections/dashboard/AuthenticationCard1";
import EnrollmentsCard1 from "../../sections/dashboard/EnrollmentsCard";
import EnrollmentsGraph from "../../sections/dashboard/EnrollmentsGraph";
import AuthenticationGraph from "../../sections/dashboard/AuthenticationGraph";
ChartJS.register(...registerables);

const Dashboard = () => {
  const [enrollChannel, setEnrollChannel] = useState("assisted");
  const [enrollType, setEnrollType] = useState("android");

  const [authChannel, setAuthChannel] = useState("assisted");
  const [authType, setAuthType] = useState("android");

  const handleEnrollmentsChannelChange = useCallback(e => {
    setEnrollChannel(e.target.value);
  }, []);
  const handleEnrollmentsTypeChange = useCallback(e => {
    setEnrollType(e.target.value);
  }, []);

  const handleAuthenticationChannelChange = useCallback(e => {
    setAuthChannel(e.target.value);
  }, []);
  const handleAuthenticationTypeChange = useCallback(e => {
    setAuthType(e.target.value);
  }, []);

  useState("android");
  // const [open, setOpen] = useState(false);
  // const [backdrop, setBackdrop] = useState("static");
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  // const [value, setValue] = useState("");
  const [authFormatToggle, setAuthFormatToggle] = useState(null);

  const AuthToggleChange = useCallback(
    (_event, updated) => {
      setAuthFormatToggle(updated);
    },
    [setAuthFormatToggle],
  );
  // var date = new Date(value);
  // var finaldate =
  //   date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

  //BAR

  return (
    <>
      {/* <Modal
        backdrop={backdrop}
        keyboard={false}
        open={open}
        onClose={handleClose}
      >
        <Modal.Header style={{ position: "relative", left: "12rem" }}>
          <Modal.Title>Please Select Date</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ textAlign: "center" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              inputFormat="DD/MM/YYYY"
              value={value}
              onChange={newValue => {
                setValue(newValue);
              }}
              renderInput={params => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal> */}
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack gap={2}>
              <EnrollmentsCard1
                enrollChannel={enrollChannel}
                handleEnrollmentsChannelChange={handleEnrollmentsChannelChange}
                enrollType={enrollType}
                handleEnrollmentsTypeChange={handleEnrollmentsTypeChange}
              />
              <EnrollmentsGraph />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack gap={2}>
              <AuthenticationCard1
                authChannel={authChannel}
                authType={authType}
                handleAuthenticationChannelChange={
                  handleAuthenticationChannelChange
                }
                handleAuthenticationTypeChange={handleAuthenticationTypeChange}
              />
              <AuthenticationGraph />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
