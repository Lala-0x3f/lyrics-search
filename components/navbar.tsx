import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";

import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden gap-2 sm:flex">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
