import React, { useEffect, useCallback } from "react";
import { Worker } from "@react-pdf-viewer/core";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import logo from "../../assets/BoA logo@2x.png";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import {
  Paper,
  Stack,
  Button,
  TablePagination,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  IconButton,
  Tooltip,
  CircularProgress,
  Fade,
  Typography,
  useTheme,
  Box
} from "@mui/material";
import Switch from "@mui/material/Switch";
import moment from "moment";

import EditIcon from "@mui/icons-material/Edit";
import { CSVLink } from "react-csv";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../api/axios";
import useLocalStorage from "../../hooks/useLocalStorage";
import useResponse from "../../helper";

const columns = [
  {
    field: "enrolmentId",
    headerName: "Enrolment ID",
    width: 20,
  },
  { field: "firstName", headerName: "firstName", width: 50 },
  { field: "lastName", headerName: "lastName", width: 50 },
  { field: "dateOfBirth", headerName: "dateOfBirth", width: 50 },
  { field: "nationality", headerName: "nationality", width: 50 },
  { field: "personCategory", headerName: "personCategory", width: 50 },
  { field: "startedAt", headerName: "startedAt", width: 50 },
  { field: "completedAt", headerName: "completedAt", width: 50 },
  { field: "approvalRequired", headerName: "approvalRequired", width: 50 },
  { field: "approvalStatus", headerName: "approvalStatus", width: 50 },
  { field: "approvedStatusUpdatedAt", headerName: "approvedStatusUpdatedAt", width: 50 },
  { field: "processedAt", headerName: "processedAt", width: 50 },
];

const headersCsv = [
  {
    label: "No",
    key: "id",
  },
  { label: "FullName", key: "displayName" },
  { label: "Mobile Number", key: "mobileNumber" },
  { label: "Roles", key: "role" },
  { label: "Branch Name", key: "branchName" },
  { label: "Status", key: "status" },
  { label: "Last Login", key: "lastLogin" },
  { label: "Created Date", key: "createdAt" },
  { label: "Created By", key: "createdBy" },
  { label: "Last Modified Date", key: "updatedAt" },
  { label: "Last Modified", key: "updatedBy" },
];

const PDFDate = [
  {
    label: "No",
    key: "id",
  },
  { label: "enrolmentId", key: "enrolmentId" },
  { label: "firstName", key: "firstName" },
  { label: "lastName", key: "lastName" },
  { label: "dateOfBirth", key: "dateOfBirth" },
  { label: "nationality", key: "nationality" },
  { label: "personCategory", key: "personCategory" },
  { label: "startedAt", key: "startedAt" },
  { label: "completedAt", key: "completedAt" },
  { label: "approvalStatus", key: "approvalStatus" },
  { label: "approvedStatusUpdatedAt", key: "approvedStatusUpdatedAt" },
  { label: "processedAt", key: "processedAt" },

  // { label: "passWordEnabled", key: "passwordEnabled" },
];
const Enrollments = ({
  search,
  selectedFilter,
  branches,
  setSearch,
  fromDate,
  toDate,
  roleFilter,
  roleSearch,
}) => {
  // ! Replace
  // const [
  //   { accessToken, reportingRoleName, branchId, branchDistrict, roleName },
  // ] = useLocalStorage("login");
  const login = JSON.parse(sessionStorage?.getItem('login'))
  const [selectedRows, setSelectedRows] = useState([]);
  const [userListData, setUserListData] = useState([]);
  const [userListData2, setUserListData2] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const { UpdateUserApi, getSingleUser } = useResponse();
  const [csvFile, setCsvFile] = useState([]);
  const theme = useTheme();

  const handleChange = useCallback();
  // const handleChange = useCallback(
  //   (index, passwordEnabled) => {
  //     setUserListData(prev => {
  //       const prevUserList = [...prev];
  //       prevUserList[index].passwordEnabled = !passwordEnabled;
  //       return prevUserList;
  //     });
  //     getSingleUser({
  //       accessToken,
  //       mobileNumber: userListData[index]?.mobileNumber,
  //     }).then(res => {
  //       console.log("res", res);
  //       const identityNumber = res.data?.data?.content[0]?.identityNumber;
  //       UpdateUserApi(identityNumber, {
  //         passwordEnabled: !passwordEnabled,
  //       });
  //     });
  //   },
  //   [UpdateUserApi, accessToken, getSingleUser, userListData],
  // );

  const navigate = useNavigate();
  // ! Displaying  BranchId as BranchName
  // const branchesMap = useMemo(
  //   () =>
  //     branches?.reduce((acc, branch) => {
  //       acc[branch?.value] = branch?.label;
  //       return acc;
  //     }, {}) || {},
  //   [branches],
  // );

  const json = userListData2;

  const addStyles = useCallback((workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then(workbook => {
      workbook.sheets().forEach(sheet => {
        sheet.column("A").width(10);
        sheet.column("B").width(15);
        sheet.column("C").width(15);
        sheet.column("D").width(15);
        sheet.column("E").width(15);
        sheet.column("F").width(15);
        sheet.column("G").width(15);
        sheet.column("H").width(15);

        sheet.range(dataInfo.titleRange).style({
          bold: true,
        });
      });
      return workbook
        .outputAsync()
        .then(workbookBlob => URL.createObjectURL(workbookBlob));
    });
  }, []);

  // #2
  const s2ab = useCallback(s => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }

    return buf;
  }, []);

  const workbook2blob = useCallback(
    workbook => {
      const wopts = {
        bookType: "xlsx",
        type: "binary",
      };
      const wbout = XLSX.write(workbook, wopts);

      const blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
      });
      return blob;
    },
    [s2ab],
  );
  // #3
  const handleExport = useCallback(() => {})
  // const handleExport = useCallback(() => {
  //   const Filterss = [
  //     {
  //       A:
  //         search.length !== 0
  //           ? `${
  //             selectedFilter === "branchId"
  //               ? "Branch Name"
  //               : selectedFilter === "mobileNumber"
  //               ? "Mobile Number"
  //               : selectedFilter === "district"
  //               ? "District"
  //               : selectedFilter === "name"
  //               ? "Name"
  //               : selectedFilter
  //           } : ${
  //             selectedFilter === "branchId"
  //               ? branches.find(dem => dem.value === search).label
  //               : search
  //           }`
  //           : null,
  //     },
  //   ];
  //   const Datee = [
  //     {
  //       A: ` Date Period : ${
  //         fromDate === "" ? "2022-01-01" : moment(fromDate).format("YYYY-MM-DD")
  //       } To ${
  //         toDate === ""
  //           ? moment(new Date()).format("YYYY-MM-DD")
  //           : moment(toDate).format("YYYY-MM-DD")
  //       }`,
  //     },
  //   ];

  //   // const Clientt = [
  //   //   {
  //   //     A: `Client : ${Type.split(" ")
  //   //       .map(word => word[0]?.toUpperCase() + word.substring(1).toLowerCase())
  //   //       .join(" ")}`,
  //   //   },
  //   // ];

  //   // const Channell = [
  //   //   {
  //   //     A: `Channel : ${Channel.split(" ")
  //   //       .map(word => word[0]?.toUpperCase() + word.substring(1).toLowerCase())
  //   //       .join(" ")}`,
  //   //   },
  //   // ];

  //   const TimeStampp = [
  //     { A: ` Timestamp : ${moment(new Date()).format("hh:mm:ss A")}` },
  //   ];
  //   const Role = [{ A: roleSearch.length !== 0 ? `ROLE : ${roleSearch}` : null }];
  //   let table1 = [
  //     {
  //       A: "Serial No",
  //       B: "Full Name",
  //       C: "Mobile Number",
  //       D: "Roles",
  //       E: "Branch Name",
  //       F: "Status",
  //       G: "last Login",
  //       H: "Created Date",
  //       I: "Created By",
  //       J: "Last Modified Date",
  //       K: "Last Modified"
  //     },
  //   ];

  //   csvFile.forEach(row => {
  //     table1.push({
  //       A: row.serial,
  //       B: row.displayName,
  //       C: row.mobileNumber,
  //       D: row.role,
  //       E: row.branchName,
  //       F: row.status,
  //       G: row.lastLogin,
  //       H: row.createdAt,
  //       I: row.updatedBy,
  //       J: row.updatedAt,
  //       K: row.updatedBy,
  //     });
  //   });

  //   const finalData = [
  //     { A: "Assisted Digital Customer  Onboarding - Users" },
  //     {},
  //     ...Role,
  //     ...Filterss,
  //     // ...Clientt,
  //     // ...Channell,
  //     ...Datee,
  //     ...TimeStampp,
  //     {},
  //     {},
  //     ...table1,
  //   ];
  //   // Create a workbook
  //   const wb = XLSX.utils.book_new();
  //   // Create a worksheet
  //   const sheet = XLSX.utils.json_to_sheet(finalData, {
  //     skipHeader: true,
  //   });

  //   const dataInfo = {
  //     titleCell: "A1",
  //     titleRange: "A1:K2",
  //     tbodyRange: `A11:K${finalData.length}`,
  //   };

  //   XLSX.utils.book_append_sheet(wb, sheet, "Bank of abyssinia");

  //   const workbookBlob = workbook2blob(wb);

  //   const headerIndexes = [];
  //   finalData.forEach((data, index) =>
  //     data["A"] === "Serial No" ? headerIndexes.push(index) : null,
  //   );

  //   return addStyles(workbookBlob, dataInfo);
  // }, [
  //   // Channel,
  //   // Type,
  //   addStyles,
  //   csvFile,
  //   fromDate,
  //   roleSearch,
  //   search,
  //   selectedFilter,
  //   toDate,
  //   workbook2blob,
  // ]);

  // #4
  const createDownloadData = useCallback(() => {
    handleExport().then(url => {
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", "bank of abyssinia.xlsx");
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  }, [handleExport]);


  // const handleSubmit = e => {
  // }


  const handleSubmit = e => {
    e.preventDefault();
    const pdf = new jsPDF("landscape");

    const columns = PDFDate.map(fields => fields.label);
    var rows = [];

    for (let i = 0; i < json.length; i++) {
      var temp = [
        json[i]?.id,
        json[i]?.enrolmentId,
        json[i]?.firstName,
        json[i]?.lastName,
        json[i]?.branchName,
        json[i]?.status,
        json[i]?.lastLogin,
        json[i]?.createdAt,
        json[i]?.updatedBy,
        json[i]?.updatedAt,
        json[i]?.updatedBy,
        // json[i].passwordEnabled,
      ];
      rows.push(temp);
    }
    // pdf.autoTable(columns, rows, {
    //   startY: 75,
    //   margin: {
    //     right: 2,
    //     top: 75,
    //     left: 8.5,
    //   },
    //   didDrawPage: function (data) {
    //     // Header
    //     pdf.addImage(logo, "PNG", 100, 10, 100, 25);
    //     pdf.setLineWidth(0.2);
    //     pdf.rect(8.5, 45, 280, 28);

    //     pdf.setFontSize(11);
    //     pdf.text(`Date : ${moment(new Date()).format("DD-MM-YYYY")}`, 250, 50);

    //     pdf.setFontSize(11);
    //     if (search.length) {
    //       pdf.text(
    //         `${
    //           selectedFilter === "branchId"
    //             ? "Branch Name"
    //             : selectedFilter === "mobileNumber"
    //             ? "Mobile Number"
    //             : selectedFilter === "district"
    //             ? "District"
    //             : selectedFilter === "name"
    //             ? "Name"
    //             : selectedFilter
    //         } : ${
    //           selectedFilter === "branchId"
    //             ? branches.find(dem => dem.value === search).label
    //             : search
    //         }`,
    //         11.5,
    //         60,
    //       );
    //     }
    //     if (roleSearch.length) {
    //       pdf.text(
    //         `${roleFilter === "role" ? "Role" : "Role"} : ${
    //           roleFilter === "role" ? roleSearch : null
    //         }`,
    //         11.5,
    //         70,
    //       );
    //     }

    //     if (fromDate && toDate) {
    //       pdf.setFontSize(11);
    //       pdf.text(
    //         `Date Period : ${moment(fromDate).format("DD-MM-YYYY")} To ${moment(
    //           toDate,
    //         ).format("DD-MM-YYYY")}`,
    //         11.5,
    //         50,
    //       );
    //     }
    //     if (!fromDate && !toDate) {
    //       pdf.setFontSize(11);
    //       pdf.text(
    //         `Date Period : 01-01-2022 To ${moment(new Date()).format(
    //           "DD-MM-YYYY",
    //         )}`,
    //         11.5,
    //         50,
    //       );
    //     }
    //     pdf.setFontSize(10);
    //     pdf.text(
    //       `Generated by : ${roleName
    //         .split("_")
    //         .join(" ")
    //         .split(" ")
    //         .map(
    //           word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
    //         )
    //         .join(" ")} (${reportingRoleName
    //         .split("_")
    //         .join(" ")
    //         .split(" ")
    //         .map(
    //           word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
    //         )
    //         .join(" ")})`,
    //       11.5,
    //       200,
    //     );
    //     pdf.setFontSize(10);
    //     pdf.text(
    //       `Timestamp : ${moment(new Date()).format("DD-MM-YY hh:mm:ss A")}`,
    //       210,
    //       200,
    //     );
    //     // Footer
    //     let str = "Page No " + pdf.internal.getNumberOfPages();
    //     pdf.setFontSize(10);

    //     // jsPDF 1.4+ uses getWidth, <1.4 uses .width
    //     let pageSize = pdf.internal.pageSize;
    //     let pageHeight = pageSize.height
    //       ? pageSize.height
    //       : pageSize.getHeight();
    //     // pdf.text('index+1', data.settings.margin.left+250, pageHeight - 10);
    //     pdf.text(str, data.settings.margin.left + 125, pageHeight - 5);
    //   },

    //   columnStyles: {
    //     0: { cellWidth: 15 },
    //     1: { cellWidth: 30 },
    //     2: { cellWidth: 30 },
    //     3: { cellWidth: 35 },
    //     4: { cellWidth: 20 },
    //     5: { cellWidth: 30 },
    //     6: { cellWidth: 30 },
    //     7: { cellWidth: 20 },
    //     8: { cellWidth: 30 },
    //     9: { cellWidth: 20 },
    //     10: { cellWidth: 20 },
    //   },
    //   theme: "grid",
    //   styles: {
    //     font: "times",
    //     overflow: "linebreak",
    //     align: "left",
    //     cellPadding: 2,
    //     lineWidth: 0.2,
    //     lineColor: [0, 0, 0],
    //     textColor: [0, 0, 0],
    //   },
    //   headStyles: {
    //     textColor: [0, 0, 0],
    //     fontStyle: "normal",
    //     lineWidth: 0.2,
    //     lineColor: [0, 0, 0],
    //     fillColor: [244, 182, 47],
    //   },
    //   alternateRowStyles: {
    //     fillColor: [222, 222, 222],
    //     textColor: [0, 0, 0],
    //     lineWidth: 0.2,
    //     lineColor: [0, 0, 0],
    //   },

    //   tableLineColor: [0, 0, 0],
    // });
    
    pdf.autoTable(columns, rows, {
      startY: 85,
      margin: {
        right: 2,
        top: 85,
        left: 8.5,
      },
      didDrawPage: function (data) {
        // Header
        pdf.addImage(logo, "PNG", 100, 10, 100, 25);
        pdf.setLineWidth(0.2);
        pdf.rect(8.5, 45, 280, 38);

        pdf.setFontSize(14);
        pdf.text('CNAM Enrolments',130,50)
        pdf.setFontSize(11);
        pdf.text(`Date : ${moment(new Date()).format("DD-MM-YYYY")}`, 250, 60);
        // pdf.setFontSize(11);
        // pdf.text(
        //   `Channel : ${Channel.split(" ")
        //     .map(
        //       word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
        //     )
        //     .join(" ")}`,
        //   250,
        //   70,
        // );
        //pdf.setFontSize(11);
        // pdf.text(
        //   `Client : ${Type.split(" ")
        //     .map(
        //       word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
        //     )
        //     .join(" ")}`,
        //   250,
        //   80,
        // );
        // pdf.setFontSize(11);
        // if (search.length) {
        //   pdf.text(
        //     `${
        //       selectedFilter === "branchId"
        //         ? "Branch Name"
        //         : selectedFilter === "mobileNumber"
        //         ? "Mobile Number"
        //         : selectedFilter === "district"
        //         ? "District"
        //         : selectedFilter === "name"
        //         ? "Name"
        //         : selectedFilter
        //     } : ${
        //       selectedFilter === "branchId"
        //         ? branches.find(dem => dem.value === search).label
        //         : search
        //     }`,
        //     11.5,
        //     70,
        //   );
        // }
        // if (roleSearch.length) {
        //   pdf.text(
        //     `${roleFilter === "role" ? "Role" : "Role"} : ${
        //       roleFilter === "role" ? roleSearch : null
        //     }`,
        //     11.5,
        //     80,
        //   );
        // }

        if (fromDate && toDate) {
          pdf.setFontSize(11);
          pdf.text(
            `Date Period : ${moment(fromDate).format("DD-MM-YYYY")} To ${moment(
              toDate,
            ).format("DD-MM-YYYY")}`,
            11.5,
            60,
          );
        }
        if (!fromDate && !toDate) {
          pdf.setFontSize(11);
          pdf.text(
            `Date Period : 01-01-2022 To ${moment(new Date()).format(
              "DD-MM-YYYY",
            )}`,
            11.5,
            60,
          );
        }
        // pdf.setFontSize(10);
        // pdf.text(
        //   `Generated by : ${roleName
        //     .split("_")
        //     .join(" ")
        //     .split(" ")
        //     .map(
        //       word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
        //     )
        //     .join(" ")} (${reportingRoleName
        //     .split("_")
        //     .join(" ")
        //     .split(" ")
        //     .map(
        //       word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
        //     )
        //     .join(" ")})`,
        //   11.5,
        //   200,
        // );
        pdf.setFontSize(11);
        pdf.text(
          `Timestamp : ${moment(new Date()).format("hh:mm:ss A")}`,
          240,
          200,
        );
        // Footer
        let str = "Page No " + pdf.internal.getNumberOfPages();
        pdf.setFontSize(10);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        let pageSize = pdf.internal.pageSize;
        let pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        // pdf.text('index+1', data.settings.margin.left+250, pageHeight - 10);
        pdf.text(str, data.settings.margin.left + 125, pageHeight - 5);
      },

      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 35 },
        2: { cellWidth: 30 },
        3: { cellWidth: 45 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 30 },
        7: { cellWidth: 20 },
        8: { cellWidth: 30 },
        9: { cellWidth: 20 },
        10: { cellWidth: 20 },
      },
      theme: "grid",
      styles: {
        font: "times",
        overflow: "linebreak",
        align: "left",
        cellPadding: 2,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: "normal",
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        fillColor: [244, 182, 47],
      },
      alternateRowStyles: {
        fillColor: [222, 222, 222],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },

      tableLineColor: [0, 0, 0],
    });
    
    
    
       pdf.save("CNAM_Enrolments");
  };
  // useEffect(() => {
  //   setSearch("");
  // }, [selectedFilter, setSearch]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
      axios
        .get("/api/management/enrolment", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${login?.data?.accessToken}`,
          },
          params: {
            pageNumber: pageNumber + 1,
            pageSize,
            fromDate: fromDate?.length!=0 ? moment(fromDate).format("YYYY-MM-DD"): '2022-01-01',
            toDate: toDate?.length!=0 ? moment(toDate).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            dateRangeProperty:'COMPLETED_AT',
            ...(search && {
              [selectedFilter]:
                selectedFilter === "mobileNumber" ? `+251${search}` : search,
            }),
            ...(roleSearch && {
              [roleFilter]: roleSearch,
            }),
          },
        })
        .then(res => {
          const { content, totalSize } = res?.data?.data?.results;

          setTotalSize(totalSize);

          axios
            .get("management/enrolment", {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${login?.data?.accessToken}`,
              },
              params: {
                pageNumber: 1,
                pageSize:res?.data?.data?.results?.totalSize === 0 ? 10 : res.data.data.results.totalSize,
                fromDate: fromDate?.length!=0 ? moment(fromDate).format("YYYY-MM-DD"): '2022-01-01',
                toDate: toDate?.length!=0 ? moment(toDate).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
                dateRangeProperty:'COMPLETED_AT',
                ...(search && {
                  [selectedFilter]:
                    selectedFilter === "mobileNumber"
                      ? `+251${search}`
                      : search,
                }),
                ...(roleSearch && {
                  [roleFilter]: roleSearch,
                }),
              },
            })
            .then(res => {
              const { content } = res.data.data?.results;

              const trimmedData = res.data.data?.results?.content.map(
                (
                  {
                    branchId,
                    displayName,
                    mobileNumber,
                    role,
                    reportingRole,
                    branchName,
                    status,
                    createdAt,
                    createdBy,
                    updatedAt,
                    updatedBy,
                    passwordEnabled,
                    lastLogin,
                  },
                  index,
                ) => {
                  return {
                    serial: index + 1 ,
                    id: index+1,
                    branchId,
                    displayName,
                    mobileNumber,
                    role,
                    reportingRole,
                    branchName,
                    status,
                    createdAt,
                    createdBy,
                    updatedAt,
                    updatedBy,
                    passwordEnabled,
                    lastLogin,
                  };
                },
              );
              setCsvFile(trimmedData);
              setUserListData2(trimmedData);
              setSelectedRows(trimmedData);
            })
            .catch(error => {
              // toast.error(`${error?.response?.data?.error?.message}`);
            })
            .finally(() => {
              setIsLoading(false);
            });
          const trimmedData = res?.data?.data?.results?.content.map(
            ({
            enrolmentId,
             firstName,
             lastName,
             dateOfBirth,
             nationality ,
             personCategory ,
             startedAt,
             completedAt ,
             approvalRequired,
             approvalStatus,
             approvedStatusUpdatedAt,
             processedAt,
            }) => {
              return {
            enrolmentId,
             firstName,
             lastName,
             dateOfBirth,
             nationality ,
             personCategory ,
             startedAt,
             completedAt ,
             approvalRequired,
             approvalStatus,
             approvedStatusUpdatedAt,
             processedAt ,
              };
            },
          );
          
          setUserListData(trimmedData);
          
        })
        .catch(error => {
          toast.error(`${error?.response?.data?.error?.message}`);
          setIsLoading(false);
        });
  }, [
    // accessToken,
    // branchDistrict,
    // branchId,
    fromDate,
    pageNumber,
    pageSize,
    // reportingRoleName,
    search,
    refresh,
    // selectedFilter,
    toDate,
    roleFilter, roleSearch
  ]);

  const handleChangePage = useCallback((_event, newPage) => {
    setPageNumber(newPage);
  }, []);
  const handleChangeRowsPerPage = useCallback(e => {
    setPageSize(parseInt(e.target.value, 10));
    setPageNumber(0);
  }, []);

useEffect(()=>{
  const userAgent = navigator.userAgent;
  console.log(userAgent);
},[])
const handleApprove = useCallback(
  id => {
    setIsLoading(true);
    axios
      .patch(
        `/api/management/enrolment/${id}`,
        {
          approvalStatus: 'APPROVED',
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${login?.data?.accessToken}`,
          },
        },
      )
      .then((res) => {
        if(res.data?.data?.code === 'E500-00-001'){
          setRefresh(prev => !prev);
          toast.error("server error, please try again later");
        }
        else{
          toast.success("Approved Successfully");
        }
        setIsLoading(false);
      }).catch(err=>{
        setIsLoading(false);
        toast.error("error occured, please try again later");
      });
  },
  [login?.data?.accessToken],
);
const handleReject = useCallback(
  id => {
    setIsLoading(true);
    axios
      .patch(
        `/api/management/enrolment/${id}`,
        {
          approvalStatus: 'REJECTED',
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${login?.data?.accessToken}`,
          },
        },
      )
      .then((res) => {
        if(res.data?.data?.code === 'E500-00-001'){
          setRefresh(prev => !prev);
          toast.error("server error, please try again later");
        }
        else{
          toast.success("Rejected Successfully");
        }
        setIsLoading(false);
      }).catch(err=>{
        setIsLoading(false);
        toast.error("error occured");
      });
  },
  [login?.data?.accessToken],
);
  return (
    <Box>
    <Paper elevation={5} sx={{ p: 2 }}>
      
      <Stack
        alignItems='flex-end'
        justifyContent='flex-end'
        mb={2}
        gap={2}
        direction='row'
      >
        <Typography variant='h6' color={theme.palette.primary.main}>
          EXPORT as
        </Typography>

        <Button
          sx={{ borderColor: "black", color: "black" }}
          variant='outlined'
          // disabled={active}
          onClick={handleSubmit}
        >
          PDF
        </Button>
        <Worker workerUrl='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js'>
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#eeeeee",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              display: "none",
              justifyContent: "center",
            }}
          ></div>
        </Worker>
        <Button
      sx={{ borderColor: "black", color: "black" }}
      variant='outlined'
      onClick={() => createDownloadData()}
    >
      CSV
    </Button>
      </Stack>
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          maxHeight: "calc(100vh - 200px)",
          minWidth: 250,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ height: "5%" }}>
              
              {columns.map(cell => (
                <TableCell
                  key={cell.headerName}
                  align='center'
                  width='5%'
                  sx={{ backgroundColor: "#EFF2F7" }}
                >
                  {cell.headerName}
                </TableCell>
              ))}
                <TableCell
                align='center'
                sx={{ backgroundColor: "#EFF2F7" }}
                width='5%'
              >
                EDIT
              </TableCell>
              <TableCell
                align='center'
                sx={{ backgroundColor: "#EFF2F7" }}
                width='5%'
              >
                Approve/Reject
              </TableCell>
              {/* <TableCell
                align='center'
                sx={{ backgroundColor: "#EFF2F7" }}
                width='5%'
              >
                PASSWORD
              </TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2}>
                  <Typography p={5} textAlign='center'>
                    <CircularProgress />
                  </Typography>
                </TableCell>
              </TableRow>
            ) : userListData.length ? (
              userListData.map((user, index) => (
                <TableRow key={user.id}>
                 
                  {columns.map(({ field, width }) => 
                    {return ( field === 'approvalRequired' ?<TableCell
                    key={field}
                    component='th'
                    scope='row'
                    align='center'
                    width='10%'
                  >
                    {user?.approvalRequired ? 'true': 'false'}
                  </TableCell> : <TableCell
                      key={field}
                      component='th'
                      scope='row'
                      align='center'
                      width='10%'
                    >
                      {user[field]}
                    </TableCell>)}
                  )}
                     <TableCell align='center'>
                    <Tooltip
                      title='EDIT'
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                      <IconButton
                        aria-label='edit'
                        size='small'
                        onClick={() => {
                          navigate(
                            `/enrollments/edit/${user.enrolmentId}`,
                          );
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align='center'>
                  <Stack flexDirection="row" gap={3}>
                  <Tooltip
                      title='APPROVE'
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                    <Button
                      variant="contained"
                      size="small"
                      color="green"
                      disabled={user?.approvalRequired===false}
                      onClick={() => handleApprove(user?.enrolmentId)}
                    >
                      approve
                    </Button>
                    </Tooltip>
                    <Tooltip
                      title='REJECT'
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                    <Button
                      color="error"
                      variant="contained"
                      disabled={user?.approvalRequired===false}
                      size="small"
                      onClick={() => handleReject(user?.enrolmentId)}
                    >
                      reject
                    </Button>
                    </Tooltip>
                  </Stack>
                  </TableCell>
                  {/* <TableCell align='center'>
                    <Tooltip
                      title='Deactive-Active'
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                      <Switch
                        checked={user.passwordEnabled}
                        onChange={() =>
                          handleChange(index, user.passwordEnabled)
                        }
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </Tooltip>
                  </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 2}>
                  <Typography p={5} textAlign='center'>
                    NO Data Available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 20]}
        component='div'
        sx={{
          '.MuiInputBase-root': {
            // backgroundColor: 'green',
            marginTop:'-12px',
            marginRight:'5px'
          },
          '.MuiTablePagination-toolbar': {
            // backgroundColor: 'pink',
            // width: '950px',
            color: 'rgb(41, 39, 39)',
            height: '35px',
          },
          '.MuiBox-root': {
            // backgroundColor: 'yellow',
            color: 'black',
    
            '& .MuiSvgIcon-root': {
              // backgroundColor: 'purple',
              color: 'black',
            },
          },
          '.MuiTablePagination-actions':{
            marginTop:'-12px',
            marginLeft:'2px'
          },
          marginTop:'10px',
          marginBottom:'-20px'
        }}
        count={totalSize}
        rowsPerPage={pageSize}
        page={pageNumber}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </Box>
  );
};

export default Enrollments;
