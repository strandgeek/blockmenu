import { Fragment } from "react";
import ReactPlayer from "react-player";
import { Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BookOpenIcon,
  ChevronRightIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  PaintBrushIcon,
  QrCodeIcon,
  RocketLaunchIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import LogoSrc from "../assets/logo.svg";
import { Link } from "react-router-dom";

export const IndexPage = () => {
  return (
    <div className="bg-gray-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 h-full w-full" aria-hidden="true">
          <div className="relative h-full">
            <svg
              className="absolute right-full transform translate-y-1/3 translate-x-1/4 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={784}
                fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)"
              />
            </svg>
            <svg
              className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="d2a68204-c383-44b1-b99f-42ccff4e5365"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={784}
                fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)"
              />
            </svg>
          </div>
        </div>

        <div className="relative pt-6 pb-16 sm:pb-24">
          <Popover>
            {({ open }) => (
              <>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                  <nav
                    className="relative flex items-center justify-between sm:h-10 md:justify-center"
                    aria-label="Global"
                  >
                    <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
                      <div className="flex items-center justify-between w-full md:w-auto">
                        <a href="#">
                          <span className="sr-only">BlockMenu</span>
                          <img
                            className="h-8 w-auto sm:h-10"
                            src={LogoSrc}
                            alt=""
                          />
                        </a>
                        <div className="-mr-2 flex items-center md:hidden">
                          <Popover.Button className="bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                          </Popover.Button>
                        </div>
                      </div>
                    </div>

                    <div className="px-2 pt-2 pb-3 space-y-1">
                      <a
                        href="https://dorahacks.io/buidl/4588"
                        target="_blank"
                        className="hidden md:inline-flex items-center text-white bg-gray-800 rounded-full p-1 pr-2 sm:text-base lg:text-sm xl:text-base hover:text-gray-200"
                        rel="noreferrer"
                      >
                        <span className="px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-primary rounded-full">
                          BETA
                        </span>
                        <span className="ml-4 text-sm">
                          This project was created for the HackaTRON Season 4 w/
                          DoraHacks
                        </span>
                        <ChevronRightIcon
                          className="ml-2 w-5 h-5 text-gray-500"
                          aria-hidden="true"
                        />
                      </a>
                    </div>

                    <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
                      <span className="inline-flex rounded-md shadow">
                        <Link
                          to="/admin/auth"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-500"
                        >
                          Log in
                        </Link>
                      </span>
                    </div>
                  </nav>
                </div>

                <Transition
                  show={open}
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="duration-100 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Popover.Panel
                    focus
                    static
                    className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
                  >
                    <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="px-5 pt-4 flex items-center justify-between">
                        <div>
                          <img className="h-8 w-auto" src={LogoSrc} alt="" />
                        </div>
                        <div className="-mr-2">
                          <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close main menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </Popover.Button>
                        </div>
                      </div>
                      <div className="px-2 pt-2 pb-3 space-y-1"></div>
                      <Link
                        to="/admin/auth"
                        className="block w-full px-5 py-3 text-center font-medium text-primary bg-gray-50 hover:bg-gray-100 hover:text-indigo-700"
                      >
                        Log in
                      </Link>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>

          <a
            href="https://dorahacks.io/buidl/4588"
            target="_blank"
            className="inline-flex md:hidden items-center text-white bg-gray-800 rounded-lg pr-2 mx-4 mt-6 p-4 sm:text-base lg:text-sm xl:text-base hover:text-gray-200"
            rel="noreferrer"
          >
            <span className="px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-primary rounded-full">
              BETA
            </span>
            <span className="ml-4 text-sm">
              This project was created for the HackaTRON Season 4
            </span>
            <ChevronRightIcon
              className="ml-2 w-5 h-5 text-gray-500"
              aria-hidden="true"
            />
          </a>

          <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">
                  It's time to launch your restaurant{" "}
                </span>
                <span className="block text-primary">on the blockchain.</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                BlockMenu is a complete solution for managing a restaurant on
                the blockchain. Manage your restaurant, accept orders and
                payments on the <strong>BitTorrent-Chain</strong> blockchain
              </p>

              <Link
                to="https://docs.blockmenu.xyz"
                target="_blank"
                className="btn btn-outline btn-lg mt-8 lg:mr-4"
              >
                <BookOpenIcon className="w-6 h-6 mr-4" />
                Docs
              </Link>
              <Link to="/deploy" className="btn btn-primary btn-lg mt-8 ">
                <RocketLaunchIcon className="w-6 h-6 mr-4" />
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="z-[500] bg-gray-800 py-16">
        <div className="mx-auto flex justify-center">
          <div className="player-wrapper">
            <ReactPlayer url="https://youtu.be/r_qEtkfQFwQ" />
          </div>
        </div>
      </div>

      <section className="bg-white">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="max-w-screen-md mb-8 lg:mb-16 mx-auto text-center">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
              Revolutionize your restaurant experience with BlockMenu
            </h2>
            <p className="text-gray-500 sm:text-xl">
              Say goodbye to expensive licensing fees and hello to a new era of
              blockchain-based menus and seamless dining experiences.
            </p>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            <div>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
                <RocketLaunchIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Easy to Setup</h3>
              <p className="text-gray-500">
                No need to hire a software developer, simply deploy your own
                smart contract and start operating your restaurant on the
                blockchain.
              </p>
            </div>
            <div>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
                <PaintBrushIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">
                Personalized Appearance
              </h3>
              <p className="text-gray-500">
                Elevate your brand experience by tailoring the design of your
                dApp to match the unique personality and style of your
                restaurant.
              </p>
            </div>
            <div>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
                <QrCodeIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Seamless Ordering</h3>
              <p className="text-gray-500">
                Customers can easily scan your QR code and start ordering. Those
                with a BTTC wallet will have an even more enhanced experience.
              </p>
            </div>
            <div>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
                <CurrencyDollarIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Automatic Tipping</h3>
              <p className="text-gray-500">
                With our platform, customers can easily select and add tips to
                their payment, which are then automatically transferred to the
                waiter's wallet.
              </p>
            </div>
            <div>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
                <UsersIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">
                Streamlined Staff Management
              </h3>
              <p className="text-gray-500">
                Manage your staff and operations with different permission
                levels, ensuring your team is equipped to provide the best
                customer experience.
              </p>
            </div>
            <div>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
                <CubeTransparentIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">BitTorrent-Chain</h3>
              <p className="text-gray-500">
                Our platform is built on top of the BitTorrent-Chain, a secure
                and tested blockchain bridged with TRON, Ethereum, and BSC.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-700">
            Frequently asked questions
          </h2>
          <div className="grid pt-8 text-left border-t border-gray-200 md:gap-16 md:grid-cols-2">
            <div>
              <div className="mb-10">
                <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900">
                  <svg
                    className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  What is BlockMenu and how does it work?
                </h3>
                <p className="text-gray-500">
                  BlockMenu is a Open-Source blockchain-based solution for
                  managing a restaurant. It allows restaurant owners to manage
                  their menus, staff, orders, and payments securely and
                  transparently on the BitTorrent-Chain blockchain. Customers
                  can order food and pay for their meals using BTT. <br />
                  <br />
                </p>
              </div>
              <div className="mb-10">
                <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900">
                  <svg
                    className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  What if my customer does not have knowledge about Web3?
                </h3>
                <p className="text-gray-500">
                  The experience of using BlockMenu is enhanced when customers
                  connect their crypto wallets, but even without doing so, they
                  can still scan the QR code, view the menu, and the waiter can
                  place orders like they would in any traditional restaurant.
                </p>
              </div>
            </div>
            <div>
              <div className="mb-10">
                <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900">
                  <svg
                    className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Why should I use BlockMenu for my restaurant?
                </h3>
                <p className="text-gray-500">
                  One of the key benefits of BlockMenu is that you don't need to
                  pay expensive fees for licenses and hosting. Our platform is
                  built on the BitTorrent-Chain blockchain, which means that
                  it's decentralized and doesn't require any intermediaries to
                  operate. This results in lower costs for both you and your
                  customers.
                </p>
              </div>
              <div className="mb-10">
                <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900">
                  <svg
                    className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  What is the BlockMenu's revenue model?
                </h3>
                <p className="text-gray-500">
                  BlockMenu is completely free and open-source under the MIT
                  license, with no service fees or monthly prices. We plan to
                  offer an optional premium service that indexes your smart
                  contract and includes a dashboard with metrics to help you, as
                  restaurant owner, make more informed business decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="z-[500] bg-gray-800 py-16">
          <div className="max-w-7xl text-white mx-auto flex justify-between items-center">
            <div>© BlockMenu - All rights reserved.</div>

            <div>
              <a href="https://github.com/strandgeek/blockmenu" target="_blank">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
