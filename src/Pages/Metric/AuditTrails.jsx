import { Box, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import AuditTrailListFilters from "../../sections/metric/auditTrails/AuditTrailListFilters";
import AuditTrailListCard from "../../sections/metric/auditTrails/AuditTrailListCard";

import axios from "../../api/axios";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

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

const AuditTrails = () => {
  const [selectedFilter, setSelectedFilter] = useState("customerName");
  const [selectedFilter2, setSelectedFilter2] = useState("customerName");
  const [roleFilter, setRoleFilter] = useState("role");
  const [roleFilter2, setRoleFilter2] = useState("role");
  const [{ accessToken, reportingRoleName, branchDistrict }] =
    useLocalStorage("jwtWithDetails");
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
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
          <AuditTrailListFilters
            branches={branches}
            districts={districts}
            selectedFilter={selectedFilter}
            channelOptions={channelOptions}
            typeOptions={typeOptions}
            roleFilter={roleFilter}
            setSelectedFilter={setSelectedFilter}
            setSelectedFilter2={setSelectedFilter2}
            setRoleFilter={setRoleFilter}
            setRoleFilter2={setRoleFilter2}
            setFromDate={setFromDate}
            setToDate={setToDate}
            pageSize={pageSize}
            setSearch={setSearch}
            search={search}
            setRoleSearch={setRoleSearch}
            setChannel={setChannel}
            setType={setType}
            Channel={Channel}
            Type={Type}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <AuditTrailListCard
            fromDate={fromDate}
            toDate={toDate}
            selectedFilter={selectedFilter2}
            roleFilter={roleFilter2}
            branches={branches}
            pageSize={pageSize}
            channelOptions={channelOptions}
            typeOptions={typeOptions}
            setPageSize={setPageSize}
            search={search}
            roleSearch={roleSearch}
            Channel={Channel}
            Type={Type}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuditTrails;
