import routes from "./routes";
import { useEffect, useState } from "react";

const useUserType = (session) => {
  const [userType, setUserType] = useState(null);
  useEffect(async () => {
    if (session) {
      const userData = await fetchUserData(session);
      setUserType(userData.type);
    }
  }, [session]);
  return userType;
};

const useUserAuthorized = (session, requestedRoute) => {
  const [userAuthorized, setUserAuthorized] = useState(false);

  useEffect(async () => {
    if (session) {
      setUserAuthorized(await verifyUserType(session, requestedRoute));
    }
  }, [session]);
  return userAuthorized;
};

const verifyUserType = async (session, requestedRoute) => {
  const userData = await fetchUserData(session);
  const userAllowedRoutes = filterRoutes(userData);
  const requestedRouteInAllowed = userAllowedRoutes.some(
    (route) => requestedRoute === route.link
  );
  return requestedRouteInAllowed;
};

const fetchUserData = async (session) => {
  const res = await fetch(`/api/user?email=${session.user.email}`);
  const userData = await res.json();
  return userData[0];
};

const filterRoutes = (currentUser) => {
  let fRoutes = [];
  if (currentUser.type === userTypes.admin) {
    fRoutes = routes.filter(
      (item) =>
        item.type === "Admin" ||
        item.type === "ClubDirectorAttendanceClerk" ||
        item.type === "All"
    );
  } else if (currentUser.type === userTypes.busDriver) {
    fRoutes = routes.filter(
      (item) => item.type === "BusDriver" || item.type === "All"
    );
  } else if (
    currentUser.type === userTypes.clubDirector ||
    currentUser.type === userTypes.attendanceClerk
  ) {
    fRoutes = routes.filter(
      (item) =>
        item.type === "ClubDirectorAttendanceClerk" || item.type === "All"
    );
  } else {
    fRoutes = routes.filter((item) => item.type === "All");
  }
  return fRoutes;
};

const userTypes = {
  admin: "Admin",
  attendanceClerk: "AttendanceClerk",
  clubDirector: "ClubDirector",
  busDriver: "BusDriver",
};

export {
  useUserType,
  useUserAuthorized,
  fetchUserData,
  verifyUserType,
  filterRoutes,
};

export default userTypes;
