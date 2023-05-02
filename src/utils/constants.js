export const PATHS = {
  login: "/",
  loginTypes: "/loginTypes",
  password: "/password",
  passwordChangeRequest: "/passwordChangeRequest",
  dashboard: "/dashboard",
  finger: "/finger",
  face: "/face",
  enroll: {
    root: "/enroll/",
    total: "/enroll/total",
    day: "/enroll/day",
    week: "/enroll/week",
    month: "/enroll/month",
    dataRange: "/enroll/date",
  },
  authentication: {
    root: "/authentications",
    day: "/authentications/day",
    week: "/authentications/week",
    month: "/authentications/month",
    dataRange: "/authentications/date",
  },
  adjudication: {
    root: "/adjudication/",
    total: "/adjudication/total",
    day: "/adjudication/day",
    week: "/adjudication/week",
    month: "/adjudication/month",
    dataRange: "/adjudication/date",
  },
  metric: {
    root: "/metrics",
    reports: "/metrics/reports",
    adjudication: "/metrics/adjudication",
    // registrations: "/metrics/registrations",
    // users: "/metrics/users",
    // auditTrail: "/metrics/auditTrail",
  },

  userManagement: {
    root: "/userManagement",
    createUser: "/userManagement/createUser",
    updateUser: "/userManagement/updateUser",
    userLists: "/userManagement",
    nuser: "/nuser",
  },

  enrollments:{
    root: "/enrollments",
  },
  configuration:{
    root: "/configuration",
  },

  datasets: {
    root: "/datasets/registrations",
    reports: "/datasets/reports",
    registrations: "/datasets/registrations",
    users: "/datasets/registrations/users",
    auditTrail: "/datasets/registrations/auditTrail",
  },
  deviceManagement: {
    root: "/deviceManagement",
    deviceList: "/deviceManagement/deviceList",
    deviceDetails: "/deviceManagement/deviceDetails",
    deviceRequests: "/deviceManagement/active-inActive",
  },
};

export const SM_WIDTH = 1100;

export const URL = {
  loginPage: {
    LOGIN_URL: "/user/credential",
  },
  loginTypesPage: {
    PASSWORD_URL: "/user/",
    FACE_URL: "/user/",
  },
  common: {
    BRANCH_URL: "/profile/customer/branch",
    DISTRICT_URL: "profile/customer/district",
  },
  getcredintial: "/user/credential",
  getUserName: "/identity",
  userManagement: {
    CREATE_USER_URL: "/user",
    UPDATE_USER_URL: "/user",
    ALL_USER_LIST_URL: "/user",
    SINGLE_USER: "/user",
  },
  dashboard: "/admin/reporting/dashboard",
  // enrollmentDashboard: "/admin/reporting/enrollments",
  authenticationDashboard: "/admin/reporting/authentications",
};

export const DROPOps = {
  channelOptions: [
    { label: "Assisted", value: "assisted" },
    { label: "Self-KYC", value: "self_kyc" },
    { label: "All", value: "all" },
  ],
  typeOptions: [
    { label: "Mobile", value: "mobile" },
    { label: "Web", value: "web" },
    { label: "All", value: "all" },
  ],
};

export const NIVO = {
  PIE: [
    {
      id: "self",
      label: "SELF",
      value: 120,
      color: "hsl(103, 10%, 10%)",
    },
    {
      id: "web",
      label: "WEB",
      value: 120,
      color: "hsl(206, 72%, 39%)",
    },
    {
      id: "mobile",
      label: "MOBILE",
      value: 120,
      color: "hsl(212, 70%, 50%)",
    },
  ],
};
