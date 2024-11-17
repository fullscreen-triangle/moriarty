import Link from "next/link";
import React, { useState } from "react";
import Logo from "./Logo";
import { useRouter } from "next/router";
import {
  DribbbleIcon,
  GithubIcon,
  LinkedInIcon,
  MoonIcon,
  PinterestIcon,
  SunIcon,
  TwitterIcon,
} from "./Icons";
import { motion } from "framer-motion";
import { useThemeSwitch } from "./Hooks/useThemeSwitch";

const DropdownLink = ({ href, title, className = "" }) => {
  const router = useRouter();
  
  return (
    <Link 
      href={href} 
      className={`
        ${className}
        block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800
        ${router.asPath === href ? "bg-gray-100 dark:bg-gray-800" : ""}
      `}
    >
      {title}
    </Link>
  );
};

const NavDropdown = ({ title, links, isOpen, setIsOpen }) => {
  return (
    <div className="relative group">
      <button
        className="flex items-center rounded relative group lg:text-light lg:dark:text-dark"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {title}
        <span className="ml-2">▼</span>
        <span
          className={`
            inline-block h-[1px] bg-dark absolute left-0 -bottom-0.5 
            group-hover:w-full transition-[width] ease duration-300 dark:bg-light
            w-0 lg:bg-light lg:dark:bg-dark
          `}
        >
          &nbsp;
        </span>
      </button>
      
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-dark py-1 z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {links.map((link) => (
            <DropdownLink
              key={link.href}
              href={link.href}
              title={link.title}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MobileDropdown = ({ title, links, toggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title} {isOpen ? "▼" : "▶"}
      </button>
      {isOpen && (
        <div className="pl-8">
          {links.map((link) => (
            <CustomMobileLink
              key={link.href}
              href={link.href}
              title={link.title}
              toggle={toggle}
              className="block py-2"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [mode, setMode] = useThemeSwitch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Define all dropdown menus
  const navLinks = {
    championships: [
      { href: "/championships/dimensions", title: "Dimensions" },
      { href: "/championships/single-runner-model", title: "Single Runner Model" },
      { href: "/championships/two-runner-model", title: "Two Runner Model" },
      { href: "/championships/optimal-tournament-ranking", title: "Optimal Tournament Ranking" }
    ],
    anthropometry: [
      { href: "/anthropometry/estimations", title: "Estimations" },
      { href: "/anthropometry/olympics", title: "Olympics" },
      { href: "/anthropometry/aging", title: "Aging" },
      { href: "/anthropometry/optimal-athlete", title: "Optimal Athlete" }
    ],
    legitimacy: [
      { href: "/legitimacy/wind", title: "Wind" },
      { href: "/legitimacy/altitude", title: "Altitude" },
      { href: "/legitimacy/pressure", title: "Pressure" },
      { href: "/legitimacy/temperature", title: "Temperature" },
      { href: "/legitimacy/sea-level-equivalent", title: "Sea Level Equivalent" }
    ],
    biomechanics: [
      { href: "/biomechanics/dynamics", title: "Dynamics" },
      { href: "/biomechanics/kinematics", title: "Kinematics" }
    ],
    acquisition: [
      { href: "/acquisition/puchheim", title: "Puchheim" },
      { href: "/acquisition/step-length", title: "Step Length" },
      { href: "/acquisition/stance-time-balance", title: "Stance Time Balance" },
      { href: "/acquisition/step-frequency", title: "Step Frequency" },
      { href: "/acquisition/vertical-oscillation", title: "Vertical Oscillation" }
    ]
  };

  return (
    <header className="w-full flex items-center justify-between px-32 py-8 font-medium z-10 dark:text-light lg:px-16 relative z-1 md:px-12 sm:px-8">
      <button
        type="button"
        className="flex-col items-center justify-center hidden lg:flex"
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
        onClick={handleClick}
      >
        <span className="sr-only">Open main menu</span>
        <span className={`bg-dark dark:bg-light block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
        <span className={`bg-dark dark:bg-light block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${isOpen ? 'opacity-0' : 'opacity-100'} my-0.5`}></span>
        <span className={`bg-dark dark:bg-light block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
      </button>

      <div className="w-full flex justify-between items-center lg:hidden">
        <nav className="flex items-center justify-center">
          {Object.entries(navLinks).map(([key, links]) => (
            <div key={key} className="mr-4">
              <NavDropdown
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                links={links}
                isOpen={activeDropdown === key}
                setIsOpen={(open) => setActiveDropdown(open ? key : null)}
              />
            </div>
          ))}
        </nav>

        <nav className="flex items-center justify-center flex-wrap lg:mt-2">
          <motion.svg
            target={"_blank"}
            className="mx-px"
            href="#"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Checkout my twitter profile"
          >
            <Logo />
          </motion.svg>

          <button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            className={`w-6 h-6 ease ml-3 flex items-center justify-center rounded-full p-1  
              ${mode === "light" ? "bg-dark text-light" : "bg-light text-dark"}
            `}
            aria-label="theme-switcher"
          >
            {mode === "light" ? (
              <SunIcon className={"fill-dark"} />
            ) : (
              <MoonIcon className={"fill-dark"} />
            )}
          </button>
        </nav>
      </div>

      {isOpen && (
        <motion.div 
          className="min-w-[70vw] sm:min-w-[90vw] flex justify-between items-center flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-32 bg-dark/90 dark:bg-light/75 rounded-lg z-50 backdrop-blur-md"
          initial={{scale:0, x:"-50%", y:"-50%", opacity:0}}
          animate={{scale:1, opacity:1}}
        >
          <nav className="flex items-center justify-center flex-col">
            {Object.entries(navLinks).map(([key, links]) => (
              <MobileDropdown
                key={key}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                links={links}
                toggle={handleClick}
              />
            ))}
          </nav>

          <nav className="flex items-center justify-center mt-2">
            <motion.svg
              target={"_blank"}
              className="w-8 m-px"
              href="#"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Checkout my twitter profile"
            >
              <Logo />
            </motion.svg>

            <button
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
              className={`w-6 h-6 ease m-1 ml-3 sm:mx-1 flex items-center justify-center rounded-full p-1  
                ${mode === "light" ? "bg-dark text-light" : "bg-light text-dark"}
              `}
              aria-label="theme-switcher"
            >
              {mode === "light" ? (
                <SunIcon className={"fill-dark"} />
              ) : (
                <MoonIcon className={"fill-dark"} />
              )}
            </button>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;