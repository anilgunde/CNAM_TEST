import React, { useEffect, useCallback, useMemo } from "react";
import { Worker } from "@react-pdf-viewer/core";
import "jspdf-autotable";
import jsPDF from "jspdf";
import logo from "../../../assets/BoA logo@2x.png";
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
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import moment from "moment";
import { CSVLink } from "react-csv";
import { useState } from "react";
import axios from "../../../api/axios";
import { v4 as uuid } from "uuid";
import useLocalStorage from "../../../hooks/useLocalStorage";

const columns = [
  {
    field: "fullName",
    headerName: "Name",
    width: 20,
  },
  { field: "mobileNumber", headerName: "Mobile Number", width: 50 },
  { field: "agentName", headerName: "Agent Name", width: 50 },
  { field: "agentBranch", headerName: "Agent Branch", width: 50 },
  { field: "agentDistrict", headerName: "Agent District", width: 50 },
  { field: "adjudicatorName", headerName: "Adjudicator Name", width: 50 },
  { field: "status", headerName: "Status", width: 50 },
  { field: "createdAt", headerName: "Created Date", width: 50 },
];

const headersCsv = [
  { label: "FullName", key: "fullName" },
  { label: "Mobile Number", key: "mobileNumber" },
  { label: "Agent Name", key: "agentName" },
  { label: "Agent Branch", key: "agentBranch" },
  { label: "Agent District", key: "agentDistrict" },
  { label: "Adjudicator Name", key: "adjudicatorName" },
  { label: "Status", key: "status" },
  { label: "Created Date", key: "createdAt" },
];

const PDFDate = [
  { label: "No", key: "serial" },
  { label: "FullName", key: "fullName" },
  { label: "Mobile Number", key: "mobileNumber" },
  { label: "Agent Name", key: "agentName" },
  { label: "Agent Branch", key: "agentBranch" },
  { label: "Agent District", key: "agentDistrict" },
  { label: "Adjudicator Name", key: "adjudicatorName" },
  { label: "Status", key: "status" },
  { label: "Created Date", key: "createdAt" },
];
const RegistrationsListCard2 = ({
  search,
  selectedFilter,
  setSearch,
  fromDate,
  branches,
  toDate,
  pageSize,
  setPageSize,
  Type,
  Channel,
}) => {
  // ! Replace
  const theme = useTheme();
  const [
    { accessToken, reportingRoleName, branchId, branchDistrict, roleName },
  ] = useLocalStorage("jwtWithDetails");
  const [csvFile, setCsvFile] = useState([]);
  const [userListData, setUserListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  // const { UpdateUserApi, getSingleUser } = useResponse();

  // ! Displaying  BranchId as BranchName
  // const branchesMap = useMemo(
  //   () =>
  //     branches?.reduce((acc, branch) => {
  //       acc[branch?.value] = branch?.label;
  //       return acc;
  //     }, {}) || {},
  //   [branches],
  // );

  const searchText = useMemo(
    () => ({
      ...(search && {
        [selectedFilter]:
          selectedFilter === "mobileNumber" ? `+251${search}` : search,
      }),
    }),
    [search, selectedFilter],
  );

  const registrations = useCallback(
    (pageSize, pageNumber) => {
      return axios.get("/admin/reporting/enrollments/list", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        params: {
          pageNumber:1,
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
          ...(reportingRoleName === "BRANCH_REPORT_VIEWER" && {
            branch: branchId,
          }),
          ...(reportingRoleName === "DISTRICT_REPORT_VIEWER" && {
            district: branchDistrict,
          }),
          pageSize,
          ...searchText,
        },
      });
    },
    [
      Channel,
      Type,
      accessToken,
      branchDistrict,
      branchId,
      fromDate,
      reportingRoleName,
      searchText,
      toDate,
    ],
  );

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
  const handleExport = useCallback(() => {
    const Filterss = [
      {
        A:
          search.length !== 0
            ? `${
              selectedFilter === "branch"
                ? "Branch Name"
                : selectedFilter === "mobileNumber"
                ? "Mobile Number"
                : selectedFilter === "district"
                ? "District"
                : selectedFilter === "name"
                ? "Name"
                : selectedFilter
            } : ${
              selectedFilter === "branch"
                ? branches.find(dem => dem.value === search).label
                : search
            }`
            : null,
      },
    ];
    const Datee = [
      {
        A: ` Date Period : ${
          fromDate === "" ? "2022-01-01" : moment(fromDate).format("YYYY-MM-DD")
        } To ${
          toDate === ""
            ? moment(new Date()).format("YYYY-MM-DD")
            : moment(toDate).format("YYYY-MM-DD")
        }`,
      },
    ];

    const Clientt = [
      {
        A: `Client : ${Type.split(" ")
          .map(word => word[0]?.toUpperCase() + word.substring(1).toLowerCase())
          .join(" ")}`,
      },
    ];

    const Channell = [
      {
        A: `Channel : ${Channel.split(" ")
          .map(word => word[0]?.toUpperCase() + word.substring(1).toLowerCase())
          .join(" ")}`,
      },
    ];

    const TimeStampp = [
      { A: ` Timestamp : ${moment(new Date()).format("hh:mm:ss A")}` },
    ];
    //const Role = [{ A: roleSearch.length !== 0 ? `ROLE : ${roleSearch}` : null }];
    let table1 = [
      {
        A: "Serial No",
        B: "Name",
        C: "Mobile Number",
        D: "Agent Name",
        E: "Agent Branch",
        F: "Agent District",
        G: "Adjudicator Name",
        H: "Status",
        I: "Created Date",
      },
    ];

    csvFile.forEach(row => {
      table1.push({
        A: row.serial,
        B: row.fullName,
        C: row.mobileNumber,
        D: row.agentName,
        E: row.agentBranch,
        F: row.agentDistrict,
        G: row.adjudicatorName,
        H: row.status,
        I: row.createdAt,
      });
    });

    const finalData = [
      { A: "Assisted Digital Customer  Onboarding - Registrations" },
      {},
      // ...Role,
      ...Filterss,
      ...Clientt,
      ...Channell,
      ...Datee,
      ...TimeStampp,
      {},
      {},
      ...table1,
    ];
    // Create a workbook
    const wb = XLSX.utils.book_new();
    // Create a worksheet
    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });

    const dataInfo = {
      titleCell: "A1",
      titleRange: "A1:I2",
      tbodyRange: `A11:I${finalData.length}`,
    };

    XLSX.utils.book_append_sheet(wb, sheet, "Bank of abyssinia");

    const workbookBlob = workbook2blob(wb);

    const headerIndexes = [];
    finalData.forEach((data, index) =>
      data["A"] === "Serial No" ? headerIndexes.push(index) : null,
    );

    return addStyles(workbookBlob, dataInfo);
  }, [
    Channel,
    Type,
    addStyles,
    csvFile,
    fromDate,
    // roleSearch,
    search,
    selectedFilter,
    toDate,
    workbook2blob,
  ]);

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


  // const handleSubmit = async e => {
  //   e.preventDefault();

  //   const data = await registrations(totalSize, 0);
  //   const json = data.data.data.content?.map((values, index) => {
  //     return {
  //       serial: index + 1,
  //       fullName: values.fullName,
  //       mobileNumber: values.mobileNumber,
  //       agentName: values.agentName,
  //       agentBranch: values.agentBranch,
  //       agentDistrict: values.agentDistrict,
  //       adjudicatorName: values.adjudicatorName,
  //       status: values.status,
  //       createdAt: values.createdAt,
  //     };
  //   });

  //   const pdf = new jsPDF("landscape");
  //   const columns = PDFDate.map(fields => fields.label);
  //   var rows = [];

  //   for (let i = 0; i < json.length; i++) {
  //     var temp = [
  //       json[i].serial,
  //       json[i].fullName,
  //       json[i].mobileNumber,
  //       json[i].agentName,
  //       json[i].agentBranch,
  //       json[i].agentDistrict,
  //       json[i].adjudicatorName,
  //       json[i].status,
  //       json[i].createdAt,
  //     ];
  //     rows.push(temp);
  //   }
  //   pdf.autoTable(columns, rows, {
  //     startY: 80,
  //     margin: {
  //       right: 2,
  //       top: 75,
  //       left: 8.5,
  //     },
  //     didDrawPage: function (data) {
  //       // Header
  //       pdf.addImage(logo, "PNG", 100, 10, 100, 25);
  //       pdf.setLineWidth(0.2);
  //       pdf.rect(8.5, 45, 280, 28);

  //       pdf.setFontSize(11);
  //       pdf.text(`Date : ${moment(new Date()).format("DD-MM-YYYY")}`, 250, 50);
  //       pdf.setFontSize(11);
  //       pdf.text(
  //         `Channel : ${Channel.split(" ")
  //           .map(
  //             word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
  //           )
  //           .join(" ")}`,
  //         250,
  //         60,
  //       );
  //       pdf.setFontSize(11);
  //       pdf.text(
  //         `Client : ${Type.split(" ")
  //           .map(
  //             word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
  //           )
  //           .join(" ")}`,
  //         250,
  //         70,
  //       );
  //       pdf.setFontSize(11);
  //       if (search?.length) {
  //         pdf.text(
  //           `${
  //             selectedFilter === "branch"
  //               ? "Branch Name"
  //               : selectedFilter === "mobileNumber"
  //               ? "Mobile Number"
  //               : selectedFilter === "district"
  //               ? "District"
  //               : selectedFilter === "name"
  //               ? "Name"
  //               : selectedFilter
  //           } : ${
  //             selectedFilter === "branch"
  //               ? branches?.find(dem => dem?.value === search)?.label
  //               : search
  //           }`,
  //           11.5,
  //           60,
  //         );
  //       }

  //       if (fromDate && toDate) {
  //         pdf.setFontSize(11);
  //         pdf.text(
  //           `Date Period : ${moment(fromDate).format("DD-MM-YYYY")} To ${moment(
  //             toDate,
  //           ).format("DD-MM-YYYY")}`,
  //           11.5,
  //           50,
  //         );
  //       }
  //       if (!fromDate && !toDate) {
  //         pdf.setFontSize(11);
  //         pdf.text(
  //           `Date Period : 01-01-2022 To ${moment(new Date()).format(
  //             "DD-MM-YYYY",
  //           )}`,
  //           11.5,
  //           50,
  //         );
  //       }
  //       pdf.setFontSize(10);
  //       pdf.text(
  //         `Generated by : ${roleName
  //           .split("_")
  //           .join(" ")
  //           .split(" ")
  //           .map(
  //             word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
  //           )
  //           .join(" ")} (${reportingRoleName
  //           .split("_")
  //           .join(" ")
  //           .split(" ")
  //           .map(
  //             word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
  //           )
  //           .join(" ")})`,
  //         11.5,
  //         200,
  //       );
  //       pdf.setFontSize(11);
  //       pdf.text(
  //         `Timestamp : ${moment(new Date()).format("hh:mm:ss A")}`,
  //         240,
  //         200,
  //       );
  //       // Footer
  //       let str = "Page No " + pdf.internal.getNumberOfPages();
  //       pdf.setFontSize(10);

  //       // jsPDF 1.4+ uses getWidth, <1.4 uses .width
  //       let pageSize = pdf.internal.pageSize;
  //       let pageHeight = pageSize.height
  //         ? pageSize.height
  //         : pageSize.getHeight();
  //       // pdf.text('index+1', data.settings.margin.left+250, pageHeight - 10);
  //       pdf.text(str, data.settings.margin.left + 125, pageHeight - 5);
  //     },

  //     columnStyles: {
  //       0: { cellWidth: 10 },
  //       1: { cellWidth: 30 },
  //       2: { cellWidth: 30 },
  //       3: { cellWidth: 40 },
  //       4: { cellWidth: 40 },
  //       5: { cellWidth: 30 },
  //       6: { cellWidth: 30 },
  //       7: { cellWidth: 30 },
  //       8: { cellWidth: 40 },
  //     },
  //     theme: "grid",
  //     styles: {
  //       font: "times",
  //       overflow: "linebreak",
  //       align: "left",
  //       cellPadding: 2,
  //       lineWidth: 0.2,
  //       lineColor: [0, 0, 0],
  //       textColor: [0, 0, 0],
  //     },
  //     headStyles: {
  //       textColor: [0, 0, 0],
  //       fontStyle: "normal",
  //       lineWidth: 0.2,
  //       lineColor: [0, 0, 0],
  //       fillColor: [244, 182, 47],
  //     },
  //     alternateRowStyles: {
  //       fillColor: [222, 222, 222],
  //       textColor: [0, 0, 0],
  //       lineWidth: 0.2,
  //       lineColor: [0, 0, 0],
  //     },

  //     tableLineColor: [0, 0, 0],
  //   });
  //    pdf.save("BankOfAbyssinia");
  // };
  


  const handleSubmit = async e => {
    e.preventDefault();

    const data = await registrations(totalSize, 0);
    const json = data.data.data.content?.map((values, index) => {
      return {
        serial: index + 1,
        fullName: values.fullName,
        mobileNumber: values.mobileNumber,
        agentName: values.agentName,
        agentBranch: values.agentBranch,
        agentDistrict: values.agentDistrict,
        adjudicatorName: values.adjudicatorName,
        status: values.status,
        createdAt: values.createdAt,
      };
    });

    const pdf = new jsPDF("landscape");
    const columns = PDFDate.map(fields => fields.label);
    var rows = [];

    for (let i = 0; i < json.length; i++) {
      var temp = [
        json[i].serial,
        json[i].fullName,
        json[i].mobileNumber,
        json[i].agentName,
        json[i].agentBranch,
        json[i].agentDistrict,
        json[i].adjudicatorName,
        json[i].status,
        json[i].createdAt,
      ];
      rows.push(temp);
    }
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
        pdf.text('Assisted Digital Customer Onboarding - Registrations',90,50)
        pdf.setFontSize(11);
        pdf.text(`Date : ${moment(new Date()).format("DD-MM-YYYY")}`, 250, 60);
        pdf.setFontSize(11);
        pdf.text(
          `Channel : ${Channel.split(" ")
            .map(
              word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
            )
            .join(" ")}`,
          250,
          70,
        );
        pdf.setFontSize(11);
        pdf.text(
          `Client : ${Type.split(" ")
            .map(
              word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
            )
            .join(" ")}`,
          250,
          80,
        );
        pdf.setFontSize(11);
        if (search?.length) {
          pdf.text(
            `${
              selectedFilter === "branch"
                ? "Branch Name"
                : selectedFilter === "mobileNumber"
                ? "Mobile Number"
                : selectedFilter === "district"
                ? "District"
                : selectedFilter === "name"
                ? "Name"
                : selectedFilter
            } : ${
              selectedFilter === "branch"
                ? branches?.find(dem => dem?.value === search)?.label
                : search
            }`,
            11.5,
            70,
          );
        }

        if (fromDate && toDate) {
          pdf.setFontSize(11);
          pdf.text(
            `Date Period : ${moment(fromDate).format("DD-MM-YYYY")} To ${moment(
              toDate,
            ).format("DD-MM-YYYY")}`,
            11.5,
            50,
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
        pdf.setFontSize(10);
        pdf.text(
          `Generated by : ${roleName
            .split("_")
            .join(" ")
            .split(" ")
            .map(
              word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
            )
            .join(" ")} (${reportingRoleName
            .split("_")
            .join(" ")
            .split(" ")
            .map(
              word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
            )
            .join(" ")})`,
          11.5,
          200,
        );
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
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
        7: { cellWidth: 30 },
        8: { cellWidth: 30 },
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
    pdf.save("BankOfAbyssinia");
  };
  
  
  useEffect(() => {
    setSearch("");
  }, [selectedFilter, setSearch]);

  useEffect(() => {
    setIsLoading(true);
    registrations(pageSize, pageNumber)
      .then(res => {
        const data = res.data.data.content;
        setTotalSize(res.data.data.totalSize);
        const trimmedData = data.map(values => {
          return {
            serial: uuid(),
            fullName: values.fullName,
            mobileNumber: values.mobileNumber,
            agentName: values.agentName,
            agentBranch: values.agentBranch,
            agentDistrict: values.agentDistrict,
            adjudicatorName: values.adjudicatorName,
            status: values.status,
            createdAt: values.createdAt,
          };
        });
        axios
          .get("/admin/reporting/enrollments/list", {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
            params: {
             pageNumber : 1,

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
              ...(reportingRoleName === "BRANCH_REPORT_VIEWER" && {
                branch: branchId,
              }),
              ...(reportingRoleName === "DISTRICT_REPORT_VIEWER" && {
                district: branchDistrict,
              }),
              pageSize:
                res.data.data.totalSize === 0 ? 10 : res.data.data.totalSize,
              ...searchText,
            },
          })
          .then(res2 => {
            const json = res2.data.data.content?.map((values, index) => {
              return {
                serial: index + 1,
                fullName: values.fullName,
                mobileNumber: values.mobileNumber,
                agentName: values.agentName,
                agentBranch: values.agentBranch,
                agentDistrict: values.agentDistrict,
                adjudicatorName: values.adjudicatorName,
                status: values.status,
                createdAt: values.createdAt,
              };
            });
            setCsvFile(json);
          });
        setUserListData(trimmedData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    Channel,
    Type,
    accessToken,
    branchDistrict,
    branchId,
    fromDate,
    pageNumber,
    pageSize,
    registrations,
    reportingRoleName,
    searchText,
    toDate,
  ]);

  const handleChangePage = useCallback((e, newPage) => {
    setPageNumber(newPage);
  }, []);
  const handleChangeRowsPerPage = useCallback(
    e => {
      setPageSize(parseInt(e.target.value, 10));
      setPageNumber(0);
    },
    [setPageSize],
  );

  return (
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
                  align='left'
                  width='5%'
                  sx={{ backgroundColor: "#EFF2F7" }}
                >
                  {cell.headerName}
                </TableCell>
              ))}
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
                  {columns.map(({ field, width }) => (
                    <TableCell
                      key={field}
                      component='th'
                      scope='row'
                      align='left'
                      width='10%'
                    >
                      {/* {field === "branchId"
                        ? branchesMap[user[field]]
                        : user[field]} */}
                      {user[field]}
                    </TableCell>
                  ))}
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
          "& .css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input":
            {
              paddingRight: "24px",
              paddingBottom: "19px",
              minWidth: "16px",
            },
        }}
        count={totalSize}
        rowsPerPage={pageSize}
        page={pageNumber}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default RegistrationsListCard2;
