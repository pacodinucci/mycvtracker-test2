import "styles/globals.scss";
import type { AppProps } from "next/app";

import React, { ReactElement, useEffect } from "react";
import TopNavigation from "../components/TopNavigation";
import BottomFooter from "../components/BottomFooter";

import styles from "../styles/app.module.css";
import Head from "next/head";
import { UserStateProvider } from "../hooks/useUserState";
import { ToastProvider } from "../hooks/useToast";

import { AppShell, MantineProvider, ScrollArea } from "@mantine/core";
import Sidebar from "../components/Sidebar";
import { NotificationsProvider } from "@mantine/notifications";
// import { hotjar } from 'react-hotjar';
 

function MyApp({ Component, pageProps }: AppProps): ReactElement {
//   useEffect(() => {
//   hotjar.initialize(1795044, 6);
//   hotjar.identify('USER_ID', { userProperty: 'value' });
//   hotjar.event('button-click');
//   hotjar.stateChange('/my/page');
//   if (hotjar.initialized()) {
//     hotjar.identify('USER_ID', { userProperty: 'value' });
//   }
// }, [])
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider position="top-right" zIndex={2077}>
        <ToastProvider>
          <UserStateProvider>
            <>
              <Head>
                <title>Dev Interview</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
              </Head>
              <AppShell padding={0} navbarOffsetBreakpoint="sm" navbar={<Sidebar />} header={<TopNavigation />}>
                <ScrollArea>
                  <div className={styles.componentContainer}>
                    <div className={styles.component}>
                      <Component {...pageProps} />
                    </div>
                    <BottomFooter />
                  </div>
                </ScrollArea>
              </AppShell>
            </>
          </UserStateProvider>
        </ToastProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
