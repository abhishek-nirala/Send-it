import { Message } from "@/model/User";

export interface ApiResponses{
    success : boolean;
    message : string;
    isAcceptingMessage ?: boolean;
    messages ?: Array<Message>
}