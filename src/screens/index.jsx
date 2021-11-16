import React, { useEffect, useState } from "react";
import axios from "axios";
// import { Login } from '../pages/login.jsx';
import router from "next/router";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import urls from "../../utils/urls";

const HomePage = () => {
  const [payload, setPayload] = useState("");
  const [session, loading] = useSession();

  useEffect(() => {
    // Example how to create page without ssr
    // helloWorld().then(resp => {
    //   setPayload(resp);
    // });
    const { pathname } = router;
    if (pathname == "/") {
      router.push("/login");
    }

    // const currentUser = {
    //   BGCMA_email: "sahya",
    //   password: '$2a$10$/NYjx/SvECs8YZEYfS4HMOkfZvrYcO5hqERWOyYAEka5vTsgQOZgS',
    //   type: "BusDriver",
    //   club: "All"
    // }
  }, []);

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={signIn}>click to sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={signOut}>click to sign out</button>
        </>
      )}
    </>
  );
};

export default HomePage;
