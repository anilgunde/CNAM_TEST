import React, { useState, useCallback, useEffect } from "react";
import randomData from "../../MOCK.js";
import moment from "moment";
import axios from "../../api/axios";
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material";
import useLocalStorage from "../../hooks/useLocalStorage";
import { Doughnut as AdjudicationTotal } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, registerables, Tooltip } from "chart.js";
import * as ChartLabels from "chartjs-plugin-datalabels";
ChartJS.register(...registerables);
ChartJS.register(ChartLabels, Tooltip);
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const tempHeaders = [
//   { headerName: "Percentage", field: "num" },
//   { headerName: "Case_Type", field: "label" },
// ];
const tempLabels2 = [
  {
    label: "FINGERPRINT_DEDUPE",
    color: "#5cad60",
  },
  {
    label: "FINGERPRINT_POSITION_NOT_CAPTURED",
    color: "#ff7311",
  },
  {
    label: "PROFILE_DEMOGRAPHICS_DO_NOT_MATCH",
    color: "#2a0809",
  },
  {
    label: "PROFILE_INSUFFICIENT_PROOF_TO_LINK",
    color: "#9aeefa",
  },
  {
    label: "PROFILE_LINKED_TO_ANOTHER_IDENTITY",
    color: "#9cb1e1",
  },
  {
    label: "PROFILE_LINK_PENDING_APPROVAL",
    color: "#c72bb0",
  },
  {
    label: "CUSTOMER_PROFILE_CREATED",
    color: "#1c6cab",
  },
  {
    label: "ACCOUNT_PROFILE_CREATED",
    color: "#1c6cab",
  },
  {
    label: "PROFILE_ UPDATED",
    color: "#705830",
  },
];

const tempLabels = [
  {
    label: "MERGE_FACE_DEDUPE",
    color: "#eaca7d",
  },
  {
    label: "FACE_DEDUPE",
    color: "#190bac",
  },
  {
    label: "MERGE_FACE_DEDUPE_AND_UPDATE_IDENTIFYING_ATTRIBUTE",
    color: "#ff7311",
  },
  {
    label: "ID_DOCUMENT_ENROLLMENT_FAILED",
    color: "#c7f574",
  },
  {
    label: "ID_DOCUMENT_DEMOGRAPHICS_MANUALLY_EDITED",
    color: "#c56cb5",
  },
  {
    label: "ID_DOCUMENT_QUALITY_BELOW_THRESHOLD",
    color: "#10db02",
  },
  {
    label: "ID_DOCUMENT_PHOTO_NOT_RECOGNISED",
    color: "#b30c04",
  },
  {
    label: "ID_DOCUMENT_PHOTO_AUTHENTICATION_FAILED",
    color: "#c38405",
  },
];

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};

// const reactDonutChartdata = [
//     {
//       label: "Account Profile Created",
//       value: 25,
//       color: "#420175",
//     },
//     {
//       label: "Customer Profile Created",
//       value: 65,
//       color: "#5ed021",
//     },
//     {
//       label: "Finger Print Position Not Captured",
//       value: 10,
//       color: "#c10cb4",
//     },
//     {
//       label: "Id Document Photo Authentication Failed",
//       value: 500,
//       color: "#c56cb5",
//     },
//     {
//       label: "Id Document Demographics Manually Edited",
//       value: 80,
//       color: "#5cad60",
//     },
//     {
//       label: "Merge Face Dedupe And Update Identifyingh Attribute",
//       value: 60,
//       color: "#c38405",
//     },
//   ];
//   const reactDonutChartBackgroundColor = ["#1c6cab", "#a4c0e5", "#ff7311"];
//   const reactDonutChartInnerRadius = 0.6;
//   const reactDonutChartHandleClick = (item, toggled) => {
//     if (toggled) {
//       console.log(item);
//     }
//   };
//   let reactDonutChartStrokeColor = "#FFFFFF";
//   const reactDonutChartOnMouseEnter = item => {
//     let color = reactDonutChartdata.find(q => q.label === item.label).color;
//     reactDonutChartStrokeColor = color;
//   };

// const config = {
//   responsive: true,
//   maintainAspectRatio: true,
//   plugins: {
//     legend: {
//       display: false,
//     },
//     animation: {
//       animateScale: true,
//       animateRotate: true,
//     },
//     cutoutPercentage: 60,
//     circumference: 2 * Math.PI,
//     showAllTooltips: true,
//     options: {
//       responsive: true,
//     },

//     tooltip: {
//       enabled: true,
//       callbacks: {
//         label: function (context) {
//           var label = context.label,
//             currentValue = context.raw,
//             total = context.chart._metasets[context.datasetIndex].total;
//           var percentage = parseFloat(
//             ((currentValue / total) * 100).toFixed(1),
//           );
//           return label + ": " + currentValue + " (" + percentage + "%)";
//         },
//       },
//     },
//   },
// };
const labels2 = [
  "MERGE_FACE_DEDUPE",
  "MERGE_FACE_DEDUPE_AND_UPDATE_IDENTIFYING_ATTRIBUTE",
  "ID_DOCUMENT_ENROLLMENT_FAILED",
  "ID_DOCUMENT_DEMOGRAPHICS_MANUALLY_EDITED",
  "ID_DOCUMENT_QUALITY_BELOW_THRESHOLD",
  "ID_DOCUMENT_PHOTO_NOT_RECOGNISED",
  "PENDING_IDENTITY_DOCUMENT_UPDATE",
  "ID_DOCUMENT_PHOTO_AUTHENTICATION_FAILED",
  "FACE_DEDUPE",
  "FINGERPRINT_DEDUPE",
  "FINGERPRINT_POSITION_NOT_CAPTURED",
  "PROFILE_DEMOGRAPHICS_DO_NOT_MATCH",
  "PROFILE_INSUFFICIENT_PROOF_TO_LINK",
  "PROFILE_LINKED_TO_ANOTHER_IDENTITY",
  "PROFILE_LINK_PENDING_APPROVAL",
  "CUSTOMER_PROFILE_CREATED",
  "ACCOUNT_PROFILE_CREATED",
  "PROFILE_UPDATED",
  "APPROVE_FACE",
  "APPROVE_SIGNATURE",
  "ID_DOCUMENT_TYPE_NOT_RECOGNISED",
];
const Session2 = ({
  search,
  selectedFilter,
  fromDate,
  toDate,
  pageSize,
  setPageSize,
  Type,
  Channel,
}) => {
  const data = {
    labels2,
    data: [],
    backgroundColor: [],
  };
  const [chartData, setData] = useState([]);
  const theme = useTheme();
  const [list, setList] = useState();
  const [isloading, setIsloading] = useState(false);
  const [{ accessToken, reportingRoleName, branchId, branchDistrict }] =
    useLocalStorage("jwtWithDetails");
  useEffect(() => {
    if (reportingRoleName.includes("BRANCH")) {
      setIsloading(true);
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
          setIsloading(false);
          setList(response.data.data);
        })
        .catch(() => {
          setIsloading(false);
        });
    } else if (reportingRoleName.includes("DISTRICT")) {
      setIsloading(true);
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
          setIsloading(false);
          setList(response.data.data);
        })
        .catch(() => {
          setIsloading(false);
        });
    } else {
      setIsloading(true);
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
          setIsloading(false);
          setList(response.data.data);
        })
        .catch(() => {
          setIsloading(false);
        });
    }
  }, [Channel, Type, accessToken, fromDate, toDate]);

  useEffect(() => {
    const tempLabels3 = [
      {
        label: "MERGE_FACE_DEDUPE",
        color: "#eaca7d",
      },
      {
        label: "MERGE_FACE_DEDUPE_AND_UPDATE_IDENTIFYING_ATTRIBUTE",
        color: "#f22825",
      },
      {
        label: "ID_DOCUMENT_ENROLLMENT_FAILED",
        color: "#c7f574",
      },
      {
        label: "ID_DOCUMENT_DEMOGRAPHICS_MANUALLY_EDITED",
        color: "#c56cb5",
      },
      {
        label: "ID_DOCUMENT_QUALITY_BELOW_THRESHOLD",
        color: "#10db02",
      },
      {
        label: "ID_DOCUMENT_PHOTO_NOT_RECOGNISED",
        color: "#b30c04",
      },
      {
        label: "PENDING_IDENTITY_DOCUMENT_UPDATE",
        color: "#c385",
      },
      {
        label: "ID_DOCUMENT_PHOTO_AUTHENTICATION_FAILED",
        color: "#c38405",
      },
      {
        label: "FACE_DEDUPE",
        color: "#190bac",
      },
      {
        label: "FINGERPRINT_DEDUPE",
        color: "#5cad60",
      },
      {
        label: "FINGERPRINT_POSITION_NOT_CAPTURED",
        color: "#c10cb4",
      },
      {
        label: "PROFILE_DEMOGRAPHICS_DO_NOT_MATCH",
        color: "#2a0809",
      },
      {
        label: "PROFILE_INSUFFICIENT_PROOF_TO_LINK",
        color: "#9aeefa",
      },
      {
        label: "PROFILE_LINKED_TO_ANOTHER_IDENTITY",
        color: "#9cb1e1",
      },
      {
        label: "PROFILE_LINK_PENDING_APPROVAL",
        color: "#ffafb0",
      },
      {
        label: "CUSTOMER_PROFILE_CREATED",
        color: "#5ed021",
      },
      {
        label: "ACCOUNT_PROFILE_CREATED",
        color: "#420175",
      },
      {
        label: "PROFILE_UPDATED",
        color: "#705830",
      },
      {
        label: "APPROVE_FACE",
        color: "#7058",
      },
      {
        label: "APPROVE_SIGNATURE",
        color: "#707100",
      },
      {
        label: "ID_DOCUMENT_TYPE_NOT_RECOGNISED",
        color: "#704100",
      },
    ];

    tempLabels3.forEach(issue => {
      const tempLabel = list?.countsByIssueType?.find(
        value => value.group === issue.label,
      );
      if (tempLabel) {
        data.data.push(tempLabel.count);
      } else {
        data.data.push(0);
      }
      data.backgroundColor.push(issue.color);
    });
    setData([data]);
  }, [list]);
  const barData = {
    labels: days,
    datasets: [
      {
        label: "Weekly of Salary",
        data: [0],
        backgroundColor: [
          "#FF7311",
          "#1C6CAB",
          "#A4C0E5",
          "blue",
          "red",
          "green",
          "pink",
        ],
        barPercentage: 0.2,
      },
    ],
  };
  const config = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      options: {
        responsive: true,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            var label = context.label,
              currentValue = context.raw,
              total = context.chart._metasets[context.datasetIndex].total;
            var percentage = parseFloat(
              ((currentValue / total) * 100).toFixed(1),
            );
            return label + ": " + currentValue + " (" + percentage + "%)";
          },
        },
      },
    },
  };
  return (
    <Box
      component={Paper}
      elevation={5}
      display="flex"
      flexDirection={"row"}
      paddingY="2rem"
      height={"auto"}
      // minHeight={"calc(90% - 2px)"}
    >
      {isloading ? (
        <Box
          padding="10rem 0rem 10rem 0rem"
          margin="0 auto"
          display="flex"
          justifyContent="center"
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <Box
            component={"div"}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Doughnut
              style={{
                width: "20rem",
                height: "20rem",
                marginLeft: "2rem",
              }}
              data={{
                labels: labels2,
                datasets: chartData,
              }}
              options={options}
            />
          </Box>{" "}
          <Box
            component={Stack}
            alignItems="center"
            justifyContent={"flex"}
            flexWrap="wrap"
            py={2}
            height={"auto"}
            width={"calc(100vw - 100px)"}
          >
            <Box
              component={"div"}
              display="flex"
              flexDirection={"column"}
              alignItems="center"
              justifyContent={"center"}
              width={"auto"}
            >
              <Grid
                item
                lg={6}
                display={"flex"}
                justifyContent={"space-between"}
                mt={theme.spacing(8)}
              >
                <Grid item lg={6}>
                  {tempLabels?.map(label => (
                    <React.Fragment key={label}>
                      <Typography
                        variant={"body1"}
                        fontSize={{ xs: 16, md: 16, lg: 16 }}
                        sx={{
                          width: "100%",
                          padding: "3px",
                          color: "black",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: label.color,
                            width: "15px",
                            height: "15px",
                            marginRight: "10px",
                          }}
                        >
                          &nbsp; &nbsp; &nbsp;
                        </span>
                        {label?.label
                          ?.split("_")
                          .join(" ")
                          .split(" ")
                          .map(
                            w =>
                              w[0]?.toUpperCase() +
                              w.substring(1)?.toLowerCase(),
                          )
                          .join(" ")}
                      </Typography>
                    </React.Fragment>
                  ))}
                </Grid>
                <Grid item lg={6} ml={theme.spacing(4)}>
                  {tempLabels2?.map(label => (
                    <>
                      <Typography
                        variant={"body1"}
                        fontSize={{ xs: 16, md: 16, lg: 16 }}
                        sx={{
                          width: "100%",
                          padding: "3px",
                          color: "black",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: label.color,
                            width: "15px",
                            height: "15px",
                            marginRight: "10px",
                          }}
                        >
                          &nbsp; &nbsp; &nbsp;
                        </span>
                        {label?.label
                          ?.split("_")
                          .join(" ")
                          .split(" ")
                          .map(
                            w =>
                              w[0]?.toUpperCase() +
                              w.substring(1)?.toLowerCase(),
                          )
                          .join(" ")}
                      </Typography>
                    </>
                  ))}
                </Grid>
              </Grid>
              {/* <Typography
            variant="h5"
            align="center"
            mb={2}
            textTransform="uppercase"
            fontWeight="600"
          >
            Adjudication Case Type
          </Typography> */}
              {/* <Box display="flex" flexDirection="row" justifyContent={"start"}>
            <Stack width={"calc(50vw - 15px)"} height={"calc(52vh - 32px)"}>
              <TableContainer
                component={Paper}
                elevation={2}
                sx={{
                  height: "calc(100vh - 200px)",
                  width: "calc(50vw - 32px)",
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {tempHeaders?.map((head, index) => (
                        <TableCell
                          key={index}
                          align="left"
                          width="5%"
                          sx={{ backgroundColor: "#EFF2F7" }}
                        >
                          {head.headerName}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tempLabels?.map((label, index) => (
                      <TableRow key={index}>
                        {tempHeaders?.map(({ field }, index) => (
                          <TableCell
                            align="left"
                            component="th"
                            scope="row"
                            fontWeight={600}
                            key={index}
                            style={{
                              color: "white",
                              backgroundColor: label.color,
                            }}
                          >
                            {label[field]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Box> */}
            </Box>
          </Box>
        </>
      )}

      {/* <Box
        component={Stack}
        alignItems="center"
        justifyContent={"center"}
        marginY={5}
        width={"calc(50vw - 100px)"}
      >
        <AdjudicationTotal data={barData} options={config} />
      </Box> */}
    </Box>
  );
};

export default Session2;