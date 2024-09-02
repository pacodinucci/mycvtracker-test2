import { AlertsType } from "../types/alert_types";

export const alerts: AlertsType = {
  undefined: {
    type: "danger",
    message: "Uncontered an Error, please try again.",
  },
  401: {
    type: "danger",
    message: "Unauthorized Access!",
  },
  403: {
    type: "danger",
    message:
      "Authentication Failure. The username or password doesn’t match. Please retry or use the Forgot Password option to reset the password.",
  },
  409: {
    type: "danger",
    message: "User already exists!",
  },
  registrationSuccess: {
    type: "success",
    message:
      "An activation link has been sent to the registered E-mail ID. Please activate your account to continue with the Registration Process.",
  },
  activateSuccess: {
    type: "success",
    message: "Your account has been activated.",
  },
  forgotPasswordSuccess: {
    type: "success",
    message: "A password reset link has been sent to the registered E-mail ID.",
  },
  reactivateSuccess: {
    type: "success",
    message: "An activation link has been sent to the registered E-mail.",
  },
  resumeAddedSuccess: {
    type: "success",
    message: "Resume has been successfully added.",
  },
  resumePushedSuccess: {
    type: "success",
    message: "Resume has been successfully pushed to Drive.",
  },
  resumeEditSuccess: {
    type: "success",
    message: "This Resume has been successfully edited.",
  },
  resumeSaveNameDuplicatedError: {
    type: "danger",
    message: "This Resume Name and Resume Reference already exists!",
  },
  resumeSaveTitleDuplicatedError: {
    type: "danger",
    message: "This Resume Title is duplicated!",
  },
  resumeSaveTypeDuplicatedError: {
    type: "danger",
    message: "This Resume Type is duplicated!",
  },
  resumeTrackRequestSuccess: {
    type: "success",
    message: "Your request has been saved.",
  },
  resumePushToDriveError: {
    type: "danger",
    message: "Pushing resume to Drive has failed!",
  },
  favNotesSaveLimitError: {
    type: "",
    message: "You have exceeded the limit for number of Fav Notes.",
  },
  favNotesAlreadyExitsError: {
    type: "",
    message: "This Fav Note name already exists. Please choose a different name.",
  },
  CvMarketingRequestSuccess: {
    type: "success",
    message: "Your request has been received and we will contact you soon.",
  },
  deleteResumeuccess: {
    type: "success",
    message: "This Resume has been successfully deleted.",
  },
  deleteNotificationSuccess: {
    type: "success",
    message: "This Notification has been successfully deleted.",
  },
  deleteCampaignNotificationSuccess: {
    type: "success",
    message: "This Campaign Notification has been successfully deleted.",
  },
  deleteNotesSuccess: {
    type: "success",
    message: "Note has been successfully deleted.",
  },
  updateNoteSuccess: {
    type: "success",
    message: "Note has been updated successfully.",
  },
  sendTrackedApplicationSuccess: {
    type: "success",
    message: "This note has been added to tracking.",
  },
  sendUnTrackedApplicationSuccess: {
    type: "success",
    message: "This note has been removed from tracking.",
  },
  defaultError: {
    type: "danger",
    message: "Oops! Something went wrong.",
  },
  defaultWarning: {
    type: "warning",
    message: "This may hurt.",
  },
  defaultSuccess: {
    type: "success",
    message: "Operation performed successfully.",
  },
  notActivated: {
    type: "warning",
    message: "Your account has not been activated yet. Have you got an activation link?",
  },

  deleteModelTitle: {
    type: "",
    message: "Delete Resume",
  },

  sendTrackedApplicationModelTitle: {
    type: "",
    message: "Send Tracked Application",
  },

  deleteModelMessage: {
    type: "",
    message: "Are you sure you want to delete this Resume?",
  },

  sendTrackedApplicationlMessage: {
    type: "",
    message: "Are you sure you want to send Tracked Application?",
  },

  unsubscribeeModelTrackingTitle: {
    type: "",
    message: "You have succesfully unsubscribed to Tracking Mail.",
  },
  unsubscribeModelTrackingMessage: {
    type: "",
    message: "Are you sure you want to unsubscribe to Tracking Mail?",
  },

  unsubscribeeModelNotificationTitle: {
    type: "",
    message: "You have successfully unsubscribed to Notification Mail.",
  },
  unsubscribeModelNotificationMessage: {
    type: "",
    message: "Are you sure you want to unsubscribe to Notification Mail?",
  },

  downloadModelTitle: {
    type: "",
    message: "Download Resume",
  },
  downloadModelMessage: {
    type: "",
    message: "Are you sure you want to download this Resume?",
  },
  resumeDownloadSuccess: {
    type: "success",
    message: "Resume has been successfully downloaded.",
  },
  resumeSaveLimitError: {
    type: "",
    message: "You have reached your resume limit.",
  },
  resumeSaveLeastError: {
    type: "",
    message: "You have at least one resume.",
  },
  notificationDeleteLeastError: {
    type: "",
    message: "You have at least one note to delete.",
  },

  InputFileInputTypeValidation: {
    type: "",
    message: "Please upload a PDF, Doc, Docx file only.",
  },
  InputFileInputSizeValidation: {
    type: "",
    message: "Please select a file that is less than 500KB.",
  },
  InputFileInputRequiredValidation: {
    type: "",
    message: "Please select the resume file!",
  },
  PaymentSuccessfullyExecuted: {
    type: "success",
    message: "The payment executed successfully.",
  },
  userTickException: {
    type: "warning",
    message: "You have exceeded your ticks.",
  },
  resetPasswordSuccess: {
    type: "success",
    message: "Your password has been successfully changed.",
  },
  confirmPasswordErorr: {
    type: "warning",
    message: "Please make sure your passwords match.",
  },
  profileSaveSucess: {
    type: "success",
    message: "These settings have been saved.",
  },

  unsubscribeSucess: {
    type: "success",
    message: "The unsubscribe proccess has been successfully completed.",
  },
  jobContentSaveSucess: {
    type: "success",
    message: "This job content has been successfully updated.",
  },
  jobActivateSaveSucess: {
    type: "success",
    message: "This job has been successfully activated.",
  },
  applyJobTitle: {
    type: "",
    message: "Apply Job",
  },
  applyJobMessage: {
    type: "",
    message: "Are you sure you want to apply to this job?",
  },
  applyJobSucsessMessage: {
    type: "success",
    message: "Your job application has been sent successfully.",
  },
  editJobTitle: {
    type: "",
    message: "Edit Job",
  },
  editJobMessage: {
    type: "",
    message: "Are you sure you want to edit to this job?",
  },
  approveJobTitle: {
    type: "",
    message: "Approve Job",
  },
  approveJobMessage: {
    type: "",
    message: "Are you sure you want to approve this job?",
  },
  approveJobSuccessMessage: {
    type: "success",
    message: "This job has been successfully approved.",
  },
  rejectJobTitle: {
    type: "",
    message: "Reject Job",
  },
  rejectJobMessage: {
    type: "",
    message: "Are you sure you want to reject this job?",
  },
  rejectJobSuccessMessage: {
    type: "success",
    message: "You have sucessfully rejected this job.",
  },
  //   newReferralLinkSuccessMsg: "New referral link has been generated",
  //   editReferralLinkSuccessMsg: "The referral link has been updated successfully",
  //   referralLinkCopySuccessMsg: "Copied",
  //   deleteReferralLinkSuccessMsg: "Referral link has been deleted successfully.",
  //   extendResumeSuccessMessage: "Resume preview has been extended successfully.",
  //   extendResumeSuccessFail: "Extending resume has failed!",
};
