import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import UserListFilters from "../../sections/datasets/UserListFilters";
import UserListCard from "../../sections/metric/users/UserListCard";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import useResponse from "../../helper";
import axios from "../../api/axios";
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
const UsersPage = () => {
  const [{ accessToken, reportingRoleName, branchDistrict }] =
    useLocalStorage("jwtWithDetails");
  const { BranchApi } = useResponse();
  const [selectedFilter, setSelectedFilter] = useState("mobileNumber");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [districts, setDistricts] = useState([]);
  const [toDate, setToDate] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const [Channel, setChannel] = useState("ALL");
  const [Type, setType] = useState("ALL");

  const [roleFilter, setRoleFilter] = useState("role");
  const [roleFilter2, setRoleFilter2] = useState("role");
  const [roleSearch, setRoleSearch] = useState("");
  //! getBranchs Request
  useEffect(() => {
    BranchApi({ accessToken })
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
  }, [BranchApi, accessToken, branchDistrict, reportingRoleName]);

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
          <UserListFilters
            branches={branches}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            search={search}
            setSearch={setSearch}
            districts={districts}
            channelOptions={channelOptions}
            typeOptions={typeOptions}
            setFromDate={setFromDate}
            setToDate={setToDate}
            setChannel={setChannel}
            setType={setType}
            Channel={Channel}
            Type={Type}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            setRoleFilter2={setRoleFilter2}
            setRoleSearch={setRoleSearch}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <UserListCard
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
            roleFilter={roleFilter2}
            roleSearch={roleSearch}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UsersPage;
