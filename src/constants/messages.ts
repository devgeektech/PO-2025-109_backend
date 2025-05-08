export const MESSAGES = {
    USER_ERRORS: {
        USER_EXISTS: "User already exists.",
        INVALID_LOGIN: "Invalid login details",
        USER_NOT_EXIST: "The user cannot be found.",
        INVALID_CURRENT_PASSWORD: "Invalid current password",
        LINK_EXPIRED: "Invalid link or link is expired",
        INVALID_PASSWORD: "The password you entered is incorrect.",
        NOT_ACTIVE: "Your account is not active",
        INVALID_DESIGNATION: "User Can not be designated as admin",
        PASSWORD_UPDATED: "Your password has been updated successfully",
        USER_ACCOUNT_NOT_VERIFIED: "The user account not verified"
    },
    PROPERTY_ERRORS: {
      PROPERTY_EXISTS: "Property already exists.",
      PROPERTY_NOT_EXIST: "The property cannot be found."
    },
    NEWS_ERRORS: {
      NEWS_NOT_EXIST: "The news cannot be found."
    },
    NOTIFICATION_ERRORS: {
      NOTIFICATION_EXISTS: "Notification already exists.",
      NOTIFICATION_NOT_EXIST: "The Notification cannot be found."
    },
    CONTACT_ERRORS: {
      CONTACT_EXISTS: "Contact already exists.",
      CONTACT_NOT_EXIST: "The contact cannot be found."
    },
    SITE_ERRORS: {
      SITE_NOT_EXIST: "The site cannot be found.",
      TEAM_MEMBER_EXIST:"Team member already exist",
      TEAM_MEMBER_NOT_EXIST:"Team member not exist"
    },
    INQUIRY_ERRORS: {
      INQUIRY_EXISTS: "Inquiry already exists.",
      INQUIRY_NOT_EXIST: "The Inquiry cannot be found."
    },
    LINK_ERRORS: {
        LINK_REQUIRED: "Please enter link",
        INVALID_LINK: "The provided link is not valid.",
        LINK_VERIFIED: "Link verified successfully",
        LINK_EXPIRED: "Link Expired"
    },
    CATEGORY_ERRORS: {
        CATEGORY_EXISTS: "Category already exists.",
        CATEGORY_NOT_EXIST: "Category does not exist"
    },
    GENRE_ERRORS: {
        GENRE_EXISTS: "Genres already exists.",
        GENRE_NOT_EXIST: "Genres does not exist"
    },
    AUDIO_BOOK_ERRORS: {
        AUDIO_BOOK_EXISTS: "Audio book already exists.",
        AUDIO_BOOK_NOT_EXIST: "Audio book does not exist"
    },
    OTP_ERRORS: {
        OTP_REQUIRED: "Please enter otp",
        INVALID_OTP: "Invalid otp entered",
        OTP_VERIFIED: "OTP verified successfully",
        OTP_EXPIRED: "OTP Expired"
    },
    ROLE_ERRORS: {
        ROLE_EXISTS: "Role already exists.",
        ROLE_NOT_EXIST: "Role does not exist"
    },
    COLOUR_ERRORS: {
        COLOUR_EXISTS: "Colour already exists.",
        COLOUR_NOT_EXIST: "Colour does not exist",
        FILE_REQUIRED: "Please select file to upload.",
        INVALID_XLSX_COLUMN: "Xlsx file should only contain 'name', 'code', 'hexCode' column."
    },
    UNKNOWN_ERROR: "Something went wrong",
    NO_RECORD_FOUND: "No record found",
    INAVLID_REQUEST: "Invalid request",
    DO_NOT_HAVE_PERMISSION: "You don't have permission",
    MISSING_REQUIRED_FIELDS: "Missing required fields",
    INVALID_TOKEN: "Invalid Token",
    INVALID_ID: "Invalid Id",
    INVALID_INFORMATION: "Provide valid Information",
    INVALID_AUTH_PROVIDER:"Invalid Auth Provider",
    PHONE_NUMBER_REQUIRED_LOGIN:"Phone Number Required",
    INVALID_PHONE_NUMBER_FORMAT:"Invalid phone number format",
    FULL_NAME_REQUIRED:"Fullname required",
    PROFILE_PICTURE_REQUIRED:"Profile picture required",
    PROFILE_PICTURE_SIZE_LIMIT:"Profile picture size limit exceeded.",
    FIREBASE_TOKEN_EXPIRED:"Firebase token expired",
    USERS_FETCHED_SUCCESSFULLY:"Users fetched successfully",
    AUTH_PROVIDER_REQUIRED:"Auth provider is required",
    EMAIL_PASSWORD_REQUIRED:"Email password required",
    PHONE_NUMBER_REQUIRED:"Phone number required",
    USER_ALREADY_EXISTS:"User already exists",
    USER_NOT_VERIFIED:"User not authenticated",
    EMAIL_OR_PHONE_REQUIRED:"Email or phone required",
    ACCOUNT_DELETED_SUCCESSFULLY:"Account deleted successfully",
    INVALID_NOTIFICATIONS_ENABLED:"Invalid notification enabled",
    NOTIFICATION_SETTINGS_UPDATED:"Notification settings updated",
    PROFILE_UPDATED_SUCCESSFULLY:"Profile updated successfully",
    SENDER_AND_RECEIVER_CANT_BE_SAME:"Sender and receiver cannot be the same.",
    INVALID_CREDENTIALS: {
        error: "Invalid Credentials",
        details: "The email or password provided is incorrect.",
      },
      LOGIN_SUCCESSFUL: {
        message: "Login successful",
        details: "Welcome back! You have successfully logged in.",
      },
      INTERNAL_SERVER_ERROR: {
        error: "Internal server error",
        details: "An unexpected error occurred. Please try again later.",
      },
      NAME_REQUIRED_MESSAGE: "Name is required.",
      NAME_REQUIRED_LENGTH: {
        error: "Name Required",
        details: "Name must be at least 2 characters long",
      },
      EMAIL_REQUIRED_MESSAGE: "Email is required.",
      INVALID_EMAIL: {
        error: "Email Required",
        details: "The email field cannot be empty. Please provide a valid email address.",
      },
      PASSWORD_REQUIRED: "Password is required",
      PASSWORD_REQUIRED_LENGTH: {
        error: "Password Required.",
        details: "Please provide a password and it must be at least 6 characters long",
      },
      PASSWORD_DOESNT_MATCH: {
        error: "Validation Error",
        details: "Passwords do not match.",
      },
      EMAIL_ALREADY_EXIST: {
        error: "Email already registered",
        details: "The provided email is already in use.",
      },
      USER_CANNOT_BE_FOUND: {
        error: "User cannot be found",
        details: "No account is associated with the provided email address.",
      },
      REGISTRATION_SUCCESSFUL: {
        message: "Registration completed successfully",
        details: "Your account has been created and you can now log in.",
      },
      MAIL_SENT: {
        message: "Email sent successfully",
        details: "A link has been sent to your email. Please check your inbox to continue.",
      },
      INVALID_LINK: {
        error: "Invalid link",
        details: "The link you provided is not valid or may have expired. Please request a new one.",
      },
      LINK_VERIFIED: {
        message: "Link verified successfully",
        details: "The link has been verified, and you can proceed with the next steps.",
      },
      INVALID_PHONE_NUMBER: {
        error: "Validation error",
        details: "Invalid phone number. It must be a 10-digit number.",
      },
      MISSING_PHONE_NUMBER: {
        error: "Validation error",
        details: "The 'phoneNumber' field is required and cannot be empty.",
      },
      OTP_SENT: {
        message: "OTP sent successfully",
        details: "An OTP has been sent to the provided phone number",
      },
      OTP_VERIFICATION_FAILED: {
        error: "OTP verification failed",
        details: "No user found with this phone number.",
      },
      INVALID_OTP: {
        error: "OTP verification failed",
        details: "The provided OTP is incorrect.",
      },
      EXPIRED_OTP: {
        error: "OTP verification failed",
        details: "The OTP has expired. Please request a new OTP.",
      },
      MISSING_OTP: {
        error: "OTP is missing",
        details: "The OTP was not provided. Please enter the OTP to proceed."
      },
      GUEST_LOGIN_SUCCESS: {
        message: "Guest user logged in successfully",
        details: "You have logged in as a guest."
      },
      INVALID_CATEGORY_NAME: {
        error: "Invalid category name",
        details: "Category name is required and must be a valid string."
      },
      INVALID_DIFFICULTY_LEVEL: {
        error: "Invalid difficulty level",
        details: "The provided difficulty level is not valid. Please select a valid option."
      },
      DUPLICATE_CATEGORY_NAME: {
        error: "Category already exists",
        details: "A category with this name already exists. Please choose a different name."
      },
      CATEGORY_CREATED_SUCCESSFULLY: {
        message: "Category created successfully",
        details: "The category has been created and is now available for use."
      },
      NO_CATEGORIES_FOUND: {
        error: "No categories found",
        details: "There are currently no categories available. Please add some categories to proceed."
      },
      CATEGORY_UPDATED_SUCCESSFULLY: {
        message: "Category updated successfully",
        details: "The category has been successfully updated and changes are now applied."
      },
      CATEGORY_NOT_FOUND_OR_DELETED: {
        error: "Category not found or already deleted",
        details: "The requested category could not be found or has already been removed. Please check and try again."
      },
      CATEGORY_DELETED_SUCCESSFULLY: {
        message: "Category deleted successfully",
        details: "The category has been successfully removed."
      },
      TOKEN_REQUIRED: {
        error: "Token required",
        details: "A valid token is required to proceed. Please provide a token."
      },
      INVALID_TOKEN_ERROR: {
        error: "Invalid token",
        details: "The provided token is invalid or has expired. Please log in again to obtain a new token."
      },
      SESSION_EXPIRED: {
        message: "Session expired",
        details: "Your session has expired. Please log in again to continue."
      },
      INVALID_INPUT: {
        error: "Invalid input",
        details: "The provided input is invalid. Please check the data and try again."
      },
      ADMIN_ACCESS_REQUIRED: {
        error: "Admin access required",
        details: "You need admin privileges to perform this action. Please contact an administrator."
      },
      IMAGE_UPLOAD_FAILED: {
        error: "Image upload failed",
        details: "There was an issue uploading the image. Please try again later."
      },
      SETTINGS_FETCHED_SUCCESSFULLY: {
        message: "Settings fetched successfully",
        details: "The application settings have been retrieved successfully."
      },
      SETTINGS_UPDATED_SUCCESSFULLY: {
        message: "Settings updated successfully",
        details: "The application settings have been updated successfully."
      },
      USER_STATUS_UPDATED:{
        deactivated:"The user status has been updated",
        activated:"The user status has been updated"
      },
      REJECTED_OR_ACCEPTED:"Invalid status. Must be either 'accepted' or 'rejected'",
      REJECTED:"Chat room rejected. Please try again later.",
      CHATUPDATED:"Chat room status updated to"
}
