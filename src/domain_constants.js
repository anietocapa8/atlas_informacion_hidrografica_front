export const LOGO_TYPE = {
    SOCIAL_NETWORK : 1,
    HEADER_SIPSDER : 2,
    FOOTER_MAYOR : 3,
    OTHER : 4,
    HEADER_SDP : 5,
    FOOTER_COUNTRY : 6
};

export const LOGO_TYPE_KEYS = {
    SIPSDER : "sipsder",
    MAYOR : "mayor",
    SDP : "sdp",
    COUNTRY : "country"
};

export const EVENT_STATE = {
    PENDING: 1,
    REJECTED: 4,
    PUBLISH: 2,
    PUBLISH_DISABLED: 3
}

export const EVENT_STATE_LABEL = {
    PENDING: "PENDIENTE",
    REJECTED: "RECHAZADO",
    PUBLISH: "PUBLICADO",
    PUBLISH_DISABLED: "PUBLICADO-DESHABILITADO"
}

export const GEOGRAPHY_TYPE = {
    PAIS : 1,
    DEPARTAMENTO: 2,
    MUNICIPIO: 3,
    UPZ: 4,
    LOCALIDAD: 5,
    BARRIO: 6,
    VEREDA: 6,
};

export const GEOGRAPHY_SPECIAL = {
    COLOMBIA: 1,
    BOGOTA: 2,
    BOGOTA_MUN: 10,
};

export const SOCIAL_NETWORKS_IDS = {
    FACEBOOK: 1,
    INSTAGRAM: 2,
    FLICKR: 3,
    TWITTER: 4,
    OTHER: 5
};

export const PERMISSIONS_TYPES = {
    CONSULT: 1,
    ADMIN: 2,
    PARTICIPATE: 3,
    CONTROL: 4,
    DOWNLOAD: 5,
};

export const ROLES = {
    PUBLIC: 1,
    CITIZEN: 2
};

export const PERMISSIONS_LEVELS = {
    CONSULT: 1,
    ADMIN: 3,
    PARTICIPATE: 2,
    CONTROL: 3,
    DOWNLOAD: 2,
};

export const MENU_ORDER = {
    ALPHABETIC: 1,
    PRIORITY: 2
}

export const MENUS = {
    ROOT: 1
}

export const RURALMODEL = {
    DEVELOPMENT_DIMENSIONS: 91,
    ENVIRONMENTAL: 92,
    SOCIAL: 132,
    ECONOMIC: 158,
    URBAN: 199,
    INSTITUTIONAL: 226,
    EDER: 254,
    TECNICAL_ALIGNMENTS: 257,
    STRATEGIC_COMPONENT: 264,
    MANAGEMENT_INSTRUMENT: 270,
    TRANSFORMATION: 297,
    COOPERATION: 298,
    COHESION: 299,
    SIPSDER: 300,
    POT: 271,
    STRUCTURE: 1,
    HOUSING: 142, // previously 75
    // RECOGNITION: 49, // mapped to TRANSFORMATION
    // ORDERING: 50, // mapped to COOPERATION
    // SUPPORT: 51, // mapped to COHESION
    // FUNCTIONAL: 29, // doesn't exists in db
    // POLITICS: 69, // doesn't exists in db
};

export const RURAL_MODEL_TYPES = {
    CATEGORY: 1,
    STRUCTURE: 2,
    TOOL: 3,
    INSTRUMENT: 4,
    SIPSDER: 5,
    COMPONENT: 6,
    SUBCOMPONENT: 7,
};

export const RURAL_INDICATOR_TYPES = {
    FIGURE: 1,
    INDEX: 2,
    INDICATOR: 3,
    BULLETIN: 4
};

export const RURAL_INDICATOR_STATUS = {
    EDITING: 1,
    PUBLISHED: 2
};

export const RURAL_INDICATOR_STATUS_LABEL = {
    EDITING: "En edición",
    PUBLISHED: "Publicado",
    ENABLED: "Habilitado",
    DISABLED: "Inhabilitado"
};

export const USER_SEX = {
    FEMALE: 1,
    MALE: 2,
    INTERSEX: 3
};

export const SURVEY_STATUS = {
    EDITING: 1,
    PUBLISHING_PROCESS: 2,
    PUBLISHED: 3,
    CLOSED: 4
};

export const SURVEY_STATUS_LABEL = {
    ENABLED: "HABILITADA",
    DISABLED: "DESHABILITADA",
    EDITING: "EN EDICIÓN",
    PUBLISH: "PUBLICADA",
    ACTIVE: "ACTIVO",
    PUBLISHING_PROCESS: "EN PROCESO DE PUBLICACIÓN",
    CLOSED: "CERRADA",
};

export const SURVEY_STATE_LABEL = {
    EDITING: "EN EDICIÓN",
    CLOSED: "CERRADO",
    PUBLISHED_ENABLED: "PUBLICADA-HABILITADA",
    PUBLISHED_DISABLED: "PUBLICADA-DESHABILITADA",
    NOT_PUBLISHED_YET: "EN PROCESO DE PUBLICACIÓN"
};

export const SURVEY_AUDIENCE = {
    ALL: 1,
    AUTHENTICADED: 2,
    SPECIFIC: 3,
    WITH_PASSWORD: 4
};

export const TARGET_AUDIENCE = {
    EVERYONE: 1,
    AUTHENTICATED: 2,
    SPECIFIC: 3,
    PROTECTED: 4
};

export const SURVEY_RESULT_VISIBILITY = {
    AUTHORIZED: 1,
    AUTHENTICATED: 2,
    UNAUTHENTICATED: 3,
    ADMINISTRATOR: 4
};

export const SURVEY_FORM_MODE = {
    PREVIEW: "preview"
};

export const SURVEY_QUESTION_TYPE = {
    MULTIPLE_CHOICE_SINGLE: 1,
    MULTIPLE_CHOICE_MULTIPLE: 2,
    DROPDOWN_LIST: 3,
    SHORT_TEXT: 4,
    LONG_TEXT: 5,
    DATE: 6,
    SCALE: 7,
    MATRIX_SINGLE: 8,
    MATRIX_MULTIPLE: 9,
    CONTROL: 10,
    CONTROL_END: 11
};

export const USER_TYPE = {
    URBAN: 1,
    RURAL: 2,
}

export const DOCUMENT_TYPES = {
    E_MAGAZINE: 1,
    PRINTED_MAGAZINE: 2,
    BULLETIN: 3,
    PRINTED_CHAPTER_BOOK: 4,
    PRIMER: 5,
    GUIDEBOOK: 6,
    REPORT: 7,
    E_BOOK: 8,
    PRINTED_BOOK: 9,
    PRINTED_AUTHOR_BOOK: 10,
    PRINTED_EDITOR_BOOK: 11,
    MAGAZINE: 12,
    THESIS: 13,
    RURAL_INDICATOR_BULLETIN: 15
}

export const DOCUMENT_STATES = {
    PUBLISH: 1,
    REJECTED: 2,
    AWAITED: 3,
};

export const USER_TYPES = {
    INSTITUTION_GOVERNMENTAL: 3,
    INSTITUTION_ACADEMIC: 4,
    INSTITUTION_ENTERPRISE: 5,
    INSTITUTION_SDP: 6,
}

export const INSTITUTION_TYPE = {
    NATIONAL: 1,
    DISTRITAL: 2,
    DIST_DESCENTRALIZED: 3,
    DIST_GOVERNMENT: 4,
    DIST_CENTRAL: 5,
};

export const INSTITUTION = {
    SDP: 1,
};

export const FUNDING_SOURCE_TYPE = {
    PERMANENTS: 1,
    INTERNATIONAL: 2
}

export const CONTACT_TYPE = {
    PHONE: 1,
    FAX: 2,
    EMAIL_ADDRESS: 3,
    WEBSITE: 4,
    WHATSAPP: 5,
};

export const MODULES ={
    PROCEDURE: 'Trámites',
    AUDIO_VISUAL: 'Medios Audiovisuales',
    RURAL_LIBRARY: 'Biblioteca Rural',
    RURAL_HOUSING: 'Vivienda Rural',
    RURAL_IMAGES: "Ruralidad en Imágenes",
    PROYECT_TOOL: "Herramienta Proyecto",
    RURAL_INDICATORS: "Ruralidad en Cifras"
};

export const ATTACHMENT_STATES = {
    AWAITED: 1,
    PUBLISH: 2,
    REJECTED: 3,
};

export const ATTACHMENT_TYPE = {
    LOGO: 1,
    PUBLIC_IMAGE: 2,
    VIDEO: 3,
    DOCUMENT: 4,
    CONTACT: 5,
    BANNER: 6,
    ICON: 7,
    USER_IMAGE: 8,
    TECNIC_IMAGE: 9,
};

export const ATTACHMENT_STATUS = {

    AWAIT :1,
    PUBLISH : 2,
    REJECT : 3
}

export const STORY_STATES = {
    PUBLISHED: 1,
    REJECTED: 2,
    AWAIT: 3
};

export const ARCGIS_TAGS = {
    FIGURES: "CIFRAS",
    INDICATORS: "INDICADORES",
    INDEXES: "INDICES",
};

export const AUTHENTICATION_TYPE = {
    CITIZEN: {value: 0, text: "Ciudadano, empresarial, académico"},
    SDP_OFFICIAL: {value: 1, text: "Funcionario SDP"},
    SDP_AUTHORIZED: {value: 2, text: "Institucional autorizado por SDP"}
};

export const USER_STATUS = {
    NO_AUTHORIZED: {value: null, text: "Estado"},
    NO_CHECK: {value: 0, text: "No Autorizado"},
    NO_PROFILE: {value: 1, text: "Sin perfil diligenciado"},
    AUTHORIZED: {value: 2, text: "Autorizado"}
}

// export const USER_TYPES_BY_AUTH_TYPE
