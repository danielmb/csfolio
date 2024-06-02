import LoggedInUserAvatar from "@/components/user-avatar";
import React from "react";

const Page = () => {
  return (
    // center the content in the page not in the y-axis
    <div className="flex justify-center">
      <div className="w-1/2 rounded-lg bg-gray-300 p-6 dark:bg-gray-800">
        <div className="flex">
          <LoggedInUserAvatar width={120} height={120} className="border-4" />
          <div className="ml-6">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <div className="flex flex-row space-x-2">
              <p className="text-gray-600">
                This is the display name of the user
              </p>
              <p className="text-gray-600" aria-label="Country">
                NO Norway
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
