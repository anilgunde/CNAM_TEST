import React from "react";
import {
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useCallback } from "react";
import axios from "../../api/axios";
import useLocalStorage from "../../hooks/useLocalStorage";
import { toast } from "react-toastify";
const RejectDialog = ({ setRejectId, rejectId, setRefresh, setIsLoading }) => {
  // const [{ accessToken }] = useLocalStorage("jwtWithDetails");
  const [value, setValue] = useState("");
  const handleChange = useCallback(e => {
    setValue(e.target.value);
  }, []);
  const handleClose = useCallback(() => {
    setRejectId("");
    setValue("");
  }, [setRejectId]);

  const handleReject = useCallback(() => {})
  // const handleReject = useCallback(() => {
  //   if (!value) {
  //     toast.error("Please Add A  Reason");
  //   } else {
  //     setTimeout(() => {
  //       setRejectId("");
  //       setValue("");
  //     }, 500);
  //     setIsLoading(true);
  //     axios
  //       .patch(
  //         `/admin/devices/change-requests/${rejectId}`,
  //         {
  //           approved: false,
  //           rejectionReason: value,
  //         },
  //         {
  //           headers: {
  //             "content-type": "application/json",
  //             authorization: `Bearer ${accessToken}`,
  //           },
  //         },
  //       )
  //       .then(() => {
  //         setIsLoading(false);
  //         setRefresh(prev => !prev);
  //         setValue("");
  //         setRejectId("");
  //         toast.error("Rejected");
  //       })
  //       .catch(err => {
  //         toast.error(err.response.data.error.message);
  //       });
  //   }
  // }, [accessToken, rejectId, setIsLoading, setRefresh, setRejectId, value]);
  return (
    <Dialog open={!!rejectId} onClose={handleClose}>
      <DialogTitle>Please Provide Reject Reason</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={3}
          onChange={handleChange}
          value={value}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" autoFocus onClick={handleReject}>
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectDialog;
