import App from "next/app";
import React from "react";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import Header from "../components/header";
import theme from "../../utils/theme";
import "../../public/static/App.css";
import { Provider } from "next-auth/client";

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Provider session={pageProps.session}>
        <ThemeProvider theme={theme}>
          <Head>
            <title>Nextjs-Starter</title>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Raleway"
            />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Raleway:bold"
            />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
            />
          </Head>
          <div className="App">
            <ThemeProvider theme={theme}>
              <Header defaultSelected="Home" />
              <div className="Content">
                <Component {...pageProps} />
              </div>
            </ThemeProvider>
          </div>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default MyApp;
