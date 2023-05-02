import React, { useCallback, useState } from "react";
import {
  Stack,
  Typography,
  Paper,
  Box,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  Tooltip,
} from "@mui/material";
import moment from "moment";
import MetricCard from "../../components/Common/MetricCard";
import enrollStart from "../../assets/enrollStart.png";
import existingCustomer from "../../assets/existingCustomer.png";
import customerLink from "../../assets/customerLink.png";
import customerAmendement from "../../assets/customerAmendement.png";
import customerCreated from "../../assets/userCreate.png";
import mobileNumber from "../../assets/mobile.png";
import debitCard from "../../assets/debitCard.png";
import onlineBanking from "../../assets/onlineBanking.png";
import { useEffect } from "react";
import usesessionStorage from "../../hooks/useLocalStorage";
import axios from "../../api/axios";

import { Button, TextField } from "@mui/material";
// import CustomDatePicker from "../../components/Common/DatePicker";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import DropDown from "../../components/Common/DropDown";
import { DROPOps } from "../../utils/constants";
import { CircularProgress } from "@mui/material";

import {ToastContainer, toast } from "react-toastify";
const ToggleData = [
  { value: "face", label: "Face" },
  { value: "finger", label: "FingerPrint" },
  { value: "password", label: "Password" },
];

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

const MetricReports = () => {
  const [{ accessToken, reportingRoleName, branchId, branchDistrict }] =
    usesessionStorage("jwtWithDetails");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  //console.log("fromDate", moment(fromDate).format("YYYY/MM/DD"));

  const [authenticationOptions, setAutheticationOptions] = useState("face");

  const setAutheticationOptionsChange = useCallback((_event, updatedFormat) => {
    if (updatedFormat) {
      setAutheticationOptions(updatedFormat);
    }
  }, []);

  const [authChannel, setAuthChannel] = useState("ALL");
  const [authType, setAuthType] = useState("ALL");
  const [faceAuthSuccess, setFaceAuthSuccess] = useState("");
  const [faceAuthFail, setFaceAuthFail] = useState("");
  const [passwordAuthSuccess, setPasswordAuthSuccess] = useState("");
  const [passwordAuthFail, setPasswordAuthFail] = useState("");
  const [fingerAuthFail, setfingerAuthFail] = useState("");
  const [fingerAuthSuccess, setfingerAuthSuccess] = useState("");
  const [enrollSuccess, setEnrollSuccess] = useState("");
  const [enrollFail, setEnrollFail] = useState("");
  const [typeAuthOptionss, setAuthTypeOptionss] = useState(typeOptions);

  const handleAuthenticationsChannelChange = e => {
    setAuthChannel(e.target.value);
    if (e.target.value === "SELF_KYC") {
      setAuthType("MOBILE");
      const a = typeOptions.filter(el => el.value === "MOBILE");
      setAuthTypeOptionss(a);
    } else {
      setAuthTypeOptionss(typeOptions);
    }
    if (reportingRoleName === "BRANCH_REPORT_VIEWER") {
      setIsLoading(true);
      axios
        .get("admin/reporting/events/metrics", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
            from: fromDate2?.length!=0 ? moment(fromDate2).format("YYYY-MM-DD"): '2022-01-01',
            to: toDate2?.length!=0 ? moment(toDate2).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            channel: e.target.value,
            clientType: e.target.value === "SELF_KYC" ? "MOBILE" : authType,

            branch: branchId,
          },
        })
        .then(response => {
          setList(response.data.data);
          setIsLoading(false);
          setAuthfacesucess(
            (response.data.data.counters.faceAuthenticationsSucceeded /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );
          setFaceAuthSuccess(
            response.data.data.counters.faceAuthenticationsSucceeded,
          );
          setFaceAuthFail(
            response.data.data.counters.faceAuthenticationsFailed,
          );
          setPasswordAuthSuccess(
            response.data.data.counters.passwordAuthenticationsSucceeded,
          );
          setPasswordAuthFail(
            response.data.data.counters.passwordAuthenticationsFailed,
          );
          setfingerAuthFail(
            response.data.data.counters.fingerprintAuthenticationsSucceeded,
          );
          setfingerAuthSuccess(
            response.data.data.counters.fingerprintAuthenticationsFailed,
          );
          setEnrollComplete(
            (response.data.data.counters.enrollmentsStarted /
              (response.data.data.counters.enrollmentsStarted +
                response.data.data.counters.enrollmentsCompleted)) *
              100,
          );
          setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
          setEnrollFail(response.data.data.counters.enrollmentsStarted);
          setEnrollInComplete(
            (response.data.data.counters.enrollmentsCompleted /
              (response.data.data.counters.enrollmentsCompleted +
                response.data.data.counters.enrollmentsStarted)) *
              100,
          );

          setAuthfacefail(
            (response.data.data.counters.faceAuthenticationsFailed /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );

          setAuthfingersuccess(
            (response.data.data.counters.fingerprintAuthenticationsSucceeded /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthfingerfail(
            (response.data.data.counters.fingerprintAuthenticationsFailed /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordsuccess(
            (response.data.data.counters.passwordAuthenticationsSucceeded /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordfail(
            (response.data.data.counters.passwordAuthenticationsFailed /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else if (reportingRoleName === "DISTRICT_REPORT_VIEWER") {
      setIsLoading(true);
      axios
        .get("admin/reporting/events/metrics", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
             from: fromDate2?.length!=0 ? moment(fromDate2).format("YYYY-MM-DD"): '2022-01-01',
            to: toDate2?.length!=0 ? moment(toDate2).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            // channel: e.target.value,
            // clientType: authType,
            channel: e.target.value,
            clientType: e.target.value === "SELF_KYC" ? "MOBILE" : authType,
            district: branchDistrict,
          },
        })
        .then(response => {
          setList(response.data.data);
          setIsLoading(false);
          setAuthfacesucess(
            (response.data.data.counters.faceAuthenticationsSucceeded /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );
          setFaceAuthSuccess(
            response.data.data.counters.faceAuthenticationsSucceeded,
          );
          setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
          setEnrollFail(response.data.data.counters.enrollmentsStarted);
          setFaceAuthFail(
            response.data.data.counters.faceAuthenticationsFailed,
          );
          setPasswordAuthSuccess(
            response.data.data.counters.passwordAuthenticationsSucceeded,
          );
          setPasswordAuthFail(
            response.data.data.counters.passwordAuthenticationsFailed,
          );
          setfingerAuthFail(
            response.data.data.counters.fingerprintAuthenticationsSucceeded,
          );
          setfingerAuthSuccess(
            response.data.data.counters.fingerprintAuthenticationsFailed,
          );
          setAuthfacefail(
            (response.data.data.counters.faceAuthenticationsFailed /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );
          setEnrollComplete(
            (response.data.data.counters.enrollmentsStarted /
              (response.data.data.counters.enrollmentsStarted +
                response.data.data.counters.enrollmentsCompleted)) *
              100,
          );
          setEnrollInComplete(
            (response.data.data.counters.enrollmentsCompleted /
              (response.data.data.counters.enrollmentsCompleted +
                response.data.data.counters.enrollmentsStarted)) *
              100,
          );

          setAuthfingersuccess(
            (response.data.data.counters.fingerprintAuthenticationsSucceeded /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthfingerfail(
            (response.data.data.counters.fingerprintAuthenticationsFailed /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordsuccess(
            (response.data.data.counters.passwordAuthenticationsSucceeded /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordfail(
            (response.data.data.counters.passwordAuthenticationsFailed /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      axios
        .get("admin/reporting/events/metrics", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
             from: fromDate2?.length!=0 ? moment(fromDate2).format("YYYY-MM-DD"): '2022-01-01',
            to: toDate2?.length!=0 ? moment(toDate2).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            channel: e.target.value,
            clientType: e.target.value === "SELF_KYC" ? "MOBILE" : authType,
          },
        })
        .then(response => {
          setList(response.data.data);
          setIsLoading(false);
          setAuthfacesucess(
            (response.data.data.counters.faceAuthenticationsSucceeded /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );
          setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
          setEnrollFail(response.data.data.counters.enrollmentsStarted);
          setEnrollComplete(
            (response.data.data.counters.enrollmentsStarted /
              (response.data.data.counters.enrollmentsStarted +
                response.data.data.counters.enrollmentsCompleted)) *
              100,
          );
          setFaceAuthSuccess(
            response.data.data.counters.faceAuthenticationsSucceeded,
          );
          setFaceAuthFail(
            response.data.data.counters.faceAuthenticationsFailed,
          );
          setPasswordAuthSuccess(
            response.data.data.counters.passwordAuthenticationsSucceeded,
          );
          setPasswordAuthFail(
            response.data.data.counters.passwordAuthenticationsFailed,
          );
          setfingerAuthFail(
            response.data.data.counters.fingerprintAuthenticationsSucceeded,
          );
          setfingerAuthSuccess(
            response.data.data.counters.fingerprintAuthenticationsFailed,
          );
          setEnrollInComplete(
            (response.data.data.counters.enrollmentsCompleted /
              (response.data.data.counters.enrollmentsCompleted +
                response.data.data.counters.enrollmentsStarted)) *
              100,
          );
          setAuthfacefail(
            (response.data.data.counters.faceAuthenticationsFailed /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );

          setAuthfingersuccess(
            (response.data.data.counters.fingerprintAuthenticationsSucceeded /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthfingerfail(
            (response.data.data.counters.fingerprintAuthenticationsFailed /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordsuccess(
            (response.data.data.counters.passwordAuthenticationsSucceeded /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordfail(
            (response.data.data.counters.passwordAuthenticationsFailed /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };
  const handleAuthenticationsTypeChange = e => {
    setAuthType(e.target.value);
    if (reportingRoleName === "BRANCH_REPORT_VIEWER") {
      setIsLoading(true);
      axios
        .get("admin/reporting/events/metrics", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
             from: fromDate2?.length!=0 ? moment(fromDate2).format("YYYY-MM-DD"): '2022-01-01',
            to: toDate2?.length!=0 ? moment(toDate2).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            // channel: authChannel.toUpperCase(),
            // clientType: e.target.value.toUpperCase(),
            channel: authChannel,
            clientType: e.target.value,
            branch: branchId,
          },
        })
        .then(response => {
          setList(response.data.data);
          setIsLoading(false);
          setAuthfacesucess(
            (response.data.data.counters.faceAuthenticationsSucceeded /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );
          setFaceAuthSuccess(
            response.data.data.counters.faceAuthenticationsSucceeded,
          );
          setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
          setEnrollFail(response.data.data.counters.enrollmentsStarted);
          setFaceAuthFail(
            response.data.data.counters.faceAuthenticationsFailed,
          );
          setPasswordAuthSuccess(
            response.data.data.counters.passwordAuthenticationsSucceeded,
          );
          setPasswordAuthFail(
            response.data.data.counters.passwordAuthenticationsFailed,
          );
          setfingerAuthFail(
            response.data.data.counters.fingerprintAuthenticationsSucceeded,
          );
          setfingerAuthSuccess(
            response.data.data.counters.fingerprintAuthenticationsFailed,
          );
          setEnrollComplete(
            (response.data.data.counters.enrollmentsStarted /
              (response.data.data.counters.enrollmentsStarted +
                response.data.data.counters.enrollmentsCompleted)) *
              100,
          );
          setEnrollInComplete(
            (response.data.data.counters.enrollmentsCompleted /
              (response.data.data.counters.enrollmentsCompleted +
                response.data.data.counters.enrollmentsStarted)) *
              100,
          );
          setAuthfacefail(
            (response.data.data.counters.faceAuthenticationsFailed /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );

          setAuthfingersuccess(
            (response.data.data.counters.fingerprintAuthenticationsSucceeded /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthfingerfail(
            (response.data.data.counters.fingerprintAuthenticationsFailed /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordsuccess(
            (response.data.data.counters.passwordAuthenticationsSucceeded /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordfail(
            (response.data.data.counters.passwordAuthenticationsFailed /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else if (reportingRoleName === "DISTRICT_REPORT_VIEWER") {
      setIsLoading(true);
      axios
        .get("admin/reporting/events/metrics", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
             from: fromDate2?.length!=0 ? moment(fromDate2).format("YYYY-MM-DD"): '2022-01-01',
            to: toDate2?.length!=0 ? moment(toDate2).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            channel: authChannel,
            clientType: e.target.value,
            district: branchDistrict,
          },
        })
        .then(response => {
          setList(response.data.data);
          setIsLoading(false);
          setAuthfacesucess(
            (response.data.data.counters.faceAuthenticationsSucceeded /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );
          setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
          setEnrollFail(response.data.data.counters.enrollmentsStarted);
          setEnrollComplete(
            (response.data.data.counters.enrollmentsStarted /
              (response.data.data.counters.enrollmentsStarted +
                response.data.data.counters.enrollmentsCompleted)) *
              100,
          );
          setFaceAuthSuccess(
            response.data.data.counters.faceAuthenticationsSucceeded,
          );
          setFaceAuthFail(
            response.data.data.counters.faceAuthenticationsFailed,
          );
          setPasswordAuthSuccess(
            response.data.data.counters.passwordAuthenticationsSucceeded,
          );
          setPasswordAuthFail(
            response.data.data.counters.passwordAuthenticationsFailed,
          );
          setfingerAuthFail(
            response.data.data.counters.fingerprintAuthenticationsSucceeded,
          );
          setfingerAuthSuccess(
            response.data.data.counters.fingerprintAuthenticationsFailed,
          );
          setEnrollInComplete(
            (response.data.data.counters.enrollmentsCompleted /
              (response.data.data.counters.enrollmentsCompleted +
                response.data.data.counters.enrollmentsStarted)) *
              100,
          );

          setAuthfacefail(
            (response.data.data.counters.faceAuthenticationsFailed /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );

          setAuthfingersuccess(
            (response.data.data.counters.fingerprintAuthenticationsSucceeded /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthfingerfail(
            (response.data.data.counters.fingerprintAuthenticationsFailed /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordsuccess(
            (response.data.data.counters.passwordAuthenticationsSucceeded /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordfail(
            (response.data.data.counters.passwordAuthenticationsFailed /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      axios
        .get("admin/reporting/events/metrics", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
             from: fromDate2?.length!=0 ? moment(fromDate2).format("YYYY-MM-DD"): '2022-01-01',
            to: toDate2?.length!=0 ? moment(toDate2).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            channel: authChannel,
            clientType: e.target.value,
          },
        })
        .then(response => {
          setList(response.data.data);
          setIsLoading(false);
          setAuthfacesucess(
            (response.data.data.counters.faceAuthenticationsSucceeded /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );
          setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
          setEnrollFail(response.data.data.counters.enrollmentsStarted);
          setEnrollComplete(
            (response.data.data.counters.enrollmentsStarted /
              (response.data.data.counters.enrollmentsStarted +
                response.data.data.counters.enrollmentsCompleted)) *
              100,
          );
          setEnrollInComplete(
            (response.data.data.counters.enrollmentsCompleted /
              (response.data.data.counters.enrollmentsCompleted +
                response.data.data.counters.enrollmentsStarted)) *
              100,
          );
          setFaceAuthSuccess(
            response.data.data.counters.faceAuthenticationsSucceeded,
          );
          setFaceAuthFail(
            response.data.data.counters.faceAuthenticationsFailed,
          );
          setPasswordAuthSuccess(
            response.data.data.counters.passwordAuthenticationsSucceeded,
          );
          setPasswordAuthFail(
            response.data.data.counters.passwordAuthenticationsFailed,
          );
          setfingerAuthFail(
            response.data.data.counters.fingerprintAuthenticationsSucceeded,
          );
          setfingerAuthSuccess(
            response.data.data.counters.fingerprintAuthenticationsFailed,
          );
          setAuthfacefail(
            (response.data.data.counters.faceAuthenticationsFailed /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );

          setAuthfingersuccess(
            (response.data.data.counters.fingerprintAuthenticationsSucceeded /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthfingerfail(
            (response.data.data.counters.fingerprintAuthenticationsFailed /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordsuccess(
            (response.data.data.counters.passwordAuthenticationsSucceeded /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordfail(
            (response.data.data.counters.passwordAuthenticationsFailed /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  const [list, setList] = useState();

  const [authefacesucess, setAuthfacesucess] = useState();

  const [authfacefail, setAuthfacefail] = useState();

  const [authfingersuccess, setAuthfingersuccess] = useState();

  const [authfingerfail, setAuthfingerfail] = useState();

  const [authpasswordsuccess, setAuthpasswordsuccess] = useState();

  const [authpasswordfail, setAuthpasswordfail] = useState();

  const [enrollComplete, setEnrollComplete] = useState();
  const [enrollInComplete, setEnrollInComplete] = useState();

  useEffect(() => {
    if (reportingRoleName === "BRANCH_REPORT_VIEWER") {
      setIsLoading(true);
      axios
        .get("admin/reporting/events/metrics", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
             from: fromDate2?.length!=0 ? moment(fromDate2).format("YYYY-MM-DD"): '2022-01-01',
            to: toDate2?.length!=0 ? moment(toDate2).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            branch: branchId,
          },
        })
        .then(response => {
          setList(response.data.data);
          setIsLoading(false);
          setAuthfacesucess(
            (response.data.data.counters.faceAuthenticationsSucceeded /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );
          setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
          setEnrollFail(response.data.data.counters.enrollmentsStarted);
          setFaceAuthSuccess(
            response.data.data.counters.faceAuthenticationsSucceeded,
          );
          setFaceAuthFail(
            response.data.data.counters.faceAuthenticationsFailed,
          );
          setPasswordAuthSuccess(
            response.data.data.counters.passwordAuthenticationsSucceeded,
          );
          setPasswordAuthFail(
            response.data.data.counters.passwordAuthenticationsFailed,
          );
          setfingerAuthFail(
            response.data.data.counters.fingerprintAuthenticationsSucceeded,
          );
          setfingerAuthSuccess(
            response.data.data.counters.fingerprintAuthenticationsFailed,
          );
          setEnrollComplete(
            (response.data.data.counters.enrollmentsStarted /
              (response.data.data.counters.enrollmentsStarted +
                response.data.data.counters.enrollmentsCompleted)) *
              100,
          );
          setEnrollInComplete(
            (response.data.data.counters.enrollmentsCompleted /
              (response.data.data.counters.enrollmentsCompleted +
                response.data.data.counters.enrollmentsStarted)) *
              100,
          );

          setAuthfacefail(
            (response.data.data.counters.faceAuthenticationsFailed /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );

          setAuthfingersuccess(
            (response.data.data.counters.fingerprintAuthenticationsSucceeded /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthfingerfail(
            (response.data.data.counters.fingerprintAuthenticationsFailed /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordsuccess(
            (response.data.data.counters.passwordAuthenticationsSucceeded /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordfail(
            (response.data.data.counters.passwordAuthenticationsFailed /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else if (reportingRoleName === "DISTRICT_REPORT_VIEWER") {
      setIsLoading(true);
      axios
        .get("admin/reporting/events/metrics", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
             from: fromDate2?.length!=0 ? moment(fromDate2).format("YYYY-MM-DD"): '2022-01-01',
            to: toDate2?.length!=0 ? moment(toDate2).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            district: branchDistrict,
          },
        })
        .then(response => {
          setList(response.data.data);
          setIsLoading(false);
          setAuthfacesucess(
            (response.data.data.counters.faceAuthenticationsSucceeded /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );
          setEnrollComplete(
            (response.data.data.counters.enrollmentsStarted /
              (response.data.data.counters.enrollmentsStarted +
                response.data.data.counters.enrollmentsCompleted)) *
              100,
          );
          setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
          setEnrollFail(response.data.data.counters.enrollmentsStarted);
          setFaceAuthSuccess(
            response.data.data.counters.faceAuthenticationsSucceeded,
          );
          setFaceAuthFail(
            response.data.data.counters.faceAuthenticationsFailed,
          );
          setPasswordAuthSuccess(
            response.data.data.counters.passwordAuthenticationsSucceeded,
          );
          setPasswordAuthFail(
            response.data.data.counters.passwordAuthenticationsFailed,
          );
          setfingerAuthFail(
            response.data.data.counters.fingerprintAuthenticationsSucceeded,
          );
          setfingerAuthSuccess(
            response.data.data.counters.fingerprintAuthenticationsFailed,
          );
          setEnrollInComplete(
            (response.data.data.counters.enrollmentsCompleted /
              (response.data.data.counters.enrollmentsCompleted +
                response.data.data.counters.enrollmentsStarted)) *
              100,
          );
          setAuthfacefail(
            (response.data.data.counters.faceAuthenticationsFailed /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );

          setAuthfingersuccess(
            (response.data.data.counters.fingerprintAuthenticationsSucceeded /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthfingerfail(
            (response.data.data.counters.fingerprintAuthenticationsFailed /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordsuccess(
            (response.data.data.counters.passwordAuthenticationsSucceeded /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordfail(
            (response.data.data.counters.passwordAuthenticationsFailed /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      axios
        .get("admin/reporting/events/metrics", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
             from: fromDate2?.length!=0 ? moment(fromDate2).format("YYYY-MM-DD"): '2022-01-01',
            to: toDate2?.length!=0 ? moment(toDate2).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
          },
        })
        .then(response => {
          setList(response.data.data);
          setIsLoading(false);
          setAuthfacesucess(
            (response.data.data.counters.faceAuthenticationsSucceeded /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );
          setEnrollComplete(
            (response.data.data.counters.enrollmentsStarted /
              (response.data.data.counters.enrollmentsStarted +
                response.data.data.counters.enrollmentsCompleted)) *
              100,
          );
          setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
          setEnrollFail(response.data.data.counters.enrollmentsStarted);
          setFaceAuthSuccess(
            response.data.data.counters.faceAuthenticationsSucceeded,
          );
          setFaceAuthFail(
            response.data.data.counters.faceAuthenticationsFailed,
          );
          setPasswordAuthSuccess(
            response.data.data.counters.passwordAuthenticationsSucceeded,
          );
          setPasswordAuthFail(
            response.data.data.counters.passwordAuthenticationsFailed,
          );
          setfingerAuthFail(
            response.data.data.counters.fingerprintAuthenticationsSucceeded,
          );
          setfingerAuthSuccess(
            response.data.data.counters.fingerprintAuthenticationsFailed,
          );
          setEnrollInComplete(
            (response.data.data.counters.enrollmentsCompleted /
              (response.data.data.counters.enrollmentsCompleted +
                response.data.data.counters.enrollmentsStarted)) *
              100,
          );

          setAuthfacefail(
            (response.data.data.counters.faceAuthenticationsFailed /
              (response.data.data.counters.faceAuthenticationsSucceeded +
                response.data.data.counters.faceAuthenticationsFailed)) *
              100,
          );

          setAuthfingersuccess(
            (response.data.data.counters.fingerprintAuthenticationsSucceeded /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthfingerfail(
            (response.data.data.counters.fingerprintAuthenticationsFailed /
              (response.data.data.counters.fingerprintAuthenticationsSucceeded +
                response.data.data.counters.fingerprintAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordsuccess(
            (response.data.data.counters.passwordAuthenticationsSucceeded /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );

          setAuthpasswordfail(
            (response.data.data.counters.passwordAuthenticationsFailed /
              (response.data.data.counters.passwordAuthenticationsSucceeded +
                response.data.data.counters.passwordAuthenticationsFailed)) *
              100,
          );
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [accessToken, branchDistrict, branchId, reportingRoleName]);

  //console.log(list.counters.customersCreated)
  const Data = [
    {
      value: list?.counters?.customersCreated || 0,
      label: "Customers Created",
      src: customerCreated,
    },
    {
      value: list?.counters?.customersLinked || 0,
      label: "Customers Linked",
      src: customerLink,
    },
    {
      value: list?.counters?.customersDemographicsUpdated || 0,
      label: "Customer Amendements",
      src: customerAmendement,
    },
    {
      value: list?.counters?.customerMobileNumberUpdated || 0,
      label: "Customer Mobile Updated",
      src: mobileNumber,
    },
    
  ];

  const DataWithIcon = [
    {
      value: list?.counters?.accountsOpenedForNewCustomer || 0,
      label: "Accounts Opened(New Customer)",
      src: existingCustomer,
    },
    
    {
      value: list?.counters?.accountsOpenedForExistingCustomer || 0,
      label: "Accounts Opened(Existing Customer)",
      src: existingCustomer,
    },
    {
      // ! ICON Change
      value: list?.counters?.enrollmentsStarted || 0,
      label: "Enrollments Started",
      src: enrollStart,
    },
    {
      src: customerCreated,

      value: list?.counters?.enrollmentsCompleted || 0,
      label: "Enrollments Completed",
    },
    {
      src: debitCard,
      value: list?.counters?.debitCardRequests || 0,
      label: "Debit Card Requests",
    },
    {
      src: onlineBanking,
      value: list?.counters?.onlineBankingRequests || 0,
      label: "Online Banking Access Requests",
    },
  ];

  const [fromDate2, setFromDate2] = useState("");
  const [toDate2, setToDate2] = useState("");
  const handleSearch = useCallback(async () => {
    if (!fromDate2) {
      return toast.error(`Please Enter  From Date`);
    }
    if (!toDate2) {
      return toast.error(`Please Enter To Date`);
    }
    if (
      moment(fromDate2, "DD/MM/YYYY").unix() >
      moment(toDate2, "DD/MM/YYYY").unix()
    ) {
      return toast.error(`From Date must be smaller than To Date`);
    }
    try {
      if (reportingRoleName === "BRANCH_REPORT_VIEWER") {
        setIsLoading(true);
        axios
          .get("admin/reporting/events/metrics", {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
            params: {
              from: moment(fromDate2).format("YYYY-MM-DD"),
              to: moment(toDate2).format("YYYY-MM-DD"),
              branch: branchId,
              channel: authChannel,
              clientType: authType,
            },
          })
          .then(response => {
            setList(response.data.data);
            setIsLoading(false);
            setAuthfacesucess(
              (response.data.data.counters.faceAuthenticationsSucceeded /
                (response.data.data.counters.faceAuthenticationsSucceeded +
                  response.data.data.counters.faceAuthenticationsFailed)) *
                100,
            );
            setEnrollComplete(
              (response.data.data.counters.enrollmentsStarted /
                (response.data.data.counters.enrollmentsStarted +
                  response.data.data.counters.enrollmentsCompleted)) *
                100,
            );
            setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
            setEnrollFail(response.data.data.counters.enrollmentsStarted);
            setEnrollInComplete(
              (response.data.data.counters.enrollmentsCompleted /
                (response.data.data.counters.enrollmentsCompleted +
                  response.data.data.counters.enrollmentsStarted)) *
                100,
            );
            setFaceAuthSuccess(
              response.data.data.counters.faceAuthenticationsSucceeded,
            );
            setFaceAuthFail(
              response.data.data.counters.faceAuthenticationsFailed,
            );
            setPasswordAuthSuccess(
              response.data.data.counters.passwordAuthenticationsSucceeded,
            );
            setPasswordAuthFail(
              response.data.data.counters.passwordAuthenticationsFailed,
            );
            setfingerAuthFail(
              response.data.data.counters.fingerprintAuthenticationsSucceeded,
            );
            setfingerAuthSuccess(
              response.data.data.counters.fingerprintAuthenticationsFailed,
            );
            setAuthfacefail(
              (response.data.data.counters.faceAuthenticationsFailed /
                (response.data.data.counters.faceAuthenticationsSucceeded +
                  response.data.data.counters.faceAuthenticationsFailed)) *
                100,
            );

            setAuthfingersuccess(
              (response.data.data.counters.fingerprintAuthenticationsSucceeded /
                (response.data.data.counters
                  .fingerprintAuthenticationsSucceeded +
                  response.data.data.counters
                    .fingerprintAuthenticationsFailed)) *
                100,
            );

            setAuthfingerfail(
              (response.data.data.counters.fingerprintAuthenticationsFailed /
                (response.data.data.counters
                  .fingerprintAuthenticationsSucceeded +
                  response.data.data.counters
                    .fingerprintAuthenticationsFailed)) *
                100,
            );

            setAuthpasswordsuccess(
              (response.data.data.counters.passwordAuthenticationsSucceeded /
                (response.data.data.counters.passwordAuthenticationsSucceeded +
                  response.data.data.counters.passwordAuthenticationsFailed)) *
                100,
            );

            setAuthpasswordfail(
              (response.data.data.counters.passwordAuthenticationsFailed /
                (response.data.data.counters.passwordAuthenticationsSucceeded +
                  response.data.data.counters.passwordAuthenticationsFailed)) *
                100,
            );
          })
          .catch(() => {
            setIsLoading(false);
          });
      } else if (reportingRoleName === "DISTRICT_REPORT_VIEWER") {
        setIsLoading(true);
        axios
          .get("admin/reporting/events/metrics", {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
            params: {
              from: moment(fromDate2).format("YYYY-MM-DD"),
              to: moment(toDate2).format("YYYY-MM-DD"),
              district: branchDistrict,
              channel: authChannel,
              clientType: authType,
            },
          })
          .then(response => {
            setList(response.data.data);
            setIsLoading(false);
            setAuthfacesucess(
              (response.data.data.counters.faceAuthenticationsSucceeded /
                (response.data.data.counters.faceAuthenticationsSucceeded +
                  response.data.data.counters.faceAuthenticationsFailed)) *
                100,
            );
            setFaceAuthSuccess(
              response.data.data.counters.faceAuthenticationsSucceeded,
            );
            setFaceAuthFail(
              response.data.data.counters.faceAuthenticationsFailed,
            );
            setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
            setEnrollFail(response.data.data.counters.enrollmentsStarted);
            setPasswordAuthSuccess(
              response.data.data.counters.passwordAuthenticationsSucceeded,
            );
            setPasswordAuthFail(
              response.data.data.counters.passwordAuthenticationsFailed,
            );
            setfingerAuthFail(
              response.data.data.counters.fingerprintAuthenticationsSucceeded,
            );
            setfingerAuthSuccess(
              response.data.data.counters.fingerprintAuthenticationsFailed,
            );
            setEnrollComplete(
              (response.data.data.counters.enrollmentsStarted /
                (response.data.data.counters.enrollmentsStarted +
                  response.data.data.counters.enrollmentsCompleted)) *
                100,
            );
            setEnrollInComplete(
              (response.data.data.counters.enrollmentsCompleted /
                (response.data.data.counters.enrollmentsCompleted +
                  response.data.data.counters.enrollmentsStarted)) *
                100,
            );

            setAuthfacefail(
              (response.data.data.counters.faceAuthenticationsFailed /
                (response.data.data.counters.faceAuthenticationsSucceeded +
                  response.data.data.counters.faceAuthenticationsFailed)) *
                100,
            );

            setAuthfingersuccess(
              (response.data.data.counters.fingerprintAuthenticationsSucceeded /
                (response.data.data.counters
                  .fingerprintAuthenticationsSucceeded +
                  response.data.data.counters
                    .fingerprintAuthenticationsFailed)) *
                100,
            );

            setAuthfingerfail(
              (response.data.data.counters.fingerprintAuthenticationsFailed /
                (response.data.data.counters
                  .fingerprintAuthenticationsSucceeded +
                  response.data.data.counters
                    .fingerprintAuthenticationsFailed)) *
                100,
            );

            setAuthpasswordsuccess(
              (response.data.data.counters.passwordAuthenticationsSucceeded /
                (response.data.data.counters.passwordAuthenticationsSucceeded +
                  response.data.data.counters.passwordAuthenticationsFailed)) *
                100,
            );

            setAuthpasswordfail(
              (response.data.data.counters.passwordAuthenticationsFailed /
                (response.data.data.counters.passwordAuthenticationsSucceeded +
                  response.data.data.counters.passwordAuthenticationsFailed)) *
                100,
            );
          })
          .catch(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(true);
        axios
          .get("admin/reporting/events/metrics", {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
            params: {
              from: moment(fromDate2).format("YYYY-MM-DD"),
              to: moment(toDate2).format("YYYY-MM-DD"),
              channel: authChannel,
              clientType: authType,
            },
          })
          .then(response => {
            setList(response.data.data);
            setIsLoading(false);
            setAuthfacesucess(
              (response.data.data.counters.faceAuthenticationsSucceeded /
                (response.data.data.counters.faceAuthenticationsSucceeded +
                  response.data.data.counters.faceAuthenticationsFailed)) *
                100,
            );
            setEnrollSuccess(response.data.data.counters.enrollmentsCompleted);
            setEnrollFail(response.data.data.counters.enrollmentsStarted);
            setFaceAuthSuccess(
              response.data.data.counters.faceAuthenticationsSucceeded,
            );
            setFaceAuthFail(
              response.data.data.counters.faceAuthenticationsFailed,
            );
            setPasswordAuthSuccess(
              response.data.data.counters.passwordAuthenticationsSucceeded,
            );
            setPasswordAuthFail(
              response.data.data.counters.passwordAuthenticationsFailed,
            );
            setfingerAuthFail(
              response.data.data.counters.fingerprintAuthenticationsSucceeded,
            );
            setfingerAuthSuccess(
              response.data.data.counters.fingerprintAuthenticationsFailed,
            );
            setEnrollComplete(
              (response.data.data.counters.enrollmentsStarted /
                (response.data.data.counters.enrollmentsStarted +
                  response.data.data.counters.enrollmentsCompleted)) *
                100,
            );
            setEnrollInComplete(
              (response.data.data.counters.enrollmentsCompleted /
                (response.data.data.counters.enrollmentsCompleted +
                  response.data.data.counters.enrollmentsStarted)) *
                100,
            );
            setAuthfacefail(
              (response.data.data.counters.faceAuthenticationsFailed /
                (response.data.data.counters.faceAuthenticationsSucceeded +
                  response.data.data.counters.faceAuthenticationsFailed)) *
                100,
            );

            setAuthfingersuccess(
              (response.data.data.counters.fingerprintAuthenticationsSucceeded /
                (response.data.data.counters
                  .fingerprintAuthenticationsSucceeded +
                  response.data.data.counters
                    .fingerprintAuthenticationsFailed)) *
                100,
            );

            setAuthfingerfail(
              (response.data.data.counters.fingerprintAuthenticationsFailed /
                (response.data.data.counters
                  .fingerprintAuthenticationsSucceeded +
                  response.data.data.counters
                    .fingerprintAuthenticationsFailed)) *
                100,
            );

            setAuthpasswordsuccess(
              (response.data.data.counters.passwordAuthenticationsSucceeded /
                (response.data.data.counters.passwordAuthenticationsSucceeded +
                  response.data.data.counters.passwordAuthenticationsFailed)) *
                100,
            );

            setAuthpasswordfail(
              (response.data.data.counters.passwordAuthenticationsFailed /
                (response.data.data.counters.passwordAuthenticationsSucceeded +
                  response.data.data.counters.passwordAuthenticationsFailed)) *
                100,
            );
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [
    accessToken,
    branchDistrict,
    branchId,
    fromDate2,
    reportingRoleName,
    toDate2,
  ]);

  return (
    <Box
      component={Stack}
      width={1}
      height="calc(100vh - 145px )"
      gap={2}
      position={"relative"}
    >
      {/* <ToastContainer/> */}
      {/* <MetricFilters
        authChannel={authChannel}
        setAuthChannel={setAuthChannel}
        setFromDate={setFromDate}
        setToDate={setToDate}
        fromDate={fromDate}
        handleAuthenticationsChannelChange={handleAuthenticationsChannelChange}
        handleAuthenticationsTypeChange={handleAuthenticationsTypeChange}
        authType={authType}
      /> */}

      {isLoading ? (
        <Box
          position={"absolute"}
          top={"50%"}
          left={"50%"}
          style={{ transform: "translate(-50%,-50%)" }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <Box component={Paper} elevation={5} minHeight={"auto"} padding={2}>
            <Stack
              direction="row"
              gap={1}
              padding={1}
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography
                // fontWeight={600}
                textTransform="uppercase"
                sx={{
                  position: "relative",
                  "&.MuiTypography-root::before ": {
                    content: "''",
                    position: "absolute",
                    height: 0.05,
                    backgroundColor: "#36454F",
                    left: 0,
                    right: { lg: -50, md: -20, sm: -10, xs: -10 },
                    bottom: -1,
                  },
                }}
                fontSize={20}
              >
                Reports
              </Typography>

              <Stack gap={1} direction="row" flexWrap="wrap">
                <LocalizationProvider
                  dateAdapter={AdapterMoment}
                  sx={{ border: "2px solid blue" }}
                >
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label="From Date"
                    value={fromDate2}
                    disableFuture
                    onChange={newValue => {
                      setFromDate2(newValue);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": {
                            width: 85,
                          },
                          "& .MuiOutlinedInput-input": {
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
                    value={toDate2}
                    disableFuture
                    shouldDisableDate={date =>
                      moment(fromDate2, "DD/MM/YYYY", true).diff(date) > 0
                    }
                    onChange={newValue => {
                      setToDate2(newValue);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": {
                            width: 85,
                          },
                          "& .MuiOutlinedInput-input": {
                            borderRadius: "0",
                          },
                        }}
                        error={false}
                      />
                    )}
                  />
                </LocalizationProvider>
                <Button
                  disableElevation
                  disableFocusRipple
                  disableRipple
                  disableTouchRipple
                  onClick={handleSearch}
                  sx={{
                    paddingLeft: 5,
                    paddingRight: 5,
                    width: "20%",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "#fff",
                    backgroundColor: theme.palette.primary.main,
                    "&.MuiButton-root": { borderRadius: 0 },
                    "&.MuiButton-root:hover": {
                      backgroundColor: theme.palette.primary.main,
                    },
                    height: "40px",
                    marginX: "8px",
                  }}
                >
                  Search
                </Button>
              </Stack>
              <Stack gap={1} direction="row">
                <DropDown
                  options={channelOptions}
                  value={authChannel}
                  onChange={handleAuthenticationsChannelChange}
                />
                <DropDown
                  options={typeAuthOptionss}
                  value={authType}
                  disabled={authChannel === "SELF_KYC" ? true : false}
                  onChange={handleAuthenticationsTypeChange}
                />
              </Stack>
              {/* <Stack
          width={1}
          minHeight="10vh"
          direction="row"
          alignItems="center"
          justifyContent="space-around"
        >
          {countData.map(data => (
            <Box key={data.id}>
              <Typography
                fontSize={{ xs: 18, md: 18, lg: 21 }}
                align="center"
                color="common.black"
              >
                {data.value}
              </Typography>
              <Typography fontSize={{ xs: 8, md: 12, lg: 10 }} align="center">
                {data.id}
              </Typography>
            </Box>
          ))}
        </Stack> */}
            </Stack>
          </Box>
          <Box
            display={"grid"}
            gridTemplateColumns={"repeat(12,1fr)"}
            gridTemplateRows={"repeat(1,1fr)"}
            gap={2}
            paddingBottom={'1rem'}
          >
            <Box
              gridColumn={{
                lg: "span 6",
                md: "span 12",
                sm: "span 12",
                xs: "span 12",
              }}
            >
              <Box
                component={Paper}
                elevation={5}
                minHeight={"calc(30vh - 32px)"}
                sx={{
                  "&.MuiPaper-rounded": { borderRadius: 0 },
                  borderBottom: `3px solid ${theme.palette.primary.main}`,
                }}
              >
                <Stack
                  justifyContent={"space-between"}
                  p={1}
                  flexDirection={"row"}
                  flexWrap="wrap"
                >
                  <Typography
                    variant={"body1"}
                    fontSize={{ xs: 18, md: 20, lg: 20 }}
                    align="left"
                    // fontWeight={600}
                    sx={{
                      color: "black",
                    }}
                  >
                    Identity Registrations
                  </Typography>
                </Stack>
                <Stack p={3} gap={2}>
                  <Typography
                    variant={"body2"}
                    align={"left"}
                    sx={{
                      textTransform: "uppercase",
                      // fontWeight: "600",
                      color: "black",
                    }}
                  >
                    Completed ({enrollSuccess || 0})
                  </Typography>
                  <Box>
                  <Tooltip title={enrollInComplete?.toFixed(2)+'%' || 0}  followCursor>
                    <LinearProgress
                      variant="determinate"
                      value={enrollInComplete || 0}
                      color="success"
                      sx={{
                        backgroundColor: `${theme.palette.secondary.main}`,
                      }}
                    />
                    </Tooltip>
                  </Box>
                  <Typography
                    variant={"body2"}
                    align={"left"}
                    sx={{
                      textTransform: "uppercase",
                      // fontWeight: "600",
                    }}
                  >
                    INCompleted ({enrollFail || 0})
                  </Typography>
                  <Box>
                  <Tooltip title={enrollComplete?.toFixed(2)+'%' || 0} followCursor>
                    <LinearProgress
                      variant="determinate"
                      color="primary"
                      value={enrollComplete || 0}
                      sx={{
                        backgroundColor: `${theme.palette.secondary.main}`,
                      }}
                    />
                    </Tooltip>
                  </Box>
                </Stack>
              </Box>
            </Box>
            <Box
              gridColumn={{
                lg: "span 6",
                md: "span 12",
                sm: "span 12",
                xs: "span 12",
              }}
            >
              <Box
                component={Paper}
                elevation={5}
                minHeight={"calc(30vh - 32px)"}
                sx={{
                  "&.MuiPaper-rounded": { borderRadius: 0 },
                  borderBottom: `3px solid ${theme.palette.primary.main}`,
                }}
              >
                <Stack
                  justifyContent={"space-between"}
                  p={1}
                  flexDirection={"column"}
                  flexWrap="wrap"
                >
                  <Typography
                    variant={"body1"}
                    fontSize={{ xs: 18, md: 20, lg: 20 }}
                    align="left"
                    // fontWeight={600}
                    sx={{
                      color: "black",
                    }}
                  >
                    Authentications
                  </Typography>
                  <Box
                    component={Stack}
                    minHeight={"calc(22vh - 16px)"}
                    flexDirection="row"
                  >
                    <Box component={"div"}>
                      <ToggleButtonGroup
                        value={authenticationOptions}
                        color="primary"
                        orientation="vertical"
                        onChange={setAutheticationOptionsChange}
                        exclusive
                      >
                        {ToggleData.map(({ value, label }) => (
                          <ToggleButton value={value} key={label}>
                            {label}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>
                    <Box component={"div"} width={1}>
                      <Stack p={3} gap={2}>
                        {authenticationOptions === "face" ? (
                          <React.Fragment>
                            <Typography
                              variant={"body2"}
                              align={"left"}
                              sx={{
                                textTransform: "uppercase",
                                // fontWeight: "600",
                              }}
                            >
                              Success ({faceAuthSuccess})
                            </Typography>
                            <Box component={"div"}>
                            <Tooltip title={authefacesucess?.toFixed(2)+'%' || 0} followCursor>
                              <LinearProgress
                                variant="determinate"
                                value={authefacesucess || 0}
                                color="success"
                                sx={{
                                  backgroundColor: `${theme.palette.secondary.main}`,
                                }}
                              />
                              </Tooltip>
                            </Box>
                            <Typography
                              variant={"body2"}
                              align={"left"}
                              sx={{
                                textTransform: "uppercase",
                                // fontWeight: "600",
                              }}
                            >
                              Failure ({faceAuthFail})
                            </Typography>
                            <Box>
                            <Tooltip title={authfacefail?.toFixed(2)+'%' || 0} followCursor>
                              <LinearProgress
                                variant="determinate"
                                value={authfacefail || 0}
                                color="error"
                                sx={{
                                  backgroundColor: `${theme.palette.secondary.main}`,
                                }}
                              />
                              </Tooltip>
                            </Box>
                          </React.Fragment>
                        ) : null}
                        {authenticationOptions === "finger" ? (
                          <React.Fragment>
                            <Typography
                              variant={"body2"}
                              align={"left"}
                              sx={{
                                textTransform: "uppercase",
                                // fontWeight: "600",
                              }}
                            >
                              Success({fingerAuthFail})
                            </Typography>
                            <Box component={"div"}>
                            <Tooltip title={authfingersuccess?.toFixed(2)+'%' || 0} followCursor>
                              <LinearProgress
                                variant="determinate"
                                value={authfingersuccess || 0}
                                color="success"
                                sx={{
                                  backgroundColor: `${theme.palette.secondary.main}`,
                                }}
                              />
                               </Tooltip>
                            </Box>
                            <Typography
                              variant={"body2"}
                              align={"left"}
                              sx={{
                                textTransform: "uppercase",
                                // fontWeight: "600",
                              }}
                            >
                              Failure({fingerAuthSuccess})
                            </Typography>
                            <Box>
                            <Tooltip title={authfingerfail?.toFixed(2)+'%' || 0} followCursor>
                              <LinearProgress
                                variant="determinate"
                                value={authfingerfail || 0}
                                color="error"
                                sx={{
                                  backgroundColor: `${theme.palette.secondary.main}`,
                                }}
                              />
                              </Tooltip>
                            </Box>
                          </React.Fragment>
                        ) : null}
                        {authenticationOptions === "password" ? (
                          <React.Fragment>
                            <Typography
                              variant={"body2"}
                              align={"left"}
                              sx={{
                                textTransform: "uppercase",
                                // fontWeight: "600",
                              }}
                            >
                              Success({passwordAuthSuccess})
                            </Typography>
                            <Box component={"div"}>
                            <Tooltip title={authpasswordsuccess?.toFixed(2)+'%' || 0} followCursor>
                              <LinearProgress
                                variant="determinate"
                                value={authpasswordsuccess || 0}
                                color="success"
                                sx={{
                                  backgroundColor: `${theme.palette.secondary.main}`,
                                }}
                              />
                              </Tooltip>
                            </Box>
                            <Typography
                              variant={"body2"}
                              align={"left"}
                              sx={{
                                textTransform: "uppercase",
                                // fontWeight: "600",
                              }}
                            >
                              Failure({passwordAuthFail})
                            </Typography>
                            <Box>
                            <Tooltip title={authpasswordfail?.toFixed(2)+'%' || 0} followCursor>
                              <LinearProgress
                                variant="determinate"
                                value={authpasswordfail || 0}
                                color="error"
                                sx={{
                                  backgroundColor: `${theme.palette.secondary.main}`,
                                }}
                              />
                              </Tooltip>
                            </Box>
                          </React.Fragment>
                        ) : null}
                      </Stack>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Box>
            {Data.map(({ value, label, src }) => (
              <Box
                gridColumn={{ lg: "span 3", md: "span 6", xs: "span 6" }}
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
                    <img src={src} alt={Math.random()} width={'20px'} height={'auto'}/>
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

            {DataWithIcon.map(({ src, value, label }) => (
              <Box
                gridColumn={{ lg: "span 4", md: "span 6", xs: "span 6" }}
                // p={1}
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
                    <img src={src} alt={Math.random()} width="20px" height={'auto'}/>
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
        </>
      )}
    </Box>
  );
};

export default MetricReports;
