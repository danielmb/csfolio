import { type RouterInputs, type RouterOutputs, api } from "@/trpc/react";
import React, { useEffect, useMemo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Loader, UserIcon } from "lucide-react";
import { FormattedDate, FormattedTime } from "react-intl";
import { useInView } from "react-intersection-observer";
import { useChat } from "@/redis/chat.client";
type MessageContent = RouterOutputs["message"]["messages"]["messages"][number];
interface ChatProps {
  conversationId: string;
}

interface MessageProps {
  message: MessageContent;
  isSelf?: boolean;
  prevIsSameSender?: boolean;
  nextIsSameSender?: boolean;
  seenBy: MessageContent["seenBy"]; // Profile pictures of users who have seen the message
  showTime?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}
export const Message = ({
  message,
  isSelf,
  prevIsSameSender,
  nextIsSameSender,
  seenBy,
  showTime,
  ref,
}: MessageProps) => {
  const [windowFocused, setWindowFocused] = React.useState(true);
  const { mutate: markAsRead } = api.message.markAsRead.useMutation();
  const isReadByMe = useMemo(
    () => message.seenBy.some((user) => user.id === message.sender.id),
    [message.seenBy, message.sender.id],
  );
  // check if page is activated
  React.useEffect(() => {
    const onFocus = () => setWindowFocused(true);
    const onBlur = () => setWindowFocused(false);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, [isSelf]);

  useEffect(() => {
    if (windowFocused && !isReadByMe) {
      markAsRead({ messageId: message.id });
    }
  }, [isSelf, message.id, windowFocused, markAsRead, isReadByMe]);
  return (
    <div className={cn("mt-2 flex", isSelf && "flex-row-reverse")} ref={ref}>
      <div className="flex flex-col">
        {showTime && (
          <div className="w-full content-center align-middle text-sm text-gray-500">
            {/* {message.createdAt.toISOString()} */}
            <time
              dateTime={message.createdAt.toISOString()}
              className="flex space-x-2"
            >
              <p>
                <FormattedTime value={message.createdAt} />
              </p>
              <p>
                <FormattedDate value={message.createdAt} />
              </p>
            </time>
          </div>
        )}
        {!prevIsSameSender && (
          <div className={cn("text-sm text-gray-500", isSelf && "text-right")}>
            <p>{message.sender.name}</p>
          </div>
        )}

        <div className={cn("flex space-x-2", isSelf && "flex-row-reverse")}>
          {nextIsSameSender ? (
            <div className="w-10" />
          ) : (
            <div className="relative h-10 w-10 rounded-full bg-gray-400">
              {message.sender.image && (
                <Image
                  src={message.sender.image}
                  alt={`${message.sender.name}'s profile picture`}
                  fill
                />
              )}
            </div>
          )}

          <div
            className={cn(
              "rounded-lg p-2",
              isSelf
                ? "bg-gray-300 dark:bg-gray-700"
                : "bg-gray-200 dark:bg-gray-800",
            )}
          >
            {message.message}
          </div>
        </div>

        <div className="flex w-full content-end items-center space-x-2">
          {seenBy.map((user) => (
            <div key={user.id} className="relative h-4 w-4 rounded-full">
              {user.image && (
                <Image
                  src={user.image}
                  alt={`${user.name}'s profile picture`}
                  fill
                  className="rounded-full"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export const Chat = ({ conversationId }: ChatProps) => {
  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const [input, setInput] = React.useState<RouterInputs["message"]["messages"]>(
    {
      conversationId,
    },
  );
  const {
    data: messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isFetchingPreviousPage,
    fetchPreviousPage,
  } = api.message.messages.useInfiniteQuery(
    {
      ...input,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.cursor;
      },
    },
  );
  const apiUtils = api.useUtils();
  const { data: sessionData } = useSession();
  const { data: conversationData } =
    api.message.getConversation.useQuery(conversationId);

  // api.message.joinConversation.useSubscription(conversationId, {
  //   onData: (data) => {
  //     // console.log(data);
  //     console.log(data);
  //     if (data.type === "message") {
  //       apiUtils.message.messages
  //         .cancel()
  //         .then(() => {
  //           apiUtils.message.messages.setInfiniteData(input, (oldData) => {
  //             if (!oldData) {
  //               return {
  //                 pages: [
  //                   {
  //                     cursor: data.message.id,
  //                     messages: [
  //                       {
  //                         id: data.message.id,
  //                         conversationId: data.message.conversationId,
  //                         message: data.message.message,
  //                         sender: data.message.sender,
  //                         seenBy: data.message.seenBy,
  //                         createdAt: new Date(data.message.createdAt),
  //                         senderId: data.message.senderId,
  //                       },
  //                     ],
  //                   },
  //                 ],
  //                 pageParams: [],
  //               };
  //             }
  //             return {
  //               // pages: [...oldData.pages],
  //               // put it first
  //               pages: [
  //                 {
  //                   cursor: data.message.id,
  //                   messages: [
  //                     {
  //                       id: data.message.id,
  //                       conversationId: data.message.conversationId,
  //                       message: data.message.message,
  //                       sender: data.message.sender,
  //                       seenBy: data.message.seenBy,
  //                       createdAt: new Date(data.message.createdAt),
  //                       senderId: data.message.senderId,
  //                     },
  //                     // ...oldData.pages[0].messages,
  //                   ],
  //                 },
  //                 ...oldData.pages,
  //               ],
  //               pageParams: oldData.pageParams,
  //             };
  //           });
  //         })
  //         .catch(console.error);
  //     }
  //     return;
  //   },
  // });
  useChat({
    id: conversationId,
    onMessage: (data) => {
      if (data.type === "message") {
        apiUtils.message.messages
          .cancel()
          .then(() => {
            apiUtils.message.messages.setInfiniteData(input, (oldData) => {
              if (!oldData) {
                return {
                  pages: [
                    {
                      cursor: data.message.id,
                      messages: [
                        {
                          id: data.message.id,
                          conversationId: data.message.conversationId,
                          message: data.message.message,
                          sender: data.message.sender,
                          seenBy: data.message.seenBy,
                          createdAt: new Date(data.message.createdAt),
                          senderId: data.message.senderId,
                        },
                      ],
                    },
                  ],
                  pageParams: [],
                };
              }
              return {
                // pages: [...oldData.pages],
                // put it first
                pages: [
                  {
                    cursor: data.message.id,
                    messages: [
                      {
                        id: data.message.id,
                        conversationId: data.message.conversationId,
                        message: data.message.message,
                        sender: data.message.sender,
                        seenBy: data.message.seenBy,
                        createdAt: new Date(data.message.createdAt),
                        senderId: data.message.senderId,
                      },
                      // ...oldData.pages[0].messages,
                    ],
                  },
                  ...oldData.pages,
                ],
                pageParams: oldData.pageParams,
              };
            });
          })
          .catch(console.error);
      }
      return;
    },
  });
  // const typing = useMemo(() => {
  //   const typingArray = Array.from(conversation?.typing ?? []);
  //   return typingArray
  //     .filter((userId) => userId !== sessionData?.user?.id)
  //     .map(
  //       (userId) =>
  //         conversationData?.participants.find((p) => p.id === userId)?.name,
  //     );
  // }, [conversation?.typing, conversationData?.participants, sessionData]);
  // iniew
  const [ref, inView, entry] = useInView({
    threshold: 0.5,
  });
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage().catch(console.error);
    }
  }, [inView, fetchNextPage, hasNextPage]);
  return (
    <div className="flex space-x-4">
      <div className="flex w-96 flex-col">
        <h1>Chat</h1>

        <div className="flex h-96 flex-col-reverse space-y-2 overflow-y-auto">
          {messages?.pages.map((page) =>
            page.messages.map((message, i, arr) => {
              // we need to check if the message is read by a user, but only show it on the latest message. So there is going to be some weird logic here
              const seenBy = message.seenBy.filter((user) => {
                // check if the previous message is read by the user
                const prevMessage = arr[i - 1];
                if (!prevMessage) {
                  return true;
                }
                return !prevMessage.seenBy.some(
                  (prevUser) => prevUser.id === user.id,
                );
              });
              // check if the time between the current message and the next message is more than 1 minute
              let showTime = true;
              const nextMessage = arr[i + 1];
              if (nextMessage) {
                const timeDifference =
                  new Date(nextMessage.createdAt).getTime() -
                  new Date(message.createdAt).getTime();
                showTime = timeDifference > 60000; // 1 minute
              }
              // is last message in the conversation
              const isLastMessage = i === arr.length - 1;
              // if there is no next message, then we need to show the time
              return (
                <Message
                  seenBy={seenBy}
                  key={message.id}
                  message={message}
                  isSelf={message.sender.id === sessionData?.user?.id}
                  prevIsSameSender={arr[i + 1]?.sender.id === message.sender.id}
                  nextIsSameSender={arr[i - 1]?.sender.id === message.sender.id}
                  showTime={showTime}
                  ref={isLastMessage ? lastMessageRef : undefined}
                />
              );
            }),
          )}
          <div ref={ref}>
            {isFetchingNextPage && <Loader className="animate-spin" />}
          </div>
        </div>
        <div>
          {/* {Array.from(conversation?.typing ?? []).map((userId) => (
          <div key={userId}>{userId} is typing</div>
        ))} */}
          {/* {typing.length > 0 && (
            <div>
              {typing.join(", ")} {typing.length > 1 ? "are" : "is"} typing
            </div>
          )} */}
        </div>

        <div className="mt-4">
          <NewMessage conversationId={conversationId} />
        </div>
      </div>
      <div className="flex flex-col">
        <h2>Participants</h2>
        <ul className="flex flex-col space-y-2">
          {conversationData?.participants.map((participant) => {
            // const isInConversation = conversation?.activeParticipants.has(
            //   participant.id,
            // );
            return (
              <li
                key={participant.id}
                className={cn(
                  "flex items-center align-middle",
                  // !isInConversation && "opacity-50",
                )}
              >
                {participant.image ? (
                  <Image
                    src={participant.image}
                    alt={`${participant.name}'s profile picture`}
                    width={40}
                    height={40}
                    className="mr-2 rounded-full"
                  />
                ) : (
                  <UserIcon size={40} className="mr-2" />
                )}
                {participant.name}{" "}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
interface NewMessageProps {
  conversationId: string;
}
const NewMessage = ({ conversationId }: NewMessageProps) => {
  const [message, setMessage] = React.useState("");
  const debouncedMessage = useDebounce(message, 300);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { mutateAsync: sendMessage, status } =
    api.message.sendMessage.useMutation({
      onSuccess: () => {
        inputRef.current?.focus();
      },
    });
  // const { mutate: sendTyping } = api.message.sendTyping.useMutation();
  // React.useEffect(() => {
  //   sendTyping({
  //     conversationId,
  //     typing: message.length > 0,
  //   });
  // }, [debouncedMessage]);

  const sendMessageHandler = async (form: React.FormEvent) => {
    form.preventDefault();
    await sendMessage({ conversationId, message });
    setMessage("");
  };
  return (
    // <div className={cn("flex flex-col", status === "pending" && "opacity-50")}>
    <form
      className={cn("flex flex-col", status === "pending" && "opacity-50")}
      onSubmit={sendMessageHandler}
    >
      <Input
        disabled={status === "pending"}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        ref={inputRef}
      />
      <Button onClick={sendMessageHandler} disabled={status === "pending"}>
        Send
      </Button>
    </form>
  );
};
