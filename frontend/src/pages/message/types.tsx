

  export type Message = {
    content: string;
    conversation: number;
    id: number;
    read: boolean;
    receiver: EccomerceUserWithoutCars;
    sender: EccomerceUserWithoutCars;
    timestamp: string;
  }
  


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

