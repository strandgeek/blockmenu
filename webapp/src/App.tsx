import tapMenuLogo from "./assets/logo.svg";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

function App() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="https://dorahacks.io/buidl/4588"
            target="_blank"
            className="inline-flex items-center text-white bg-gray-800 rounded-full p-1 pr-2 sm:text-base lg:text-sm xl:text-base hover:text-gray-200"
            rel="noreferrer"
          >
            <span className="px-3 py-0.5 text-white bg-orange-600 text-xs font-semibold leading-5 uppercase tracking-wide bg-primary rounded-full">
              BETA
            </span>
            <span className="ml-4 text-sm">
              This project is being created for the HackaTRON Season 4 w/
              DoraHacks
            </span>
            <ChevronRightIcon
              className="ml-2 w-5 h-5 text-gray-500"
              aria-hidden="true"
            />
          </a>
        </div>
        <div className="flex w-full justify-center mt-8">
          <img src={tapMenuLogo} className="h-8" alt="TapMenu Logo" />
        </div>
        <div>
          <div className="text-center w-full mt-4 text-gray-500">
            <h2 className="font-bold text-2xl my-8">
              Coming soon
            </h2>
            <div className="max-w-md mx-auto">
              TapMenu is under development and will be launched prior the HackaTRON Season 4 end
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
