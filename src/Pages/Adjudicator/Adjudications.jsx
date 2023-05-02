import React, { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Session1 from "../../sections/adjudication/Session1";
import Session2 from "../../sections/adjudication/Session2";
import moment from "moment/moment";
import axios from "../../api/axios";
import useLocalStorage from "../../hooks/useLocalStorage";
const channelOptions = [
  { label: "Assisted", value: "ASSISTED" },
  { label: "Self-KYC", value: "SELF_KYC" },
  { label: "All", value: "ALL" },
];
const typeOptions = [
  { label: "Mobile", value: "MOBILE" },
  { label: "Web", value: "WEB" },
  { label: "All", value: "ALL" },
];
const Adjudications = () => {
  const navigate = useNavigate();

  const [adjCount, setAdjCount] = useState([
    {
      group: "",
      count: 0,
    },
  ]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [Channel, setChannel] = useState("ALL");
  const [Type, setType] = useState("ALL");
  const [{ accessToken, reportingRoleName, branchId, branchDistrict }] =
    useLocalStorage("jwtWithDetails");
  // ! Auto Logout

  useEffect(() => {
    if (reportingRoleName.includes("BRANCH")) {
      axios
        .get("adjudication/summary", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
            from:
              fromDate === ""
                ? "2022-01-01"
                : moment(fromDate).format("YYYY-MM-DD"),
            to:
              toDate.length === 0
                ? moment(new Date()).format("YYYY-MM-DD")
                : moment(toDate).format("YYYY-MM-DD"),
            clientType: Type,
            channel: Channel,
            branchId: branchId,
          },
        })
        .then(response => {
          setAdjCount(response.data.data.countsByStatus);
        });
    } else if (reportingRoleName.includes("DISTRICT")) {
      axios
        .get("adjudication/summary", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
            from:
              fromDate === ""
                ? "2022-01-01"
                : moment(fromDate).format("YYYY-MM-DD"),
            to:
              toDate.length === 0
                ? moment(new Date()).format("YYYY-MM-DD")
                : moment(toDate).format("YYYY-MM-DD"),
            clientType: Type,
            channel: Channel,
            district: branchDistrict,
          },
        })
        .then(response => {
          setAdjCount(response.data.data.countsByStatus);
        });
    } else {
      axios
        .get("adjudication/summary", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
            from:
              fromDate === ""
                ? "2022-01-01"
                : moment(fromDate).format("YYYY-MM-DD"),
            to:
              toDate.length === 0
                ? moment(new Date()).format("YYYY-MM-DD")
                : moment(toDate).format("YYYY-MM-DD"),
            clientType: Type,
            channel: Channel,
          },
        })
        .then(response => {
          setAdjCount(response.data.data.countsByStatus);
        });
    }
  }, [Channel, Type, accessToken, fromDate, toDate]);
  return (
    <Box component={"div"} width={1} height="calc(100vh - 145px)">
      <Box component={Stack} height="calc(100vh - 135px)" spacing={2}>
        <Session1
          channelOptions={channelOptions}
          typeOptions={typeOptions}
          setChannel={setChannel}
          setType={setType}
          authChannel={Channel}
          setFromDate={setFromDate}
          adjCount={adjCount}
          fromDate={fromDate}
          toDate={toDate}
          setToDate={setToDate}
          authType={Type}
        />
        <Session2
          fromDate={fromDate}
          channelOptions={channelOptions}
          typeOptions={typeOptions}
          toDate={toDate}
          Channel={Channel}
          Type={Type}
        />
      </Box>
    </Box>
  );
};

export default Adjudications;
