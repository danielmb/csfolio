import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";

import { cn } from "@/lib/utils";

import { redirect } from "next/navigation";
import { FormattedMessage } from "react-intl";
export default async function Home() {
  const session = await getServerAuthSession();
  if (session) {
    return redirect("/dashboard");
  }
  console.log(session);
  return (
    <main className="space-y-14">
      {/* <p>
        The page you are trying to access is only available to authenticated
        users. Please{" "}
        <Link href="/api/auth/signin" className={cn("text-blue-500 underline")}>
          login
        </Link>{" "}
        to access the page.
      </p> */}
      <FormattedMessage
        id="notAuthenticated"
        defaultMessage="The page you are trying to access is only available to authenticated users. Please {login} to access the page."
        values={{
          login: (
            <Link
              href="/api/auth/signin/steam"
              className={cn("text-blue-500 underline")}
            >
              <FormattedMessage id="logIn" defaultMessage="Log in" />
            </Link>
          ),
        }}
      />
    </main>
  );
}
