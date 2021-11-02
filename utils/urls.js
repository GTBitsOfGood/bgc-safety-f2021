const prod = process.env.NODE_ENV === "production";

export default {
  dbUrl: prod
    ? process.env.MONGO_DB
    : process.env.MONGO_DEV_DB || "mongodb://localhost:27017",
  dbName: "bgc-safety-dev",
  pages: {
    index: "/",
    ssr: "/ssr",
    csv_upload: "/csv_upload",
    roster: "/roster",
    history: "/history",
    route_selection: "/route_selection",
    bus_checkin_roster: "/bus_checkin_roster",
    login: "/login",
    bus_routes: "/bus_routes",
    account_creation: "/account_creation",
    created_accounts: "/created_accounts",
    not_authorized: "/not_authorized",
  },
  api: {
    example: "/api/example",
    student: "/api/student",
    notes: "/api/student/notes",
    club: "/api/club",
    school: "/api/school",
    attendance: "api/attendance",
    checkIn: "/api/checkIn",
    uploadCsv: "/api/upload_csv",
    user: "/api/user",
    login: "/api/login",
  },
};
