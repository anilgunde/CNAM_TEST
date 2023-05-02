import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import axios from "../../api/axios";
import useLocalStorage from "../../hooks/useLocalStorage";
import RegistrationsListFilters from "../../sections/metric/registrations/RegistrationsListFilters";
import RegistrationsListCard from "../../sections/metric/registrations/RegistrationsListCard";

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

const Registrations = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [{ accessToken, reportingRoleName, branchDistrict }] =
    useLocalStorage("jwtWithDetails");
  const [selectedFilter, setSelectedFilter] = useState("branch");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [Channel, setChannel] = useState("ALL");
  const [Type, setType] = useState("ALL");

  //! getBranchs Request
  useEffect(() => {
    axios
      .get(`profile/customer/branch`, {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => {
        const { labelValues } = res?.data?.data;
        if (reportingRoleName === "DISTRICT_REPORT_VIEWER") {
          const branch = labelValues.filter(
            district => district.district === branchDistrict,
          );
          setBranches(branch);
        } else {
          setBranches(
            labelValues.sort((a, b) => a.label.localeCompare(b.label)),
          );
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [accessToken, branchDistrict, reportingRoleName]);

  //! getDistricts Request
  useEffect(() => {
    axios
      .get(`profile/customer/district`, {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => {
        // ! Typo
        const { labelValues } = res?.data?.data;
        setDistricts(
          labelValues.sort((a, b) => a.label.localeCompare(b.label)),
        );
      })
      .catch(err => {
        console.error(err);
      });
  }, [accessToken]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <RegistrationsListFilters
            branches={branches}
            districts={districts}
            selectedFilter={selectedFilter}
            channelOptions={channelOptions}
            typeOptions={typeOptions}
            setSelectedFilter={setSelectedFilter}
            setFromDate={setFromDate}
            setToDate={setToDate}
            pageSize={pageSize}
            setSearch={setSearch}
            search={search}
            setChannel={setChannel}
            setType={setType}
            Channel={Channel}
            Type={Type}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <RegistrationsListCard
            selectedFilter={selectedFilter}
            branches={branches}
            setSearch={setSearch}
            districts={districts}
            fromDate={fromDate}
            pageSize={pageSize}
            channelOptions={channelOptions}
            typeOptions={typeOptions}
            Channel={Channel}
            Type={Type}
            toDate={toDate}
            setPageSize={setPageSize}
            search={search}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Registrations;
