// send-message.dto.ts
export class SendMessageDto {
  conversationId: string;
  content: string;
  senderType: 'admin' | 'client';
}