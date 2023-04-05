export const BASE_SERVICE = "service/";
export const BACK_URI = process.env.VUE_APP_URI;
export const URI = process.env.VUE_APP_URI + BASE_SERVICE;
//export const RECAPTCHA_SITE_KEY = process.env.VUE_APP_RECAPTCHA_SITE_KEY;

export const SERVICE_NAMES = {
    ADMINISTRATIVE_SECTOR: "administrative-sectors",
    AUDIOVISUAL_MEDIA: 'audiovisual-media',
    RURAL_IMAGES: 'audiovisuals',
    ABOUT: "about",
    ARCGIS: "arcgis",
    BANNER: "banner",
    COMMENTS: "comments",
    CONTACT: "contacts",
    CONTACT_TYPE: "contact-types",
    CONTEST: "contests",
    DOCUMENTS: "documents",
    DOMAINS: 'domains',
    EVENT: "event",
    EMAIL_DOMAIN: "email-domain",
    FAQ: "faq",
    FAQS: "faqs",
    GEOGRAPHY: "geographies",
    HELP: "help",
    INSTITUTION: "institutions",
    INSTITUTION_TYPE: "institution-types",
    LAYER: 'layers',
    LINK: 'link',
    LOGIN: 'login',
    LOGOUT: 'logout',
    LOGOS: 'logos',
    LOGOS_LINKS_COLORS: 'logo-link-color',
    MENU: 'menu',
    NEWS: 'news',
    NORMS: 'norms',
    NORMS_TYPES: 'norms/admin/norm-types',
    NORMS_ACTIVE: 'norms/active',
    NOTIFICATION: "notifications",
    NOTIFICATION_STATE: "notifications-state",
    NOTIFICATION_ACTION: "notifications-action",
    NOTIFICATION_PROCESS: "notifications-process",
    OFFICE: 'offices',
    PAGE: 'pages',
    PERMISSION: 'permissions',
    POLICY_TOOL: 'policy-tool',
    PROCEDURE: 'procedure',
    PROJECT: 'projects',
    PROJECTS: 'proyects',
    PROYECT_TOOL: 'proyect-tool',
    PROTOTYPE: 'prototypes',
    REPORT: 'reports',
    REQUEST: 'request',
    RESPONSE_CHANNEL: 'response-channel',
    RULE: 'rules',
    RURAL_MODEL: 'rural-model',
    RURAL_DOCUMENTS: "rural-documents",
    RURAL_HOUSING: "rural-housing",
    RURAL_INDICATORS: "rural-indicators",
    SIPSDER_NOTE: 'sipsder-notes',
    SMTP_SERVER: 'smtp-server',
    SCORE: 'scores',
    STORY: 'stories',
    SIPSDER: 'sipsder',
    SOCIAL_NETWORK: 'social-networks',
    SURVEY: 'survey',
    USER_ADMIN: "users-admin",
    USER_PROFILE: "users-profile",
    USER_REGISTRATION: "users-registration",
    USER_RECOVER: 'users-recover',
    USER_DOMAINS: 'domains',
    NORM_TYPE: 'norm-type',
    USER_TYPE: "user-types",
    UPLOAD: 'upload',
    TEMPLATE: 'template',
    TEMPLATE_IMAGE: 'template/image',
    SYSTEM_CONFIG: 'system-config',
    METASEARCH_ENGINE: 'metasearch',
    METASEARCH_PATH: 'metasearch-engine'
};

export const USER_DOMAINS = {
    USER_SEX: "user-sex",
    USER_TYPE: "user-type",
    USER_ETHNIC: "user-ethnicity",
    USER_TELEPHONE_TYPE: "telephone-type",
    ACADEMIC_LEVEL: "academic-level",
    USER_GENDER: "user-gender",
    DISABILITY: "disability",
    MOVE: "move-amount"
};

export const USER_DOMAINS_VAPI = {
    USER_SEX: "userSex",
    USER_TYPE: "userType",
    USER_ETHNIC: "userEthnic",
    USER_TELEPHONE_TYPE: "userPhoneType",
    ACADEMIC_LEVEL: "academicLevel",
    USER_GENDER: "userGender",
    DISABILITY: "userDisability",
    MOVE: "userMoves"
};

export const DOMAINS = {
    RURAL_DOCUMENT_AUTHOR: "rural-doc-author",
    RURAL_DOCUMENT_EDITOR: "rural-doc-editor",
    RURAL_DOCUMENT_SUBTYPES: "rural-doc-subtype",
    RURAL_DOCUMENT_STATES: "rural-doc-state",
    RURAL_DOCUMENT_TYPE: "rural-doc-type",
    ATTACHMENT_STATE: "attachment-state",
}

export const PAGES_TYPE = {
    ADMIN: "admin",
    USER: "user"
};

export const NOTIFICATION_STATES = {
    INFORMATIVE: 1,
    OPEN: 2,
    ACCEPTED: 3,
    REJECT: 4,
    PROCESS: 5,
}

export const REPORT_CONTENT_TYPES = {
    NEWS: 0,
    COMMENTS: 1,
    FAQS: 2,
    EVENTS: 3,
    SURVEY: 4,
    DOCUMENTS: 5,
    PROCEDURES: 6,
    PROTOTYPE: 7,
    CONTESTS: 8,
    ATTACHMENT: 9,
    STORIES: 10,
    CONCEPTS: 11,
    PROJECTS: 12
};

export const SCORE_CONTENT_TYPE = {
    COMMENTS: 0,
    FAQS: 1,
    NEWS: 2,
    EVENTS: 3,
    SURVEY: 4,
    DOCUMENTS: 5,
    PROCEDURES: 6,
    PROTOTYPE: 7,
    CONTESTS: 8,
    ATTACHMENT: 9,
    STORIES: 10,
    CONCEPTS: 11,
    PROJECTS: 12
};

export const HTTP_STATUS = {
    OK: 200,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
}

export const SCORE_REPORT_ANSWER = {
    SAVED: 0, // ID : 0
    UPDATED: 1, // ID : 1
    NO_CHANGE: 2, // ID : 2
}

export const DOCUMENT = {
    MAX_SIZE: 10000000
}

export const METASEARCH = {
    MIN_LENGTH: 3,
    SURVEY_PREFIX: "/community/surveys/survey/",
}

export const ICON = {
    MAX_SIZE: 50000
}

export const COMMUNITY_CAROUSEL = {
    RURAL_HISTORY: "CommunityStory",
    RURAL_IMAGES: "CommunityImages",
    RURAL_SURVEY: "CommunitySurvey",
    RURAL_DOCUMENTS: "CommunityLibrary",
}

export const INSTITUTION_IDS= {
    SDP: 1,
}

export const TEMPLATES_FILES = {
    WELCOME: "welcome",
    EVENT: "event",
    CHANGE_MAIL: "change",
    RECOVER_ACCOUNT_MAIL: "forgot",
    INDICATOR: "indicator"
}

export const TEMPLATES = {
    MANDATORY_SYMBOL: "<span style='color:red'>*</span>"
}

