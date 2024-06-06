import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

import { cn } from "@/lib/utils";
import { recentTransactions } from "./data";
import { InventoryValue } from "./transaction-chart";
import { useDateTimeFormatter } from "../_layout/date-time-formatter/date-time-formatter-provider";
import { DateFormatClient } from "@/components/date-format-client";
import { FormattedDate, FormattedMessage } from "react-intl";
import { Transactions } from "@/components/transactions";
import Image from "next/image";
import { TransactionAddForm } from "@/components/transaction/transactions-add";
export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();
  if (!session) {
    return (
      <main className="space-y-14">
        <p>
          The page you are trying to access is only available to authenticated
          users. Please{" "}
          <Link
            href="/api/auth/signin"
            className={cn("text-blue-500 underline")}
          >
            login
          </Link>{" "}
          to access the page.
        </p>
      </main>
    );
  }
  return (
    <main className="space-y-14">
      {/* <p>Welcome back {session?.user.name ?? "guest"}! </p> */}
      <p>
        <FormattedMessage
          id="welcome"
          values={{ name: session.user.name }}
          defaultMessage={`Welcome back guest!`}
        />
        <p>test</p>
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt="profile"
            width={50}
            height={50}
          />
        ) : null}
      </p>
      <div className="flex flex-col space-x-4 pl-2 ">
        {/* <p className="font-bold">Current Liquid Inventory Value: </p> */}
        <p className="font-bold">
          <FormattedMessage
            id="currentLiquidInventoryValue"
            defaultMessage="Current Liquid Inventory Value"
          />
          :{" "}
        </p>
        <p>NOK 1,000,000</p>
      </div>
      <div className="flex w-full justify-between pl-2">
        <div>
          <Transactions />
          <TransactionAddForm />
        </div>
        <div className="justify-center space-y-4 rounded-2xl border p-2 pt-4 text-center">
          {/* <p>Inventory Value</p> */}
          <h1 className="items-center text-center align-middle text-2xl font-bold">
            <FormattedMessage
              id="inventoryValue"
              defaultMessage="Inventory Value"
            />
          </h1>
          <InventoryValue data={recentTransactions} />
        </div>
        <div className="h-96 w-60  justify-center space-y-4 rounded-2xl border pt-4">
          {/* Title */}
          <h1 className="items-center text-center align-middle text-2xl font-bold">
            {/* NEWS */}
            <FormattedMessage id="news" defaultMessage="News" />
          </h1>

          {/* News */}
          <div className="flex flex-col px-2">
            <div className="flex flex-col space-y-2 border p-2">
              <p className="font-bold">Title</p>
              <p>Content</p>
            </div>
            <div className="flex flex-col space-y-2 border p-2">
              <p className="font-bold">Title</p>
              <p>Content</p>
            </div>
            <div className="flex flex-col space-y-2 border p-2">
              <p className="font-bold">Title</p>
              <p>Content</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
