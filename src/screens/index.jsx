import React, { useEffect, useState } from "react";
import { helloWorld } from "../actions/api";
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
      <h2>Welcome to Next.js!</h2>
      <h3>
        This page is static rendered, because all API calls are made in
        useEffect
      </h3>
      <h4>{payload}</h4>
      <p>You can tell because the text above flashes on page refresh</p>
    </>
  );
};

export default HomePage;
