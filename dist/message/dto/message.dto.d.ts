export declare class CreateMessageDto {
    content: string;
    group: string;
    attachments?: string[];
    type?: 'text' | 'image' | 'document' | 'video' | 'audio';
}
