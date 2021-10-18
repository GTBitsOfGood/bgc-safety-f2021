import React from "react";
import Link from "next/link";
import urls from "../../../utils/urls";
import { useSession } from "next-auth/client";
import { useUserAuthorized } from "../../../utils/userType";

//needs styling
const BusRoutesOverview = ({ clubs }) => {
  const [session] = useSession();
  const userAuthorized = useUserAuthorized(session, urls.pages.bus_routes);

  if (!session || !userAuthorized) {
    return <div />;
  }

  return (
    <div>
      {clubs.map(({ ClubName }) => (
        <Link href={`/bus_routes/${ClubName}`}>
          <a>{ClubName}</a>
        </Link>
      ))}
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch(`${urls.baseUrl}${urls.api.club}`);
  const clubs = await res.json();
  return { props: { clubs: clubs.payload } };
}

export default BusRoutesOverview;
