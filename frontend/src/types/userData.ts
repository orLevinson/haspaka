type userData = {
  user_id?: number;
  name?: string;
  username?: string;
  command_id?: number;
  command_name?: string;
  token?: string;
};

type userDataCtx = {
  saveUserData: (data: userData) => void;
  logout: () => void;
  userData: userData;
};

export type { userData, userDataCtx };
