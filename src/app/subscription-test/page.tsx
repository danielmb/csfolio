// export default function SubscriptionTest() {

import { Input } from "@/components/ui/input";
import { SendMessage } from "./(actions)/send-message";
import { SubscriptionApiTest } from "./(components)/api-subscription";
import { EnableButton } from "./(components)/enable-button";
import { SubscriptionTest } from "./(components)/trpc-subscription";
import { Label } from "@/components/ui/label";

const Page = () => {
  return (
    <div className="p-4">
      <div className="w-1/2">
        <EnableButton
          enableText="Enable Subscription Test"
          disableText="Disable Subscription Test"
        >
          <SubscriptionTest />
        </EnableButton>
      </div>
      <hr className="my-8" />
      <div className="w-1/2">
        <EnableButton
          enableText="Enable Subscription API Test"
          disableText="Disable Subscription API Test"
        >
          <SubscriptionApiTest />
          <form action={SendMessage}>
            <Label htmlFor="message">Message</Label>
            <Input name="message" placeholder="Message" />
          </form>
        </EnableButton>
      </div>
    </div>
  );
};

export default Page;
