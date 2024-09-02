import {
  Group,
  Button,
  UnstyledButton,
  Text,
  Loader,
  Avatar,
  Menu,
  createStyles,
  MediaQuery,
  ActionIcon,
  Header,
} from "@mantine/core";
import { NavbarBrand } from "reactstrap";
import { useDisclosure } from "@mantine/hooks";
import { useUserState } from "../hooks/useUserState";

import logo from "../assets/logo.png";
import { FaAngleDown, FaUserAlt, FaCog, FaPowerOff, FaEquals } from "react-icons/fa";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { adminRoutes, authRoutes, CVServices, JobServices } from "../data/route";
import NavigationDrawer from "./NavigationDrawer";
import styles from "../styles/TopNavigation.module.css";

const useStyles = createStyles((theme) => ({
  hoverBtn: {
    color: "#ffffff",
  },
}));

const TopNavigation = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  const { user, isLoading: isLoadingUser, logoutUser } = useUserState();
  const router = useRouter();

  const { classes } = useStyles();

  useEffect(() => {
    if (user === null && !isLoadingUser && authRoutes.includes(router.route)) {
      router.replace("/login");
    } else if (user !== null && user.userRole !== "ADMIN" && adminRoutes.includes(router.asPath)) {
      router.replace("/login");
    }
  }, [user, router, isLoadingUser]);

  if (router.route === "/login") return null;

  return (
    <Header height={70} px="md" fixed={true} style={{ backgroundColor: "#1e222c", zIndex: 11 }}>
      <NavigationDrawer opened={drawerOpened} onClose={closeDrawer} />
      <Group position="apart" sx={{ height: "100%" }}>
        {/* <Link href="/">
          <Image alt="logo" src={logo} height={50} width={150} />
        </Link> */}
        <NavbarBrand href="/">
          <Image alt="logo" src={logo} height={50} width={150} />
        </NavbarBrand>
        <MediaQuery query="(min-width: 767px)" styles={{ display: "none" }}>
          <ActionIcon onClick={toggleDrawer}>
            <FaEquals />
          </ActionIcon>
        </MediaQuery>
        {(user !== null) && <MediaQuery query="(max-width: 767px)" styles={{ display: "none" }}>
          <Group>
            <Menu trigger="hover" openDelay={100} closeDelay={400}>
              <Menu.Target>
                <UnstyledButton className={classes.hoverBtn}>
                  CV Services <FaAngleDown />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                {CVServices.map((service) => (
                  <Menu.Item component={Link} key={service.label} href={service.link} target="_blank">
                    {service.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            <Menu trigger="hover" openDelay={100} closeDelay={400}>
              <Menu.Target>
                <UnstyledButton className={classes.hoverBtn}>
                  Job Services <FaAngleDown />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                {JobServices.map((service) => (
                  <Menu.Item component={Link} key={service.label} href={service.link} target="_blank">
                    {service.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            {isLoadingUser && (
              <Group>
                <Loader />
              </Group>
            )}
            {!isLoadingUser && !user && (
              <Group>
                <Button variant="default" component={Link} href="/login">
                  Log in
                </Button>
              </Group>
            )}
            {!isLoadingUser && user && (
              <Menu width={200}>
                <Menu.Target>
                  <Group>
                    <Avatar src="https://mycvtracker.com/assets/img/app/profile/user.png" radius="xl" />
                    <div style={{ flex: 1 }}>
                      <Text size="md" weight={600} color="white">
                        {`${user.firstName} ${user.lastName}`}
                      </Text>
                      <Text color="dimmed" size="xs">
                        {user.email}
                      </Text>
                    </div>
                    <FaAngleDown color="#ffffff" />
                  </Group>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item icon={<FaUserAlt size={14} />} component={Link} href="/dashboard">
                    Dashboard
                  </Menu.Item>
                  <Menu.Item icon={<FaCog size={14} />} component={Link} href="/settings">
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>User</Menu.Label>
                  <Menu.Item icon={<FaPowerOff size={14} />} onClick={logoutUser}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </MediaQuery>
        }
      </Group>
    </Header>
  );
};

export default TopNavigation;
