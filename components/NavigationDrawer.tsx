import React from "react";

import { Drawer, Button, Accordion, NavLink, Stack } from "@mantine/core";
import { CVServices, JobServices, NavLinkRoutes } from "../data/route";
import Link from "next/link";
import { useUserState } from "../hooks/useUserState";
import { FaUserAlt } from "react-icons/fa";
import { useRouter } from "next/router";

const NavigationDrawer = ({ opened, onClose }: { opened: boolean; onClose: () => void }) => {
  const { user, isLoading: isLoadingUser, logoutUser } = useUserState();
  const router = useRouter();
  return (
    <Drawer opened={opened} onClose={onClose}>
      <Accordion variant="filled">
        <Accordion.Item value="cv_services">
          <Accordion.Control>CV Services</Accordion.Control>
          <Accordion.Panel>
            {CVServices.map((service) => (
              <NavLink label={service.label} component={Link} href={service.link} target="_blank" key={service.label} />
            ))}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="job_services">
          <Accordion.Control>Job Services</Accordion.Control>
          <Accordion.Panel>
            {JobServices.map((service) => (
              <NavLink label={service.label} component={Link} href={service.link} target="_blank" key={service.label} />
            ))}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      {!isLoadingUser && !user && (
        <Stack p="sm">
          <Button variant="default" component={Link} href="/login">
            Log in
          </Button>
        </Stack>
      )}
      {!isLoadingUser && user && (
        <Stack>
          <NavLink icon={<FaUserAlt />} component={Link} href="/dashboard" label="Dashboard" />
          {NavLinkRoutes.map((route) => (
            <NavLink
              key={route.path}
              icon={<route.icon />}
              label={route.label}
              component={Link}
              href={route.path}
              active={router.asPath === route.path}
            />
          ))}

          <Button variant="default" m="sm" onClick={logoutUser}>
            Logout
          </Button>
        </Stack>
      )}
    </Drawer>
  );
};

export default NavigationDrawer;
