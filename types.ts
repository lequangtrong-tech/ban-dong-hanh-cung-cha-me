
export enum Role {
  User = 'user',
  Model = 'model',
}

export interface MessagePart {
    text: string;
}

export interface Message {
  role: Role;
  parts: MessagePart[];
}
