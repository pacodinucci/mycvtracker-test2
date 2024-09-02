import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from "../assets/logo.png";
import { Container, Flex, Stack, Text } from "@mantine/core";

import styles from "../styles/BottomFooter.module.css";

const BottomFooter = () => {
  return (
    <Flex bg="#1e222c" style={{ width: "100%" }}>
      <Container py="md">
        <Stack spacing={0} align="center">
          <Image src={logo} alt="My CV Tracker Logo" width={150} className="my-2" />
          <Link href="/terms" className="text-decoration-none">
            <Text align="center">Terms & Conditions</Text>
          </Link>
          <p className={`${styles.location}`}>London, United Kingdom</p>
          <p className={styles.copyright}>Copyright My CV Tracker</p>
          <Flex align="center" direction="row" gap="lg" justify="center">
            <Link target="_blank" href="https://www.facebook.com/My-CV-Tracker-494026290989681/" rel="noreferrer">
              <FaFacebookF color="gray" />
            </Link>

            <Link target="_blank" href="https://twitter.com/mycvtracker" rel="noreferrer">
              <FaTwitter color="gray" />
            </Link>

            <a href="">
              <FaInstagram color="gray" />
            </a>
          </Flex>
        </Stack>
      </Container>
    </Flex>
  );
};

export default BottomFooter;
