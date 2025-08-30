import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  
} from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import apiClient from "../services/api-client";
import type { Category, SubCategory } from "../types/types";
import { useNavigate } from "react-router-dom";


export default function CategoriesNav() {
  const { isOpen, onToggle } = useDisclosure();
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    apiClient.get<Category[]>("/categories")
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const handleNavigation = (mainCategoryId?: string, subCategoryId?: string) => {
    const path = "/businesses";
    const params = new URLSearchParams();
    if (mainCategoryId) {
      params.append("mainCategoryId", mainCategoryId);
    }
    if (subCategoryId) {
      params.append("subCategoryId", subCategoryId);
    }
    navigate(`${path}?${params.toString()}`);
  };

  interface NavMenuItem {
  label: string;
  id?: string;
  children?: Array<{ label: string; id: string; parentId?: string; }>;
}

  const NAV_ITEMS: Array<NavMenuItem> = categories.map(category => ({
    label: category.name,
    id: category.id,
    children: category.subcategories?.map((sub: SubCategory) => ({
      label: sub.name,
      id: sub.id,
      parentId: category.id,
    })),
  }));

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      borderBottom={1}
      borderColor={useColorModeValue("gray.200", "gray.900")}
    >
      <Flex
        mx="auto"
        px={{ base: 4, md: 10 }}
        py={4}
        align="center"
        justify="space-between"
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="ghost"
          aria-label="Toggle Categories"
        />
        <Flex flex={{ base: 1 }} justify={{ base: "start", md: "center" }}>
          <Box display={{ base: "none", md: "flex" }}>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={6}
              align="center"
            >
              {NAV_ITEMS.map((navItem) => (
                <NavItem key={navItem.label} {...navItem} handleNavigation={handleNavigation} />
              ))}
            </Stack>
          </Box>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack
          bg={useColorModeValue("white", "gray.800")}
          p={4}
          display={{ md: "none" }}
        >
          {NAV_ITEMS.map((navItem) => (
            <MobileNavItem key={navItem.label} {...navItem} handleNavigation={handleNavigation} />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}

// Desktop nav item: supports submenu with popover
interface NavItemProps {
  label: string;
  id?: string;
  children?: Array<{ label: string; id: string; parentId?: string; }>;
  handleNavigation: (mainCategoryId?: string, subCategoryId?: string) => void;
}

const NavItem = ({ label, id, children = [], handleNavigation }: NavItemProps) => {
  const popoverBg = useColorModeValue("white", "gray.800");

  return (
    <Popover
      trigger="hover"
      placement="bottom-start"
      openDelay={0}
      closeDelay={50}
    >
      <PopoverTrigger>
        <Text p={2} fontSize="sm" fontWeight={500} cursor="pointer" onClick={() => handleNavigation(id)}>
          {label}
        </Text>
      </PopoverTrigger>
      {children.length > 0 && (
        <PopoverContent
          border={0}
          boxShadow="xl"
          bg={popoverBg}
          p={4}
          rounded="xl"
          minW="sm"
        >
          <Stack>
            {children.map((child) => (
              <DesktopSubNav key={child.label} {...child} handleNavigation={handleNavigation} />
            ))}
          </Stack>
        </PopoverContent>
      )}
    </Popover>
  );
};

// Desktop submenu item
interface DesktopSubNavProps {
  label: string;
  id?: string;
  parentId?: string;
  handleNavigation: (mainCategoryId?: string, subCategoryId?: string) => void;
}

const DesktopSubNav = ({ label, id, parentId, handleNavigation }: DesktopSubNavProps) => (
  <Box
    onClick={() => handleNavigation(parentId, id)}
    role="group"
    display="block"
    p={2}
    rounded="md"
    _hover={{ bg: useColorModeValue("gray.50", "gray.900") }}
    cursor="pointer"
  >
    <Stack direction="row" align="center">
      <Box>
        <Text
          transition="all .3s"
          _groupHover={{ color: "teal.400" }}
          fontWeight={500}
        >
          {label}
        </Text>
      </Box>
      <Flex
        transition="all .3s"
        transform="translateX(10px)"
        opacity={0}
        _groupHover={{ opacity: 1, transform: "translateX(0)" }}
        justify="flex-end"
        align="center"
        flex={1}
      >
        <Icon color="teal.400" w={5} h={5} as={ChevronRightIcon} />
      </Flex>
    </Stack>
  </Box>
);

// Mobile nav item: accordion style
interface MobileNavItemProps {
  label: string;
  id?: string;
  children?: Array<{ label: string; id: string; parentId?: string; }>;
  handleNavigation: (mainCategoryId?: string, subCategoryId?: string) => void;
}

const MobileNavItem = ({ label, id, children = [], handleNavigation }: MobileNavItemProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Stack spacing={4} onClick={children.length > 0 ? onToggle : () => handleNavigation(id)}>
      <Flex
        py={2}
        justify="space-between"
        align="center"
        _hover={{ textDecoration: "none" }}
        cursor="pointer"
      >
        <Text fontWeight={600}>{label}</Text>
        {children.length > 0 && (
          <Icon
            as={ChevronDownIcon}
            w={6}
            h={6}
            transform={isOpen ? "rotate(180deg)" : undefined}
          />
        )}
      </Flex>
      {isOpen && (
        <Stack
          ps={4}
          borderStart={1}
          borderStyle="solid"
          borderColor={borderColor}
        >
          {children.map((child) => (
            <Box key={child.label} py={2} onClick={() => handleNavigation(child.parentId, child.id)} cursor="pointer">
              {child.label}
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
