export interface IUser {
  email: string;
  password: string;
  confirmPassword: string;
  name: {
    type: string;
    required: false;
  };
  color: {
    type: string;
    required: false;
  };
  height: {
    type: number;
    required: false;
  };
  age: {
    type: number;
    required: false;
  };
  photoURL: {
    type: string;
    required: false;
  };
  createdAt: string;
}

// const user: IUser = {
//   email: string,

// };
