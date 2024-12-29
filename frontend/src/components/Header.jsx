import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// Define items with headings
const crafts = [
  {
    heading: "Functional",
    items: [{ title: "Ceramics & Pottery" }, { title: "Basketry" }],
  },
  {
    heading: "Decorative",
    items: [{ title: "Camel Skin" }, { title: "Wood Craft" }],
  },
  { heading: "Fashion", items: [{ title: "Ajrak" }, { title: "Khussa" }] },
];

const decor = [
  {
    heading: "Home Decor",
    items: [{ title: "Boxes & Jars" }, { title: "Lamps" }],
  },
  {
    heading: "Furnishing",
    items: [
      { title: "Paintings" },
      { title: "Furniture" },
      { title: "Rugs & Carpets" },
    ],
  },
  {
    heading: "Home Textile",
    items: [{ title: "Cushions" }, { title: "Tissue Box Covers" }],
  },
]; // Customize decor items as needed
const apparel = [
  {
    heading: "Clothing",
    items: [
      { title: "Scarfs & Shawls" },
      { title: "Unstitched Fabric" },
      { title: "Hats & Caps" },
      { title: "Sweaters Coats & Uppers" },
    ],
  },
];
const accessories = [
  { heading: "Bags & Purses", items: [{ title: "Clutches & Wristlets" }] },
  { heading: "Jewelry", items: [{ title: "Bangles" }, { title: "Necklaces" }] },
  { heading: "Miscellaneous", items: [{ title: "Gloves & Mitts" }] },
];

function renderMenuItems(categories, navigate) {
  return categories.map(({ heading, items }, key) => (
    <div key={key} className="w-auto">
      <h2 className="text-orange-500 font-bold ml-4 mb-4">{heading}</h2>
      {items.map(({ title }, index) => {
        const path = `/${title.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`;
        return (
          <MenuItem
            key={index}
            className="flex items-center gap-4 mb-4 border-t pt-2 hover:border-orange-500 hover:bg-white transition-colors duration-400 cursor-pointer rounded-none"
            onClick={() => navigate(path)}
          >
            <p className="text-sm font-bold">{title}</p>
          </MenuItem>
        );
      })}
    </div>
  ));
}


function NavListMenu({ title, items, isMobile, handleCraftClick }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      {!isMobile && (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} offset={{ mainAxis: 20 }} placement="bottom" allowHover={true}>
          <MenuHandler>
            <Typography as="div" className="text-sm">
              <ListItem
                className="flex items-center gap-2 py-2 pr-4 text-gray-900 border-r-2 rounded-none border-gray-400 hover:bg-white"
                onClick={handleCraftClick}
              >
                {title}
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                />
              </ListItem>
            </Typography>
          </MenuHandler>
          <MenuList className={`px-4 py-2 bg-white shadow-lg border rounded-lg ${items.length === 1 ? "w-80" : "w-[50rem]"}`}>
            <ul className={`grid gap-y-4 gap-x-10 outline-none ${items.length === 1 ? "grid-cols-1" : "grid-cols-3"}`}>
              {renderMenuItems(items, navigate)}
            </ul>
          </MenuList>
        </Menu>
      )}
      {isMobile && (
        <div className="block lg:hidden">
          <ListItem className="flex items-center gap-2 py-2 pr-4 text-gray-900 hover:bg-white" onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
            {title}
            <ChevronDownIcon strokeWidth={2.5} className={`h-3 w-3 transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`} />
          </ListItem>
          <Collapse open={isMobileMenuOpen}>
            <div className="grid grid-cols-1 gap-4">{renderMenuItems(items, navigate)}</div>
          </Collapse>
        </div>
      )}
    </div>
  );
}


function NavList() {
  const navigate = useNavigate();

  const handleCraftClick = () => {
    navigate("/craftMap");
  };
  const handleHomeClick = () => {
    navigate("/");
  };
  const isMobile = window.innerWidth < 960;

  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <Typography
        as="a"
        onClick={handleHomeClick}
        href="#"
        color="blue-gray"
        className="text-sm"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Home</ListItem>
      </Typography>
      <NavListMenu title="Crafts" items={crafts} isMobile={isMobile} />
      <NavListMenu title="Decor" items={decor} isMobile={isMobile} />
      <NavListMenu title="Apparel" items={apparel} isMobile={isMobile} />
      <NavListMenu
        title="Accessories"
        items={accessories}
        isMobile={isMobile}
      />
      <Typography
        as="a"
        onClick={handleCraftClick}
        className="text-sm cursor-pointer"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          Craft Map
        </ListItem>
      </Typography>
    </List>
  );
}

export function NavbarWithMegaMenu() {
  const [openNav, setOpenNav] = React.useState(false);
  const isMobile = window.innerWidth < 960;

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <Navbar className="mx-auto max-w-full px-4 py-2">
      <div className="flex items-center justify-center text-blue-gray-900">
        <div className="hidden lg:block">
          <NavList />
        </div>
        {/* Toggle mobile menu */}
        <IconButton
          variant="text"
          color="blue-gray"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <div className="block lg:hidden">
          <NavList />
        </div>
      </Collapse>
    </Navbar>
  );
}
