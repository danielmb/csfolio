import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormattedDate, FormattedMessage, FormattedNumber } from "react-intl";
import { api } from "@/trpc/server";
import { cn } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";

export const Transactions = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    return null;
  }
  const recentTransactions = await api.transaction.get();
  return (
    <Table className="w-full  border border-gray-200">
      {/* <TableCaption>Recent Purchases/Sales</TableCaption> */}
      <TableCaption>
        <FormattedMessage
          id="recentPurchasesSales"
          defaultMessage="Recent Purchases/Sales"
        />
      </TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="text-left">Date & Time</TableHead> */}
          <TableHead className="text-left">
            <FormattedMessage id="dateTime" defaultMessage="Date & Time" />
          </TableHead>
          {/* <TableHead className="text-left">Item</TableHead> */}
          <TableHead className="text-left">
            <FormattedMessage id="item" defaultMessage="Item" />
          </TableHead>
          {/* <TableHead className="text-left">Price</TableHead> */}
          <TableHead className="text-left">
            <FormattedMessage id="price" defaultMessage="Price" />
          </TableHead>
          {/* <TableHead className="text-left">Buy/Sell</TableHead> */}
          <TableHead className="text-left">
            <FormattedMessage id="buySell" defaultMessage="Buy/Sell" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentTransactions.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              <FormattedMessage
                id="noTransactions"
                defaultMessage="No transactions"
              />
            </TableCell>
          </TableRow>
        )}
        {recentTransactions.map((transaction, i) => (
          <TableRow key={i}>
            <TableCell className="text-left">
              <FormattedDate value={transaction.transactionDate} />
            </TableCell>
            <TableCell className="text-left">{transaction.name}</TableCell>

            {/* <TableCell className="text-left">{transaction.price}</TableCell> */}
            <TableCell className="text-left">
              <FormattedNumber value={transaction.price} style="currency" />
            </TableCell>
            <TableCell
              className={cn(
                "text-left",
                transaction.type === "BUY" ? "text-green-500" : "text-red-500",
              )}
            >
              {transaction.type === "BUY" ? (
                <FormattedMessage id="buy" defaultMessage="Buy" />
              ) : (
                <FormattedMessage id="sell" defaultMessage="Sell" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
