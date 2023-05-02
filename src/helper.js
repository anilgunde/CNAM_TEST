import axios from "./api/axios";
import { useCallback } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import { PATHS, URL } from "./utils/constants";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
const useResponse = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useLocalStorage("Details", null);

  const [credential, setCredential] = useLocalStorage("credential", null);
  const [details, setDetails] = useLocalStorage("jwtWithDetails", null);

  const LoginApi = useCallback(
    async ({ MobileNumber }) => {
      const response = await axios.get(URL.loginPage.LOGIN_URL, {
        params: {
          "attribute-name": "MobileNumber",
          "attribute-value": MobileNumber,
        },
      });

      const { identityNumber, identityStatus, userStatus, credentials } =
        response?.data?.data;

      setUserDetails({
        identityNumber,
        identityStatus,
        userStatus,
        fingerPositions: response.data?.data?.fingerPositions,
      });
      setCredential({ credentials });
      return response;
    },
    [setCredential, setUserDetails],
  );

  const getUserNameApi = useCallback(async ({ MobileNumber, accessToken }) => {
    const creditialresponse = await axios.get(URL.getcredintial, {
      params: {
        "attribute-name": "MobileNumber",
        "attribute-value": `+251${MobileNumber}`,
      },
    });

    return creditialresponse;
  }, []);
  const PasswordApi = useCallback(
    async ({ identityNumber, Password }) => {
      const response = await axios.post(
        `${URL.loginTypesPage.PASSWORD_URL}${identityNumber}/token`,
        {
          credential: Password,
          credentialType: "PASSWORD",
        },
      );
      const {
        accessToken,
        displayName,
        branchName,
        branchId,
        roleName,
        branchDistrict,
        reportingRoleName,
        passwordChangeRequired,
      } = response?.data?.data;
      axios.defaults.headers.common.authorization = `Bearer ${accessToken}`;
      setDetails({
        accessToken,
        displayName,
        branchName,
        branchId,
        roleName,
        branchDistrict,
        reportingRoleName,
        passwordChangeRequired,
      });
      return response;
    },
    [setDetails],
  );
  const ConfirmPasswordApi = useCallback(
    async ({ identityNumber, Password, PasswordConfirmation }) => {
      const response = await axios.patch(
        `${URL.loginTypesPage.PASSWORD_URL}${identityNumber}/password`,
        {
          password: Password,
          passwordConfirmation: PasswordConfirmation,
        },
      );

      return response;
    },
    [],
  );
  const FaceApi = useCallback(
    async ({ identityNumber, croppedImage }) => {
      const response = await axios.post(
        `${URL.loginTypesPage.FACE_URL}${identityNumber}/token`,
        {
          credential: croppedImage.replace("data:image/jpeg;base64,", ""),
          credentialType: "FACE",
        },
      );

      const {
        accessToken,
        displayName,
        branchId,
        roleName,
        reportingRoleName,
      } = response?.data?.data;
      axios.defaults.headers.common.authorization = `Bearer ${accessToken}`;
      setDetails({
        accessToken,
        displayName,
        branchId,
        reportingRoleName,
        roleName,
      });
      return response;
    },
    [setDetails],
  );
  const FingerApi = useCallback(
    async ({ identityNumber, fingerprint }) => {
      const response = await axios.post(
        `${URL.loginTypesPage.FACE_URL}${identityNumber}/token`,
        {
          credential: fingerprint,
          credentialType: "FINGERPRINT",
        },
      );

      const {
        accessToken,
        displayName,
        branchId,
        roleName,
        reportingRoleName,
      } = response?.data?.data;
      axios.defaults.headers.common.authorization = `Bearer ${accessToken}`;
      setDetails({
        accessToken,
        displayName,
        branchId,
        roleName,
        reportingRoleName,
      });
      return response;
    },
    [setDetails],
  );
  const BranchApi = useCallback(async ({ accessToken }) => {
    const response = await axios.get(`/profile/customer/branch`, {
      headers: {
        "Content-Type": "application/json",
        "X-Client-Type": "WEB",
        authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  }, []);
  // const DistrictApi = useCallback(async () => {
  //   const response = await axios.get(URL.common.DISTRICT_URL);
  //   // axios.defaults.headers.common.authorization = `Bearer ${accessToken}`;

  //   return response;
  // });
  const CreateUserApi = useCallback(
    async ({
      MobileNumber,
      role,
      name,
      branchId,
      status,
      accessToken,
      reportingRole,
      password,
    }) => {
      const response = await axios
        .post(
          URL.userManagement.CREATE_USER_URL,
          {
            attributeName: "MobileNumber",
            attributeValue: MobileNumber,
            role: role,
            reportingRole: reportingRole,
            displayName: name,
            branchId: branchId,
            status: status,
            password:password
          },

          {
            headers: {
              "Content-Type": "application/json",
              "X-Client-Type": "WEB",
              authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .then(res => {
          if (res.data.status === "COMPLETED") {
            toast.success("Created Successfully");
            navigate(PATHS.userManagement.userLists);
          }
        });
      return response;
    },
    [navigate],
  );

  const UpdateUserApi = useCallback(
    async (
      identityNumber,
      {
        mobilenumber,
        role,
        reportingRole,
        branchId,
        status,
        Password,
        displayName,
        passwordEnabled,
      },
    ) => {
      const response = axios
        .patch(`${URL.userManagement.UPDATE_USER_URL}/${identityNumber}`, {
          role: role,
          reportingRole: reportingRole,
          branchId: branchId,
          status,
          password: Password,
          displayName,
          passwordEnabled,
        })
        .then(res => {
          if (res.data.status === "COMPLETED") {
            toast.success("Updated Successfully");
            navigate(PATHS.userManagement.userLists);
          }
        });
      return response;
    },
    [navigate],
  );
  const getAllUserList = useCallback(async () => {
    const response = axios.get(URL.userManagement.ALL_USER_LIST_URL);
    return response;
  }, []);

  const getSingleUser = useCallback(async ({ mobileNumber, accessToken }) => {
    axios.defaults.headers.common.authorization = `Bearer ${accessToken}`;
    const response = axios.get(
      `${URL.userManagement.SINGLE_USER}?mobileNumber=%2B${mobileNumber}`,
    );
    return response;
  }, []);
  // const dashboardApi = useCallback(async ({ accessToken }) => {
  //   axios.defaults.headers.common.authorization = `Bearer ${accessToken}`;
  //   const response = axios.get(URL.dashboard);
  //   return response;
  // }, []);

  return {
    LoginApi,
    PasswordApi,
    FaceApi,
    FingerApi,
    BranchApi,
    CreateUserApi,
    UpdateUserApi,
    getAllUserList,
    getSingleUser,
    getUserNameApi,
    ConfirmPasswordApi,
  };
};

export default useResponse;
