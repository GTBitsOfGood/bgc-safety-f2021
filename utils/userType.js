import urls from "./urls";
import router from "next/router";
import routes from "./routes";

const verifyUserType = async (session, requestedRoute, setUserType) => {
  const userData = await fetchUserData(session);
  setUserType(userData.type);
  const userAllowedRoutes = filterRoutes(userData);
  const requestedRouteInAllowed = userAllowedRoutes.some(
    (route) => requestedRoute === route.link
  );
  !requestedRouteInAllowed && router.replace(urls.pages.not_authorized);
};

const fetchUserData = async (session) => {
  const res = await fetch(`/api/user?email=${session.user.email}`);
  const userData = await res.json();
  return userData[0];
};

const filterRoutes = (currentUser) => {
  let fRoutes = [];
  if (currentUser.type === "Admin") {
    fRoutes = routes.filter(
      (item) =>
        item.type === "Admin" ||
        item.type === "ClubDirectorAttendanceClerk" ||
        item.type === "All"
    );
  } else if (currentUser.type === "BusDriver") {
    fRoutes = routes.filter(
      (item) => item.type === "BusDriver" || item.type === "All"
    );
  } else if (currentUser.type === "ClubDirector") {
    fRoutes = routes.filter(
      (item) =>
        item.type === "ClubDirectorAttendanceClerk" || item.type === "All"
    );
  } else if (currentUser.type === "AttendanceClerk") {
    fRoutes = routes.filter(
      (item) =>
        item.type === "ClubDirectorAttendanceClerk" || item.type === "All"
    );
  } else {
    fRoutes = routes.filter((item) => item.type === "All");
  }
  return fRoutes;
};

export { fetchUserData, verifyUserType, filterRoutes };
