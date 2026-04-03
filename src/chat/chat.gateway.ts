// chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ConversationsService } from "./conversations.service";
import { Message as MessageEntity } from "generated/prisma/client";

type SenderType = "admin" | "client";

interface SendMessageDto {
  conversationId: string;
  content: string;
  senderType: SenderType;
}

interface TypingDto {
  conversationId: string;
  senderType: SenderType;
}

@WebSocketGateway({
  cors: { origin: "*" },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private conversationsService: ConversationsService) {}

  /* ================= JOIN ================= */
  @SubscribeMessage("joinConversation")
  handleJoin(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(conversationId);
  }

  /* ================= SEND MESSAGE ================= */
  @SubscribeMessage("sendMessage")
  async handleMessage(
    @MessageBody() data: SendMessageDto,
  ): Promise<MessageEntity | void> {
    const { conversationId, content, senderType } = data;

    // 🔒 check conversation ouverte
    const convo = await this.conversationsService.getConversation(conversationId);
    if (!convo || !convo.isOpen) return;

    const message = await this.conversationsService.addMessage(
      conversationId,
      content,
      senderType,
    );

    this.server.to(conversationId).emit("newMessage", message);

    // 🧹 stop typing après envoi
    this.server.to(conversationId).emit("typingStop", { senderType });

    return message;
  }

  /* ================= TYPING START ================= */
  @SubscribeMessage("typingStart")
  async handleTypingStart(@MessageBody() data: TypingDto) {
    const { conversationId, senderType } = data;

    const convo = await this.conversationsService.getConversation(conversationId);
    if (!convo || !convo.isOpen) return;

    this.server.to(conversationId).emit("typingStart", { senderType });
  }

  /* ================= TYPING STOP ================= */
  @SubscribeMessage("typingStop")
  handleTypingStop(@MessageBody() data: TypingDto) {
    const { conversationId, senderType } = data;

    this.server.to(conversationId).emit("typingStop", { senderType });
  }

  /* ================= CLOSE ================= */
  @SubscribeMessage("closeConversation")
  async handleClose(@MessageBody() conversationId: string) {
    const convo = await this.conversationsService.closeConversation(conversationId);

    this.server.to(conversationId).emit("conversationClosed", convo);

    return convo;
  }
}

// // chat.gateway.ts
// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from "@nestjs/websockets";
// import { Server, Socket } from "socket.io";
// import { ConversationsService } from "./conversations.service";
// import { Message as MessageEntity } from "generated/prisma/client";

// type SenderType = "admin" | "client";

// interface SendMessageDto {
//   conversationId: string;
//   content: string;
//   senderType: SenderType;
// }

// interface TypingDto {
//   conversationId: string;
//   senderType: SenderType;
// }

// @WebSocketGateway({
//   cors: { origin: "*" },
// })
// export class ChatGateway {
//   @WebSocketServer()
//   server: Server;

//   constructor(private conversationsService: ConversationsService) {}

//   // Rejoindre une conversation
//   @SubscribeMessage("joinConversation")
//   handleJoin(
//     @MessageBody() conversationId: string,
//     @ConnectedSocket() client: Socket,
//   ) {
//     client.join(conversationId);
//   }

//   // Envoyer un message
//   @SubscribeMessage("sendMessage")
//   async handleMessage(@MessageBody() data: SendMessageDto): Promise<MessageEntity> {
//     const { conversationId, content, senderType } = data;

//     // 💾 sauvegarde DB
//     const message = await this.conversationsService.addMessage(
//       conversationId,
//       content,
//       senderType,
//     );

//     // ⚡ broadcast temps réel
//     this.server.to(conversationId).emit("newMessage", message);

//     return message;
//   }

//   // Typing en cours
//   @SubscribeMessage("typing")
//   handleTyping(@MessageBody() data: TypingDto) {
//     const { conversationId, senderType } = data;
//     this.server.to(conversationId).emit("typing", { senderType });
//   }

//   // Clôturer une conversation (socket)
//   @SubscribeMessage("closeConversation")
//   async handleClose(@MessageBody() conversationId: string) {
//     const convo = await this.conversationsService.closeConversation(conversationId);
//     this.server.to(conversationId).emit("conversationClosed", convo);
//     return convo;
//   }
// }