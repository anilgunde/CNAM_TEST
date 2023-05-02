import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Grid,
  Stack,
  Paper,
  useTheme,
  Box,
  Typography,
  ToggleButtonGroup,
  TextField,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CancelIcon from '@mui/icons-material/Cancel';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import DropDown from "../../components/Common/DropDown";
import StyledToggleButton from "../../components/Common/ToggleButton";
import { Bar as EnrollmentBar } from "react-chartjs-2";
import axios from "../../api/axios";
import useLocalStorage from "../../hooks/useLocalStorage";
import { toast } from "react-toastify";
import { URL } from "../../utils/constants";
import { CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import MetricCard from "../../components/Common/MetricCard";
import { Chart as ChartJS, registerables } from "chart.js";
import { Doughnut as EnrollmentTotal } from "react-chartjs-2";
ChartJS.register(...registerables);

const Enrollments = ({
  toggleData,
  channelOptions,
  typeOptions,

  enrollChannel,
  enrollType,
  setEnrollChannel,
  setEnrollType,
  enrollChannelDate,
  setEnrollChannelDate,
  enrollTypeDate,
  setEnrollDateType,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // const [{ accessToken }] = useLocalStorage("data");

  //console.log(accessToken)

  const tee = sessionStorage.getItem("accesst");

  //console.log('trail',tee)

  // ! State-Management
  const [enrollmentToggle, setEnrollmentToggle] = useState("today");
  const [dateToggle, setDateToggle] = useState(" ");
  const { t: trans } = useTranslation();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ! Response
  const [enrollCountData, setEnrollCountData] = useState({});
  const [apiEnrollChartData, setApiEnrollChartData] = useState({});
  const [apiEnrollChartDataDate, setApiEnrollChartDataDate] = useState([]);


  // setApiEnrollChartDataDate()
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekData = {
    labels: days,
  
    datasets: [
      {
        label: "Password",
        data: [61, 42, 63, 24, 45, 67, 88],
        borderColor: "red",
        barPercentage: 0.2,
        backgroundColor: ["#EE7F01"], 
      },

      {
        label: "npassword",
        data: [61, 42, 63, 24, 45, 67, 88],
        borderColor: "red",
        barPercentage: 0.2,
        backgroundColor: ["#41A62A"], 
      },
    ],
  };


  const weekConfig = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const enrollCount = [
    // { id: "TODAY", value: enrollCountData.today || 0 },
    // { id: "LAST WEEK", value: enrollCountData.lastWeek || 0 },
    // { id: "LAST MONTH", value: enrollCountData.lastMonth || 0 },
    // { id: "TOTAL", value: enrollCountData.total || 0 },




    // { id: "TODAY", value:  65 },
    // { id: "LAST WEEK", value: 583 },
    // { id: "LAST MONTH", value: 1274 },
    // { id: "TOTAL", value: 6894},




    { id: "STARTED", value:  apiEnrollChartDataDate.started || 0 },
    { id: "IN COMPLETED", value: apiEnrollChartDataDate.incomplete || 0 },
    { id: "COMPLETED", value: apiEnrollChartDataDate.completed || 0 },
    { id: "DEDUPE MATCHES", value: apiEnrollChartDataDate.dedupeMatches || 0},



  ];

  // ! Event Handlers for Enrollment
  const handleEnrollmentToggle = useCallback((_event, newValue) => {
    if (newValue) {
      setEnrollmentToggle(newValue);
      setDateToggle(" ");
    }
  }, []);
  const handleEnrollmentsChannelChange = useCallback(
    e => {
      setEnrollChannel(e.target.value);
      if (e.target.value === "SELF_KYC") {
        setEnrollType("MOBILE");
      } else {
      }
    },
    [setEnrollChannel, setEnrollType],
  );
  useEffect(() => {});
  const handleEnrollmentsTypeChange = useCallback(
    e => {
      setEnrollType(e.target.value);
    },
    [setEnrollType],
  );
  const handleDateRangeToggle = useCallback((_event, newValue) => {
    if (newValue) {
      setDateToggle(newValue);
      setEnrollmentToggle(" ");
    }
  }, []);

  const handleEnrollmentChannelChangeDate = useCallback(
    e => {
      setEnrollChannelDate(e.target.value);

    },
    [

    ],
  );
  const handleEnrollmentTypeChangeDate = useCallback(
    e => {
      setEnrollDateType(e.target.value);

    },
    [

    ],
  );


  const handleFChange = (newValue) => {
    setFromDate(newValue);
  };

  console.log('sadasdsa',fromDate)


  const handleSearch = useCallback(
    e => {
      
      e.preventDefault();
      
      // if (!fromDate) {
      //   return toast.error(`Please Enter  From Date`);
      // }
      // if (!toDate) {
      //   return toast.error(`Please Enter To Date`);
      // }
      // if (
      //   moment(fromDate, "DD/MM/YYYY").unix() >
      //   moment(toDate, "DD/MM/YYYY").unix()
      // ) {
      //   return toast.error(`From Date must be smaller than To Date`);
      // }
      // setFromDate(fromDate);
      // setToDate(toDate);
      //console.log('sdsadas',fromDate)
      
      //setIsLoading(true);

      
    },
    [],
  );

  useEffect(() => {
    axios.get("reporting/enrolment/metrics",{
      headers: {
                  "Content-Type": "application/json",
                   authorization: `Bearer ${tee}`,
                }
                
    }).then(response => {
              setApiEnrollChartDataDate(response?.data?.data);
              console.log('ttttttt',response?.data?.data)
            });
  },[])

  

  // useEffect(() => {
  //   if (!fromDate && !toDate) {
  //     toast.error(`Please Enter Dates`, {
  //       position: "top-center",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   } else {
  //     axios
  //       .get("https://api.boamw.aptiway.com/api/admin/reporting/enrollments", {
  //         headers: {
  //           "Content-Type": "application/json",
  //           authorization: `Bearer ${accessToken}`,
  //         },
  //         params: {
  //           clientType: enrollTypeDate,
  //           channel: enrollChannelDate,
  //           from: moment(fromDate).format("YYYY-MM-DD"),
  //           to: moment(toDate).format("YYYY-MM-DD"),
  //         },
  //       })
  //       .then(response => {
  //         setApiEnrollChartDataDate(response.data.data);
  //       });
  //   }
  // }, [accessToken, enrollChannelDate, enrollTypeDate, fromDate, toDate]);
  //   ! Calculation
  // const enrollChartData = useMemo(() => {
  //   const buckets = apiEnrollChartData?.[enrollmentToggle]?.buckets || [];
  //   return {
  //     labels:
  //       enrollmentToggle === "today"
  //         ? buckets
  //             .map(dem => dem.label.slice(0, 2))
  //             ?.map(dem =>
  //               dem > 12
  //                 ? dem - 12 + "PM"
  //                 : dem === "00"
  //                 ? (dem = "12AM")
  //                 : dem === "12"
  //                 ? dem + "PM"
  //                 : dem < 10
  //                 ? dem.substr(dem.length - 1) + "AM"
  //                 : dem + "AM",
  //             )
  //         : buckets.map(dem => dem.label),
  //     datasets: [
  //       {
  //         label: "Enrollments",
  //         data: buckets.map(el => el.value),
  //         backgroundColor: "#53CAED",
  //         barPercentage: 0.7,
  //       },
  //     ],
  //   };
  // }, [apiEnrollChartData, enrollmentToggle]);

  // const enrollTotalChartData = useMemo(() => {
  //   const buckets = apiEnrollChartData?.[enrollmentToggle]?.buckets || [];
  //   // const gif = buckets.map(el => el.value.password);
  //   // console.log("gif", gif);
  //   // const a = gif.reduce((acc, face) => acc + face, 0);
  //   // console.log("a", a);
  //   // ! DOUBT >>>>>
  //   return {
  //     datasets: [
  //       {
  //         label: "Total",
  //         data: [
  //           buckets.map(el => el.value).reduce((acc, value) => acc + value, 0),
  //         ],
  //         backgroundColor: ["#53CAED"],
  //         barPercentage: 0.7,
  //       },
  //     ],
  //   };
  // }, [apiEnrollChartData, enrollmentToggle]);

  // ! Date
  const enrollChartDataDate = useMemo(() => {
    return {
      labels: apiEnrollChartDataDate.buckets?.map(dem => dem.label) || [],
      datasets: [
        {
          label: "Enrollments",
          data: apiEnrollChartDataDate.buckets?.map(el => el?.value) || [],
          backgroundColor: "#53CAED",

          barPercentage: 0.7,
        },
      ],
    };
  }, [apiEnrollChartDataDate]);
  //! GRAPH Configerations for Enrollment
  const enrollGraphConfig = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const enrollmentTotalConfig = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      title: {
        display: true,
        position: "top",
        text: "Total",
      },
      legend: {
        display: false,
      },

      animation: {
        animateScale: true,
        animateRotate: true,
      },
      circumference: 2 * Math.PI,
      showAllTooltips: false,
      options: {
        responsive: true,
      },

      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const currentValue = context.raw,
              total = context.chart._metasets[context.datasetIndex].total;
            var percentage = parseFloat(
              ((currentValue / total) * 100).toFixed(1),
            );
            return currentValue + " (" + percentage + "%)";
          },
        },
      },
    },
  };

  //  ! API-Call
  // useEffect(() => {
  //   setIsLoading(true);
  //   if (reportingRoleName === "DISTRICT_REPORT_VIEWER") {
  //     setIsLoading(true);
  //     axios
  //       .get(URL.dashboard, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           authorization: `Bearer ${accessToken}`,
  //         },
  //         params: {
  //           clientType: enrollType,
  //           channel: enrollChannel,
  //           district: branchDistrict,
  //         },
  //       })
  //       .then(response => {
  //         setIsLoading(false);
  //         setEnrollCountData(response.data.data.counters.enrollment);
  //         setApiEnrollChartData(response.data.data.histograms.enrollment);
  //         setIsLoading(false);
  //       })
  //       .catch(() => {
  //         setIsLoading(false);
  //       });
  //   } else if (reportingRoleName === "BRANCH_REPORT_VIEWER") {
  //     setIsLoading(true);
  //     axios
  //       .get(URL.dashboard, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           authorization: `Bearer ${accessToken}`,
  //         },
  //         params: {
  //           clientType: enrollType,
  //           channel: enrollChannel,
  //           branchId: branchId,
  //         },
  //       })
  //       .then(response => {
  //         setIsLoading(false);
  //         setEnrollCountData(response.data.data.counters.enrollment);
  //         setApiEnrollChartData(response.data.data.histograms.enrollment);
  //         setIsLoading(false);
  //       })
  //       .catch(() => setIsLoading(false));
  //   } else {
  //     setIsLoading(true);
  //     axios
  //       .get(URL.dashboard, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           // "X-Client-Type": "WEB",
  //           authorization: `Bearer ${accessToken}`,
  //         },
  //         params: {
  //           clientType: enrollType,
  //           channel: enrollChannel,
  //         },
  //       })
  //       .then(response => {
  //         setIsLoading(false);
  //         setEnrollCountData(response.data.data.counters.enrollment);
  //         setApiEnrollChartData(response.data.data.histograms.enrollment);
  //         setIsLoading(false);
  //       })
  //       .catch(() => {
  //         setIsLoading(false);
  //       });
  //   }
  // }, [
  //   accessToken,
  //   branchDistrict,
  //   branchId,
  //   enrollChannel,
  //   enrollType,
  //   reportingRoleName,
  // ]);

  const Carddata = [
    {
      value: apiEnrollChartDataDate.started || 0,
      label: "Started",
      src: <PlayCircleFilledIcon/>,
    },
    {
      value: apiEnrollChartDataDate.incomplete || 0,
      label: "Incompleted",
      src: <CancelIcon/>,
    },
    {
      value: apiEnrollChartDataDate.completed || 0,
      label: "Completed",
      src: <AddTaskIcon/>,
    },
    {
      value: apiEnrollChartDataDate.dedupeMatches || 0,
      label: "Dedupematches",
      src: <ContentCopyIcon/>,
    },
    
  ];

  



  return (
    <Grid item xs={12} sm={12} md={12} lg={12} position={"relative"}>
      <Stack spacing={2}>
        <Paper
          elevation={5}
          sx={{
            padding: 2,
          }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Box flexGrow={1}>
              <Typography
                fontWeight={600}
                fontSize={{ xs: 18, md: 18, lg: 21 }}
                sx={{
                  position: "relative",
                  "&.MuiTypography-root::before ": {
                    content: "''",
                    position: "absolute",
                    height: 0.05,
                    width: { xs: 0.28, md: 0.18 },
                    backgroundColor: "#36454F",
                    left: 0,
                    right: -70,
                    bottom: -1,
                  },
                }}
              >
                {trans('registrations')}
              </Typography>
            </Box>


            <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="DD/MM/YYYY"
                      label="From Date"
                      value={fromDate}
                      disableFuture
                      onChange={handleFChange}
                      renderInput={params => (
                        <TextField
                          {...params}
                          size="small"
                          sx={{
                            "& .MuiInputBase-input": {
                              width: 85,
                            },
                            "& .MuiOutlinedInput-input": {
                              // border: `2px solid ${theme.palette.secondary.main}`,
                              borderRadius: "0",
                            },
                          }}
                          error={false}
                        />
                      )}
                    />
                    <DatePicker
                      inputFormat="DD/MM/YYYY"
                      label="To Date"
                      value={toDate}
                      disableFuture
                      shouldDisableDate={date =>
                        moment(fromDate, "DD/MM/YYYY", true).diff(date) > 0
                      }
                      onChange={newValue => {
                        setToDate(newValue);
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          size="small"
                          sx={{
                            "& .MuiInputBase-input": {
                              width: 85,
                            },
                          }}
                          error={false}
                        />
                      )}
                    />
                    <IconButton color="primary" onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </LocalizationProvider>

            {/* <DropDown
              options={channelOptions}
              value={enrollChannel}
                sx={dateToggle === "dateRange" && "none" }
              onChange={handleEnrollmentsChannelChange}
            /> */}
            {/* <DropDown
              options={typeOptions}
              value={enrollType}
              disabled={enrollChannel === "SELF_KYC" ? true : false}
              sx={dateToggle === "dateRange" && "none" }
              onChange={handleEnrollmentsTypeChange}
            /> */}
          </Stack>
          <Stack
            spacing={1}
            sx={{
              margin: 1,
              boxShadow: `0px 4px 2px -2px  ${theme.palette.primary.main}`,
            }}
          >
            <Grid flexWrap={"wrap"} container padding={{ xs: 2, md: 2, lg: 3 }}>
              {enrollCount.map(data => (
                <Grid item sm={3} md={3} key={data.id}>
                  <Typography
                    fontSize={{ xs: 18, md: 18, lg: 21 }}
                    align="center"
                    fontWeight={600}
                    sx={{ color: `${theme.palette.primary.main}` }}
                  >
                    {data.value}
                    {/* data.value */}
                  </Typography>
                  <Typography
                    fontSize={{ xs: 12, md: 12, lg: 14 }}
                    align="center"
                    fontWeight={"bold"}
                  >
                    {data.id}
                    {/* data.id */}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Stack>
          {isLoading ? (
            <Box
              padding="8rem 0rem 8rem 0rem"
              margin="0 auto"
              display="flex"
              justifyContent="center"
            >
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={1}
                marginY={5}
              >
                <Box component={"div"}>
                  {/* <ToggleButtonGroup
                    value={enrollmentToggle}
                    color="primary"
                    exclusive
                    orientation="horizontal"
                    onChange={handleEnrollmentToggle}
                    sx={{ gap: 1, flexWrap: "wrap" }}
                  >
                    {toggleData.map(({ value, label }) => (
                      <StyledToggleButton
                        key={value}
                        value={value}
                        sx={enrollmentToggle !== value && { border: "none" }}
                      >
                        {label}
                      </StyledToggleButton>
                    ))}
                  </ToggleButtonGroup> */}
                  {/* <ToggleButtonGroup
                    value={dateToggle}
                    color="primary"
                    exclusive
                    orientation="horizontal"
                    onChange={handleDateRangeToggle}
                    sx={{ marginLeft: "5px" }}
                  >
                    <StyledToggleButton
                      value={"dateRange"}
                      sx={dateToggle !== "dateRange" && { border: "none" }}
                    >
                      Date Range
                    </StyledToggleButton>
                  </ToggleButtonGroup> */}
                </Box>
                {/* //! DATE RANGE */}
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  spacing={1}
                  alignItems="center"
                  sx={dateToggle !== "dateRange" && { display: "none" }}
                >
                  
                  {/* <DropDown
                    options={channelOptions}
                    value={enrollChannelDate}
                    onChange={handleEnrollmentChannelChangeDate}
                  /> */}
                  {/* <DropDown
                    options={typeOptions}
                    value={enrollTypeDate}
                    disabled={enrollChannelDate === "SELF_KYC" ? true : false}
                    sx={dateToggle !== "dateRange" && "none" }
                    onChange={handleEnrollmentTypeChangeDate}
                  /> */}
                </Stack>
              </Stack>

              <Stack
                direction={"row"}
                spacing={1}
                sx={dateToggle === "dateRange" &&  "none" }
              >
                {/* <Box
                  height={"40vh"}
                  component={Paper}
                  elevation={5}
                  width={"70%"}
                  position="relative"
                  bgcolor={theme.palette.grey[100]}
                  sx={{
                    borderBottom: `4px solid ${theme.palette.primary.main}`,
                    "&.MuiPaper-root": {
                      borderRadius: 0,
                    },
                  }}
                >
                  <EnrollmentBar
                    options={enrollGraphConfig}
                    data={enrollChartData}
                  />
                </Box> */}
                {/* <Box
                  height={"40vh"}
                  component={Paper}
                  elevation={5}
                  width={"30%"}
                  position="relative"
                  bgcolor={theme.palette.grey[100]}
                  sx={{
                    borderBottom: `4px solid ${theme.palette.primary.main}`,
                    "&.MuiPaper-root": {
                      borderRadius: 0,
                    },
                  }}
                >
                  <EnrollmentTotal
                    options={enrollmentTotalConfig}
                    data={enrollTotalChartData}
                  />
                </Box> */}
              </Stack>
              <Stack
                direction={"row"}
                spacing={1}
                justifyContent="center"
                // padding={1}
                
              >
                {/* //! DateRange */}
                {/* <Box
                  component={Paper}
                  elevation={5}
                  height={"50vh"}
                  width={"100%"}
                  sx={{
                    borderBottom: `4px solid ${theme.palette.primary.main}`,
                  }}
                  bgcolor={theme.palette.grey[100]}
                  position="relative"
                >
                  <EnrollmentBar
                    data={weekData} options={weekConfig}
                  />
                </Box> */}






                <Box style={{'flexWrap':'wrap'}} display={'flex'}
                   flexDirection={'row'} justifyContent={'center'} gap={1} width={'100%'} padding={0} margin={0}>

               
                {Carddata.map(({value, label,src}) =>(
                <Box
                  // gridColumn={{ lg: "span 3", md: "span 2", xs: "span 2" }}
                  flexWrap={'wrap'}
                  key={label}
                 
                >
                  <MetricCard
                  
                    sx={{
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      display: "flex",
                      flexDirection: "column",
                      
                    }}
                  >
                  
                  <Box
                    height={'3rem'} width={'3rem'}
                    sx={{ backgroundColor: `${theme.palette.secondary.main}` }}
                   style={{borderRadius:'50%'}}
                   display={'flex'}
                   flexDirection={'row'} alignItems={'center'} justifyContent={'center'}
                  >
                   {src} 
                  </Box>
                  <Box component={"div"}>
                    <Typography fontSize={'18px'} align="center">
                      {value}
                    </Typography>
                    <Typography fontSize={'18px'} align="center">
                      {label}
                    </Typography>
                  </Box>
                  
                  </MetricCard>
                </Box>
                ))}
                 </Box>
              </Stack>
            </>
          )}
        </Paper>
      </Stack>
    </Grid>
  );
};

export default Enrollments;
