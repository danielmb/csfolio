import { RedisStream } from "@/lib/stream";
import { Redis } from "@upstash/redis";
interface ChatMessage {
  type: "message";
  id: string;
}
interface ChatTyping {
  type: "typing";
  userId: string;
}
type ChatEvents = ChatMessage | ChatTyping;

export class ChatServerPublisher {
  private redis: Redis;
  private channel: string;
  constructor(channel: string) {
    this.redis = Redis.fromEnv();
    this.channel = channel;
  }

  public async sendMessage(messageId: string) {
    const message: ChatMessage = {
      type: "message",
      id: messageId,
    };
    await this.redis.publish(this.channel, JSON.stringify(message));
  }
}

export class ChatServerSubscriber {
  readonly stream: RedisStream;
  private channel: string;
  constructor(channel: string) {
    this.stream = new RedisStream();
    this.channel = channel;
  }

  public async subscribe() {
    return new Promise<void>((resolve, reject) => {
      this.stream.redis
        .subscribe(this.channel, (err, count) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public onMessage(callback: (message: ChatMessage) => void) {
    this.stream.redis.on("message", (channel, message) => {
      if (channel === this.channel) {
        const event = JSON.parse(message) as ChatEvents;
        if (event.type === "message") {
          callback(event);
        }
      }
    });
  }
}
