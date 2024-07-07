"use client";

import { api } from "@/trpc/react";
import React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandDialog,
  CommandSeparator,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
const Page = () => {
  const { data: conversations } = api.message.getConversations.useQuery();
  return (
    <div>
      <h1>Messages</h1>
      <ul>
        {conversations?.map((conversation) => (
          <li key={conversation.id}>
            <Link
              href={`/messages/${conversation.id}`}
              className="text-blue-500"
            >
              Conversation with
              {conversation.participants.map((p) => p.name).join(", ")}
            </Link>
          </li>
        ))}
      </ul>
      <NewConversation />
    </div>
  );
};

const NewConversation = () => {
  const [userIds, setUserIds] = React.useState<string[]>([]);

  const { mutateAsync: newConversation } =
    api.message.newConversation.useMutation();

  const startConversation = async () => {
    await newConversation({ userIds });
  };

  return (
    <div>
      <h1>New Conversation</h1>
      <FriendsSelector onChange={setUserIds} />
      <button onClick={startConversation}>Start Conversation</button>
    </div>
  );
};

const FriendsSelector = ({
  onChange,
}: {
  onChange: (ids: string[]) => void;
}) => {
  api.session.initSession.useSubscription(Math.random(), {
    onData: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const { data: friends } = api.user.getFriends.useQuery();
  const [selected, setSelected] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const toggleFriend = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  React.useEffect(() => {
    onChange(selected);
  }, [selected]);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Select friends <Badge>{selected.length}</Badge>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandList>
          {friends?.map((friend) => (
            <CommandItem
              key={friend.id}
              // onClick={() => toggleFriend(friend.id)}
              onSelect={() => toggleFriend(friend.id)}
              className="w-full justify-between align-middle"
            >
              <div className="flex items-center">
                <Checkbox
                  checked={selected.includes(friend.id)}
                  className="mr-2"
                />
                {friend.image && (
                  <Image
                    src={friend.image}
                    alt={`${friend.name ?? "User"}'s profile picture`}
                    width={32}
                    height={32}
                    className="mr-2 rounded-full"
                  />
                )}
                {friend.name}
              </div>
              <div>{friend.isOnline && <Badge>Online</Badge>}</div>
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
};
export default Page;
