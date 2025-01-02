
export type UserProps = {
    name: string;
    username: string;
    avatar: string;
    online: boolean;
  };
  
  export type MessageProps = {
    id: string;
    content: string;
    timestamp: string;
    unread?: boolean;
    sender: UserProps | 'You';
    attachment?: {
      fileName: string;
      type: string;
      size: string;
    };
  };

  export type Message = {
    content: string;
    conversation: number;
    id: number;
    read: boolean;
    receiver: EccomerceUserWithoutCars;
    sender: EccomerceUserWithoutCars;
    timestamp: string;
  }
  
  export type ChatProps = {
    id: string;
    sender: UserProps;
    messages: MessageProps[];
  };

  export type EccomerceUserWithoutCars = {
    email: string;
    first_name: string;
    last_name: string;
  }

  export type Conversation = {
    id: number;
    car: number;
    seller: EccomerceUserWithoutCars;
    buyer: EccomerceUserWithoutCars;
    most_recent_message: Message;
  }