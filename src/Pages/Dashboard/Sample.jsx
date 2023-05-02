import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
// import "chartjs-adapter-date-fns";
import Authentications from "../../sections/dashboard/Authentications";
import Enrollments from "../../sections/dashboard/Enrollments";

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

const Sample = () => {
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

  // useEffect(() => {
  //   if (
  //     enrollChannel === "SELF_KYC" ||
  //     authChannel === "SELF_KYC" ||
  //     enrollChannelDate === "SELF_KYC" ||
  //     authChannelDate === "SELF_KYC"
  //   ) {
  //     setTypeOptions(typeOptionss.filter(dem => dem.value === "MOBILE"));
  //   } else {
  //     setTypeOptions(typeOptionss);
  //   }
  // }, []);

  return (
    <Box>
      <Grid container gap={2}>
        <Enrollments
          toggleData={toggleData}
          channelOptions={channelOptions}
          typeOptions={typeOptions}
          enrollChannel={enrollChannel}
          enrollType={enrollType}
          setEnrollChannel={setEnrollChannel}
          setEnrollType={setEnrollType}
          enrollChannelDate={enrollChannelDate}
          setEnrollChannelDate={setEnrollChannelDate}
          enrollTypeDate={enrollTypeDate}
          setEnrollDateType={setEnrollDateType}
        />
        <Authentications
          // toggleData={toggleData}
          // channelOptions={channelOptions}
          // typeOptions={typeOptions}
          // authChannel={authChannel}
          // authType={authType}
          // setAuthChannel={setAuthChannel}
          // setAuthType={setAuthType}
          // authChannelDate={authChannelDate}
          // setAuthChannelDate={setAuthChannelDate}
          // authTypeDate={authTypeDate}
          // setAuthDateType={setAuthDateType}
        />
      </Grid>
    </Box>
  );
};

export default Sample;
