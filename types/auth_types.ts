export type UserObject = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  activationKey: string;
  isActivated: boolean;
  cvMarketingUserAccount?: string;
  cvMarketingUserPassword?: string;
  roleId: number;
  session: null;
  userAddress: string;
  activationDate: string;
  signUpDate: string;
  userReminderCount: number;
  trackingMode: number;
  currentResumePreviewId: number;
  disabled: boolean;
  userRole: string;
  activated: boolean;
};

export type LoginResponse = {
  token: string;
  user: UserObject;
};

export type SignupUserObject = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};
