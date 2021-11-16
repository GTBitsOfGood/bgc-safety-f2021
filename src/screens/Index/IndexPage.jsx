import React from "react";
import { helloWorld } from "../../actions/General";
import classes from "./IndexPage.module.css";

const IndexPage = () => {
  const [payload, setPayload] = React.useState("");

  React.useEffect(() => {
    // Example how to create page without ssr
    helloWorld().then((resp) => {
      setPayload(resp);
    });
  }, []);

  return (<></>);
};

export default IndexPage;
