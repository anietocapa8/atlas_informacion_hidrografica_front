
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../components/shared/Layout.vue'
import Container from '../components/shared/Container.vue'
const Home = () => import('../components/Home.vue')
//const  LabRichText = () => import('../components/views/LabRichText.vue')
import store from '../store'
import GeneralRouter from '../components/GeneralRouter'

// For User
const Registration = () => import('../components/views/user/Registration.vue')
const Profile = () => import('../components/views/user/Profile.vue')
const ConfirmAccount  = () => import('../components/views/user/ConfirmAccount.vue')
const ConfirmUpdateEmail  = () => import('../components/views/user/ConfirmUpdateEmail.vue')
const ConfirmRecoveryAccount  = () => import('../components/views/user/ConfirmRecoveryAccount.vue')

//For Terms and Conditions
const TermsAndConditionsAdmin = () => import('../components/views/terms_and_conditions_admin/TermsAndConditions.vue')
const TermsAndConditionsIndexAdmin = () => import('../components/views/terms_and_conditions_admin/TermsAndConditionsIndex.vue')
const TermsAndConditionsDetailAdmin = () => import('../components/views/terms_and_conditions_admin/TermsAndConditionsDetail.vue')
const UsersAdmin = () => import('../components/views/user_administration/UsersAdmin')
const Institution = () => import('../components/views/institution_administration/Institution')
const InstitutionAdmin = () => import('../components/views/institution_administration/InstitutionAdmin')
const InstitutionFormAdmin = () => import('../components/views/institution_administration/InstitutionFormAdmin')
const EmailSendAdmin = () => import('../components/views/email_administration/EmailSendAdmin')
const TermsAndConditionsPage = () => import('../components/views/terms_and_conditions_page/TermsAndConditionsPage.vue')
const DataProtectionPage = () => import('../components/views/data_protection_page/DataProtectionPage.vue')

//For Frequently Asked Questions
const FrequentlyAskedQuestions = () => import('../components/views/frequently_asked_questions/FrequentlyAskedQuestions.vue')
const FrequentlyAskedQuestionsIndex = () => import('../components/views/frequently_asked_questions/FrequentlyAskedQuestionsIndex.vue')
const FrequentlyAskedQuestionsDetail = () => import('../components/views/frequently_asked_questions/FrequentlyAskedQuestionsDetail.vue')
const FrequentlyAskedQuestionsAdmin = () => import('../components/views/frequently_asked_questions/FrequentlyAskedQuestionsAdmin.vue')

//For Help
const Help = () => import('../components/views/help/Help.vue')
const HelpAdmin = () => import('../components/views/help/HelpAdmin.vue')
const HelpDetail = () => import('../components/views/help/HelpDetail.vue')
const HelpRouter = () => import('../components/views/help/HelpRouter.vue')

//For Social networks
const SocialNetworks = () => import('../components/views/social_networks/SocialNetworks.vue')
const SocialNetworkIndex = () => import('../components/views/social_networks/SocialNetworkIndex.vue')

// SocialNetworksShare
const SocialNetworksFeed = () => import('../components/views/social_networks_feed/SocialNetworksFeed.vue')
const SocialNetworksShare = () => import('../components/shared/social_networks_share/SocialNetworksShare.vue')

//For Contact
const Contact = () => import('../components/views/contact/Contact.vue')
const ContactIndex = () => import('../components/views/contact/ContactIndex.vue')
const ContactDetail = () => import('../components/views/contact/ContactDetail.vue')

//Pruebas de componentes
const TestComponents  = () => import('../components/views/test_components/TestComponents.vue')

//For About
const About  = () => import('../components/views/about/About.vue')
const AboutIndex  = () => import( '../components/views/about/AboutIndex.vue')
const TimeLineCreate  = () => import( '../components/views/about/TimeLineCreate.vue')

// For Geographic viewer
const GeoViewer  = () => import('../components/views/geo_viewer/GeoViewer')

// For Land use
const LandUseSettings  = () => import('../components/views/land_use/LandUseSettings')
const LandUse  = () => import('../components/views/land_use/LandUse')

//For Rural Model
const RuralModelMain  = () => import('../components/views/rural_model/RuralModelMain.vue')
const RuralModel  = () => import('../components/views/rural_model/RuralModel.vue')
const RuralModelAdmin = () => import('../components/views/rural_model/RuralModelAdmin.vue')
const RuralModelDetail = () => import('../components/views/rural_model/RuralModelDetail.vue')

//For Rural Indicators
const RuralIndicatorMain  = () => import('../components/views/rural_indicators/RuralIndicatorMain.vue')
const RuralIndicatorIndex  = () => import('../components/views/rural_indicators/RuralIndicatorIndex.vue')
const RuralFigureCreate  = () => import('../components/views/rural_indicators/admin/RuralFigureCreate.vue')
const RuralFigureDetail  = () => import('../components/views/rural_indicators/detail/RuralFigureDetail.vue')
const RuralIndicatorCreate  = () => import('../components/views/rural_indicators/admin/RuralIndicatorCreate.vue')
const RuralIndicatorDetail  = () => import('../components/views/rural_indicators/detail/RuralIndicatorDetail.vue')
const RuralIndexCreate  = () => import('../components/views/rural_indicators/admin/RuralIndexCreate.vue')
const RuralIndexDetail  = () => import('../components/views/rural_indicators/detail/RuralIndexDetail.vue')
const RuralBulletinCreate  = () => import('../components/views/rural_indicators/admin/RuralBulletinCreate.vue')

//For Calendar
//import Calendar from '../components/views/calendar/Calendar.vue'
//import CalendarIndex from '../components/views/calendar/CalendarIndex.vue'
//import CalendarCreate from "../components/views/calendar/CalendarCreate.vue"
//import EventDetail from '../components/views/event/EventDetail.vue'

const Calendar = () => import('../components/views/calendar/Calendar.vue')
const CalendarIndex = () => import('../components/views/calendar/CalendarIndex.vue')
const CalendarCreate = () => import('../components/views/calendar/CalendarCreate.vue')
const EventDetail = () => import('../components/views/event/EventDetail.vue')

//For Library
const Library  = () => import('../components/views/library/Library.vue')
const LibraryIndex  = () => import('../components/views/library/LibraryIndex.vue')
const LibraryView  = () => import('../components/views/library/LibraryView.vue')

//For Procedure
const Procedure  = () => import('../components/views/procedure/Procedure.vue')
const ProcedureIndex  = () => import('../components/views/procedure/ProcedureIndex.vue')
const ProcedureDetail  = () => import('../components/views/procedure/ProcedureDetail.vue')
const ProcedureCreate  = () => import('../components/views/procedure/ProcedureCreate.vue')

//For Topic 
const Topic  = () => import('../components/views/topic/Topic.vue')

// For RuralHousing
const RuralHousingIndex  = () => import('../components/views/topic/rural_housing/RuralHousingIndex.vue')
const TimeLineAdmin  = () => import('../components/views/topic/rural_housing/admin/TimeLineAdmin.vue')

// Prototype
const Prototype  = () => import('../components/views/topic/prototype/Prototype.vue')
const PrototypeIndex  = () => import('../components/views/topic/prototype/PrototypeIndex.vue')
const PrototypeDetail  = () => import('../components/views/topic/prototype/PrototypeDetail.vue')
const PrototypeCreate  = () => import('../components/views/topic/prototype/PrototypeCreate.vue')

// Document Page View
const DocumentPageView  = () => import('../components/shared/DocumentPageView.vue')

// Contest
const ContestCreate  = () => import('../components/views/topic/contest/ContestCreate.vue')
const ContestDetail  = () => import('../components/views/topic/contest/ContestDetail.vue')

//For social 
//For Administration of visits
const AdminVisit  = () => import('../components/views/visit_administration/AdminVisit.vue')
const AdminVisitIndex  = () => import('../components/views/visit_administration/AdminVisitIndex.vue')

//For Surveys
const Survey  = () => import( '../components/views/survey/Survey.vue')
const SurveySectionAdmin  = () => import('../components/views/survey/admin/SurveySectionAdmin.vue')
const SurveyQuestionAdmin  = () => import('../components/views/survey/admin/SurveyQuestionAdmin.vue')
const SurveyAdminCreate  = () => import('../components/views/survey/admin/SurveyAdminCreate.vue')
const SurveyForm  = () => import('../components/views/survey/SurveyForm.vue')
const SurveyResult  = () => import('../components/views/survey/SurveyResult.vue')

import VAPI from '../http_common'
import { SERVICE_NAMES } from '../sipsder_constants'

//for testing word cloud
const  TestWordCloud  = () => import('../components/views/TestWordCloud')

//for testing
const  TestReport  = () => import('../components/views/test_components/TestReport')

//For Logos
const Logos = () => import('../components/views/logos/Logos.vue')
const LogosIndex = () => import('../components/views/logos/LogosIndex.vue')

//For Banner Administration
const BannerAdmin = () => import('../components/views/banner_admin/Banner.vue')
const BannerIndexAdmin = () => import('../components/views/banner_admin/BannerIndex.vue')

//For Community
const CommunitySurveyMain = () => import('../components/views/community/CommunitySurveyMain.vue')
const Community = () => import('../components/views/community/Community.vue')
const CommunitySurvey = () => import('../components/views/community/CommunitySurvey.vue')
const CommunityImages = () => import('../components/views/community/CommunityImages.vue')
const CommunityIntructives = () => import('../components/views/community/CommunityInstructives.vue');
const CommunityForums = () => import('../components/views/community/CommunityForums.vue');
//For Rurality stories
const CommunityStory = () => import('../components/views/community/stories/CommunityStory');
const CommunityCategoryAdmin = () => import('../components/views/community/stories/CommunityCategoryAdmin');
const CommunityStoryCreate = () => import('../components/views/community/stories/CommunityStoryCreate');
const CommunityStoryDetail = () => import('../components/views/community/stories/CommunityStoryDetail');
const CommunityStoryIndex = () => import('../components/views/community/stories/CommunityStoryIndex');

//For CommuityCarousel

const CommunityCarouselAdmin = () => import('../components/views/community/CommunityCarouselAdmin');

// For Metasearch Engine
const MetasearchEngine = () => import('../components/views/metasearch/MetasearchEngine.vue')
const MetasearchEngineIndex = () => import('../components/views/metasearch/MetasearchEngineIndex.vue')

//For News
const News = () => import('../components/views/news/News.vue')
const NewsIndex = () => import('../components/views/news/NewsIndex.vue')
const NewsCreate = () => import('../components/views/news/NewsCreate.vue')
const NewsDetail = () => import('../components/views/news/NewsDetail.vue')

//For Proyect Tools
const ProyectTool= () => import('../components/views/proyect_tool/ProyectTool.vue')
const ProyectToolIndex = () => import('../components/views/proyect_tool/ProyectToolIndex.vue')
const ProyectToolMethodology = () => import('../components/views/proyect_tool/ProyectToolMethodology.vue')
const ProyectToolFundingSource = () => import('../components/views/proyect_tool/ProyectToolFundingSource.vue')
const ProyectToolConcepts = () => import('../components/views/proyect_tool/ProyectToolConcepts.vue')
const ProyectToolAnnouncementIndex = () => import('../components/views/proyect_tool/ProyectToolAnnouncementIndex.vue')
const ProyectToolAnnouncementAdmin = () => import('../components/views/proyect_tool/admin/ProyectToolAnnouncementAdmin.vue')
const ProyectToolProyectIndex = () => import('../components/views/proyect_tool/ProyectToolProyectIndex.vue')
const ProyectToolProyectDetail = () => import('../components/views/proyect_tool/ProyectToolProyectDetail.vue')
const ProyectToolProyectAdmin = () => import('../components/views/proyect_tool/admin/ProyectToolProyectAdmin.vue')
const ProyectIndex = () => import('../components/views/proyect_tool/ProyectIndex.vue')
const AnnouncementIndex = () => import('../components/views/proyect_tool/AnnouncementIndex.vue')
// For Notifications
const Notifications = () => import('../components/views/notification/Notification.vue')
const NotificationsProcess = () => import('../components/views/notification/NotificationProcess.vue')

//For Audiovisual
const AudioVisual = () => import('../components/views/audiovisual_media/AudioVisual.vue')
const AudioVisualAdmin = () => import(  '../components/views/audiovisual_media/AudioVisualAdmin.vue')
const AudioVisualModify = () => import('../components/views/audiovisual_media/AudioVisualModify.vue')

//For Signatures and templates
const SignaturesAndTemplatesAdmin = () => import('../components/views/signature_admin/Signature.vue')
const SignaturesAndTemplatesIndexAdmin = () => import('../components/views/signature_admin/SignatureIndex.vue')

//For Report Donwload
const DownloadReportAdmin = () => import('../components/views/report_download_admin/DownloadReportAdmin.vue')
const DownloadReportIndexAdmin = () => import('../components/views/report_download_admin/DownloadReportIndexAdmin.vue')

//For the page sitemap
const Sitemap = () => import('../components/views/sitemap/Sitemap.vue')
const RLDocumentCreate = () => import('../components/views/rural_library/DocumentAdmin.vue')

//For normogram 
const Norm = () => import('../components/views/normogram/Norm.vue')
const NormCreate = () => import('../components/views/normogram/NormCreate.vue')
const Normogram = () => import('../components/views/normogram/Normogram.vue')
const NormogramIndex = () => import('../components/views/normogram/NormogramIndex.vue')
const NormogramDetail = () => import('../components/views/normogram/NormogramDetail.vue')

//For Permissions
const Permissions = () => import('../components/views/roles/Roles.vue')
const PermissionsAdmin = () => import( '../components/views/roles/RolesAdmin.vue')

//For ArcGIS config
const ArcGISConfig = () => import('../components/views/configuration/ArcGISConfig')

const Logout = () => import('../components/views/user/Logout.vue')

Vue.use(Router)

const userRegistration = {
    path: '/user-registration',
    name: 'UserRegistration',
    component: Registration
};

const userProfile = {
    path: '/user-profile',
    name: 'UserProfile',
    component: Profile,
};

const confirmAccount = {
  path: '/confirm-account',
  name: 'ConfirmAccount',
  component: ConfirmAccount
};

const testComponents = {
    path: 'test-components',
    name: 'TestComponents',
    component: TestComponents,
};

const sitemap = {
    path: 'sitemap',
    name: 'Sitemap',
    component: Sitemap,
};

const notificationComponents = {
    path: 'notification',
    name: 'Notification',
    component: Notifications,
};

const notificationsProcessComponent = {
    path: '/notification-process/:idNotification',
    name: 'NotificationProcess',
    component: NotificationsProcess,
    props: true,
};

const ruralLibraryCreateDocument = {
    path: 'create-document/:id?',
    name: 'CreateDocument',
    component: RLDocumentCreate,
    meta: {
        community: false
    }
};

const confirmUpdateEmail = {
    path: '/confirm-update-email',
    name: 'ConfirmUpdateEmail',
    component: ConfirmUpdateEmail
};

const confirmRecoveryAccount = {
    path: '/confirm-recover',
    name: 'ConfirmRecover',
    component: ConfirmRecoveryAccount
}

const communityLibrary = {
    path: '/library-communitydoc',
    name: 'CommunityLibrary',
    redirect: '/library/community',
}


const router = new Router({
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        component: Layout,
        children: [
            {
                path: '',
                component: Container,
                children: [
                    {
                        path: '/configuration',
                        name: 'ConfigRouter',
                        component: GeneralRouter,
                        meta: {name: 'ConfigRouter'},
                        children: [
                            {
                                path: 'arcgis',
                                name: 'ArcGISConfig',
                                component: ArcGISConfig,
                            },
                        ]
                    },
                    {
                        path: '/social-networks',
                        meta: {name: 'SocialNetworks'},
                        component: SocialNetworks,
                        children: [
                            {
                                path: '',
                                name: 'SocialNetworksIndex',
                                component: SocialNetworkIndex,
                            }
                        ]
                    },
                    {
                        path: '/logos',
                        meta: {name: 'Logos'},
                        component: Logos,
                        children: [
                            {
                                path: '',
                                name: 'LogosIndex',
                                component: LogosIndex,
                            }
                        ]
                    },
                    {
                        path: '/metasearch-engine',
                        name: 'MetasearchEngineI',
                        component: MetasearchEngine,
                        redirect: MetasearchEngineIndex,
                        children: [
                            {
                                path: '',
                                name: 'MetasearchEngine',
                                component: MetasearchEngineIndex,
                            }
                        ]
                    },
                    {
                        path: '/permissions-admin',
                        meta: {name: 'Permissions'},
                        component: Permissions,
                        children: [
                            {
                                path: '',
                                name: 'PermissionsAdmin',
                                component: PermissionsAdmin
                            }
                        ]
                    },
                    {
                        path: '/community-carousel-admin',
                        name: 'CommunityCarouselAdmin',
                        component: CommunityCarouselAdmin
                    },
                    {
                        path: '/project-tool',
                        meta: {name: 'ProyectTool'},
                        component: ProyectTool,
                        children: [
                            {
                                path: '',
                                name: 'ProyectToolIndex',
                                component: ProyectToolIndex
                            },
                            {
                                path: 'methodology',
                                name: 'ProyectToolMethodology',
                                component: ProyectToolMethodology
                            },
                            {
                                path: 'funding-source',
                                name: 'ProyectToolFundingSource',
                                component: ProyectToolFundingSource
                            },
                            {
                                path: 'concepts',
                                name: 'ProyectToolConcepts',
                                component: ProyectToolConcepts
                            },
                            {
                                path: 'announcement',
                                meta: {name: 'AnnouncementIndex'},
                                component: AnnouncementIndex,
                                children: [ 
                                    {
                                        path: 'admin/:id?',
                                        name: 'ProyectToolAnnouncementAdmin',
                                        component: ProyectToolAnnouncementAdmin,
                                    },
                                    {
                                        path: '',
                                        name: 'ProyectToolAnnouncementIndex',
                                        component: ProyectToolAnnouncementIndex,
                                    },
                                ]
                            },
                            {
                                path: 'project',
                                meta: {name: 'ProyectIndex'},
                                component: ProyectIndex,
                                children: [ 
                                    {
                                        path: '',
                                        name: 'ProyectToolProyectIndex',
                                        component: ProyectToolProyectIndex,
                                    },
                                    {
                                        path: 'admin/:id?',
                                        name: 'ProyectToolProyectAdmin',
                                        component: ProyectToolProyectAdmin,
                                    },
                                    {
                                        path: 'detail/:id?',
                                        name: 'ProyectToolProyectDetail',
                                        component: ProyectToolProyectDetail,
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: '/news',
                        meta: {name: 'News'},
                        component: News,
                        children: [
                            {
                                path: '',
                                name: 'NewsIndex',
                                component: NewsIndex
                            },
                            {
                                path: 'add/:id?',
                                name: 'NewsCreate',
                                component: NewsCreate
                            },
                            {
                                path: ':id/:url?',
                                name: 'NewsDetail',
                                component: NewsDetail
                            }
                        ]
                    },
                    {
                      path: '/download-report',
                      meta: {name: 'DownloadReportAdmin'},
                      component: DownloadReportAdmin,
                      children: [
                          {
                              path: '',
                              name: 'DownloadReportIndexAdmin',
                              component: DownloadReportIndexAdmin
                          }
                      ]
                    },
                    {
                        path: "/geographic-viewer",
                        name: "GeoViewer",
                        component: GeoViewer,
                    },
                    {
                        path: "/land-use",
                        meta: {name: "LandUseRouter"},
                        component: GeneralRouter,
                        children: [
                            {
                                path: "settings",
                                name: "LandUseSettings",
                                component: LandUseSettings,
                            },
                            {
                                path: "",
                                name: "LandUse",
                                component: LandUse,
                            }
                        ]
                    },
                    {
                        path: "/community",
                        meta: {name: 'Community'},
                        component: Community,
                        children: [
                            { 
                                path: '', 
                                redirect: { 
                                    name: 'CommunityImages' 
                                }
                            },
                            {
                                path: 'document/:ruralModelId?',
                                name: 'CommunityLibrary',
                                component: LibraryIndex,
                                props: true,
                                meta: {
                                    community: true,
                                    nextView: 'CommunityLibraryView',
                                    nextCreate: 'CommunityCreateDocument'
                                }
                            },
                            {
                                path: 'view-document/:id',
                                name: 'CommunityLibraryView',
                                component: LibraryView,
                                meta: {
                                    prevList: 'CommunityLibrary',
                                    nextCreate: 'CommunityCreateDocument',
                                    isCommunity: true
                                }
                            },
                            {
                                path: 'create-document/:id?',
                                name: 'CommunityCreateDocument',
                                component: RLDocumentCreate,
                                meta: {
                                    community: true
                                }
                            },
                            {
                                path: 'images',
                                name: 'CommunityImages',
                                component: CommunityImages
                            },
                            {
                                path: 'instructives',
                                name: 'CommunityInstructives',
                                component: CommunityIntructives
                            },
                            {
                                path: 'forums',
                                name: 'CommunityForums',
                                component: CommunityForums
                            },
                            {
                                path: 'stories',
                                meta: {name: 'CommunityStoryRouter'},
                                component: GeneralRouter,
                                children: [
                                    {
                                        path: '',
                                        name: 'CommunityStory',
                                        component: CommunityStory
                                    },
                                    {
                                        path: 'categories',
                                        name: 'CommunityCategoryAdmin',
                                        component: CommunityCategoryAdmin,
                                    },
                                    {
                                        path: 'index',
                                        name: 'CommunityStoryIndex',
                                        component: CommunityStoryIndex
                                    },
                                    {
                                        path: 'create/:id?',
                                        name: 'CommunityStoryCreate',
                                        component: CommunityStoryCreate,
                                    },
                                    {
                                        path: 'detail/:id',
                                        name: 'CommunityStoryDetail',
                                        component: CommunityStoryDetail
                                    },
                                ],
                            },
                            {
                                path: 'surveys',
                                meta: {name: 'CommunitySurveyMain'},
                                component: CommunitySurveyMain,
                                children: [
                                    {
                                        path: '',
                                        name: 'CommunitySurvey',
                                        component: CommunitySurvey
                                    },
                                    {
                                        path: 'survey/:id/:url',
                                        name: 'SurveyForm',
                                        component: SurveyForm
                                    },
                                    {
                                        path: 'results/:id/:url',
                                        name: 'SurveyResult',
                                        component: SurveyResult
                                    },
                                    //communityLibrary
                                ],
                            }
                        ]
                    },
                    {
                      path: "/normogram",
                      name: "Normogram",
                      meta: {name: 'Normogram'},
                      component: Normogram,
                      children: [
                          {
                              path: ':ruralModelId?',
                              name: 'NormogramIndex',
                              component: NormogramIndex
                          },
                          {
                            path: 'detail/:id',
                            name: 'NormogramDetail',
                            component: NormogramDetail
                        }
                      ]
                  },
                    {
                        path: "/library",
                        name: "Library",
                        component: Library,
                        meta: {name: 'Library'},
                        props: true,
                        children: [
                            {
                                path: 'document/:ruralModelId?',
                                name: 'LibraryIndex',
                                component: LibraryIndex,
                                meta: {
                                    nextView: 'LibraryView',
                                    nextCreate: 'CreateDocument'
                                }
                            },
                            {
                                path: 'view-document/:id',
                                name: 'LibraryView',
                                component: LibraryView,
                                meta: {
                                    prevList: 'LibraryIndex',
                                    nextCreate: 'CreateDocument',
                                    isCommunity: false
                                }
                            },
                            ruralLibraryCreateDocument
                        ]
                    },
                    {
                        path: "/procedure",
                        meta: {name: 'Procedure'},
                        component: Procedure,
                        children: [
                            {
                                path: '',
                                name: 'ProcedureIndex',
                                component: ProcedureIndex
                            },
                            {
                                path: 'detail/:id',
                                name: 'ProcedureDetail',
                                component: ProcedureDetail
                            },
                            {
                                path: 'create/:id?',
                                name: 'ProcedureCreate',
                                component: ProcedureCreate,
                            },
                        ]
                    },
                    {
                        path: "/topics",
                        meta: {name: 'Topic'},
                        component: Topic,
                        children: [
                            { path: '', redirect: { name: 'RuralHousingIndex' } },
                            {
                                path: "rural-housing",
                                meta: {name: 'RuralHousing'},
                                component: GeneralRouter,
                                children: [
                                    {
                                        path: "",
                                        name: "RuralHousingIndex",
                                        component: RuralHousingIndex
                                    },
                                    {
                                        path: "contests",
                                        meta: {name: 'Contest'},
                                        component: GeneralRouter,
                                        children: [
                                            { path: '', redirect: { name: 'RuralHousingIndex' }},
                                            {
                                                path: 'create',
                                                name: 'ContestCreate',
                                                component: ContestCreate
                                            },
                                            {
                                                path: 'detail/:id?',
                                                name: 'ContestDetail',
                                                component: ContestDetail
                                            },
                                        ]
                                    }
                                ]
                            },
                            {
                                path: 'rural-housing/admin',
                                name: 'TimeLineAdmin',
                                component: TimeLineAdmin
                            },
                            {
                                path: 'prototypes-admin/:id?',
                                name: 'PrototypesCreate',
                                component: PrototypeCreate,
                            },
                            {
                                path: "rural-housing",
                                name: "RuralHousing",
                                meta: {name: 'RuralHousing'},
                                component: Prototype,
                                children: [
                                    {
                                        path: 'prototypes',
                                        name: 'PrototypesIndex',
                                        component: PrototypeIndex,
                                    },
                                    {
                                        path: 'prototypes/detail/:id',
                                        name: 'PrototypesDetail',
                                        component: PrototypeDetail,
                                    },
                                    {
                                        path: 'prototypes/documents/:id',
                                        name: 'PrototypesDocument',
                                        component: DocumentPageView,
                                    }
                                ]
                            },                           
                        ]
                    },
                    {
                        path: '/admin-visits',
                        meta: {name: 'AdminVisit'},
                        component: AdminVisit,
                        children: [
                            {
                                path: '',
                                name: 'AdminVisitsIndex',
                                component: AdminVisitIndex
                            }
                        ]
                    },
                    {
                        path: '',
                        name: 'Home',
                        component: Home
                    },
                    userRegistration,
                    userProfile,
                    confirmUpdateEmail,
                    confirmRecoveryAccount,
                    confirmAccount,
                    notificationComponents,
                    notificationsProcessComponent,
                    testComponents,
                    sitemap,
                    {
                        path: '/rural-library',
                        name: 'RuralLibrary',
                        children : [
                            // Cambiar cuando se agregen los permisos necesarios.
                            // ruralLibraryCreateDocument,
                        ]
                    },
                    {
                        path: '/about',
                        meta: {name: 'About'},
                        component: About,
                        children: [
                            {
                                path: '',
                                name: 'AboutIndex',
                                component: AboutIndex,
                            },
                            {
                                path: 'add-timeline',
                                name: 'TimeLineCreate',
                                component: TimeLineCreate
                            }
                        ]
                    },
                    {
                        path: '/rural-model',
                        meta: {name: 'RuralModelMain'},
                        component: RuralModelMain,
                        children: [
                            {
                                path: '',
                                name: 'RuralModel',
                                component: RuralModel,                     
                            },
                            {
                                path: 'detail',
                                name: 'RuralModelDetail',
                                component: RuralModelDetail,                        
                            },
                            {
                                path: 'admin',
                                name: 'RuralModelAdmin',
                                component: RuralModelAdmin
                            }
                        ],
                    },
                    {
                        path: '/rural-indicators',
                        meta: {name: 'RuralIndicatorMain'},
                        component: RuralIndicatorMain,
                        children: [
                            {
                                path: '',
                                name: 'RuralIndicatorIndex',
                                component: RuralIndicatorIndex 
                            },
                            {
                                path: 'create/figure/:id?',
                                name: 'RuralFigureCreate',
                                component: RuralFigureCreate           
                            },
                            {
                                path: 'detail/figure/:id',
                                name: 'RuralFigureDetail',
                                component: RuralFigureDetail
                            },
                            {
                                path: 'create/indicator/:id?',
                                name: 'RuralIndicatorCreate',
                                component: RuralIndicatorCreate           
                            },
                            {
                                path: 'detail/indicator/:id',
                                name: 'RuralIndicatorDetail',
                                component: RuralIndicatorDetail
                            },
                            {
                                path: 'document-preview/:id',
                                name: 'RuralIndicatorDocumentPreview',
                                component: DocumentPageView
                            },
                            {
                                path: 'create/index/:id?',
                                name: 'RuralIndexCreate',
                                component: RuralIndexCreate,  
                            },
                            {
                                path: 'detail/index/:id',
                                name: 'RuralIndexDetail',
                                component: RuralIndexDetail
                            },
                            {
                                path: 'create/bulletin/:id?',
                                name: 'RuralBulletinCreate',
                                component: RuralBulletinCreate,  
                            },
                        ]
                    },
                    {
                        path: '/calendar',
                        meta: {name: 'Calendar'},
                        component: Calendar,
                        children: [
                            {
                                path: '',
                                name: 'CalendarIndex',
                                component: CalendarIndex,
                            },
                            {
                                path: 'create/:id?',
                                name: 'CalendarCreate',
                                component: CalendarCreate,
                            }
                        ]
                    },
                    {
                        path: '/event/:id/:url?',
                        name: 'EventDetail',
                        component: EventDetail,                        
                    },
                    {
                        path: '/contact',
                        meta: {name: 'Contact'},
                        component: Contact,
                        children: [
                            {
                                path: '',
                                name: 'ContactIndex',
                                component: ContactIndex,
                            },
                            {
                                path: 'detail/:url',
                                name: 'ContactDetail',
                                component: ContactDetail,
                            }
                        ]
                    },
                    {
                        path: '/policies-admin',
                        component: TermsAndConditionsAdmin,
                        children: [
                            {
                                path: '',
                                name: 'TermsAndConditionsIndexAdmin',
                                component: TermsAndConditionsIndexAdmin
                            }
                        ]
                    },
                    {
                      path: '/signatures-and-templates-admin',
                      component: SignaturesAndTemplatesAdmin,
                      children: [
                          {
                              path: '',
                              name: 'SignaturesIndexAdmin', 
                              component: SignaturesAndTemplatesIndexAdmin
                          }
                      ]
                    },
                    {
                        path: '/banner-admin',
                        component: BannerAdmin,
                        children: [
                            {
                                path: '',
                                name: 'BannerIndexAdmin',
                                component: BannerIndexAdmin
                            }
                        ]
                    },
                    {
                        path: '/user-admin',
                        name: 'UsersAdmin',
                        component: UsersAdmin,
                        children: []
                    },
                    {
                        path: '/institution-admin',
                        name: 'Institution',
                        meta: {name: 'Institution'},
                        component: Institution,
                        children: [
                            {
                                path: '',
                                name: 'InstitutionAdmin',
                                component: InstitutionAdmin,
                                children: []
                            },
                            {		
                                path: 'form',		
                                name: 'InstitutionFormAdmin',		
                                component: InstitutionFormAdmin,		
                                children: [],		
                            },
                        ]
                    },
                    
                    {
                        path: '/email-admin',
                        name: 'EmailSendAdmin',
                        component: EmailSendAdmin,
                        children: []
                    },
                    {
                        path: '/faqs',
                        meta: {name: 'FrequentlyAskedQuestionsPage'},
                        component: FrequentlyAskedQuestions,
                        children: [
                            {
                                path: 'admin/:id?',
                                name: 'FrequentlyAskedQuestionsAdmin',
                                component: FrequentlyAskedQuestionsAdmin
                            },
                            {
                                path: '',
                                name: 'FrequentlyAskedQuestionsIndex',
                                component: FrequentlyAskedQuestionsIndex
                            },
                            {
                                path: 'detail/:id/:url?',
                                name: 'FrequentlyAskedQuestionsDetail',
                                component: FrequentlyAskedQuestionsDetail
                            }
                        ]
                    },
                    {
                        path: '/help',
                        meta: {name: 'HelpRouter'},
                        component: HelpRouter,
                        children: [
                            {
                                path: '',
                                name: 'Help',
                                component: Help,
                            },
                            {
                                path: 'admin/:id/:title?',
                                name: 'HelpAdmin',
                                component: HelpAdmin
                            },
                            {
                                path: 'detail/:id/:title?',
                                name: 'HelpDetail',
                                component: HelpDetail,
                            }
                        ]
                    },
                    {
                        path: '/policy-tool',
                        name: 'DataProtectionPage',
                        component: DataProtectionPage
                    },
                    {
                        path: '/terms-and-conditions',
                        name: 'TermsAndConditionsPage',
                        component: TermsAndConditionsPage
                    },
                    {
                        path: '/audiovisual-admin',
                        meta: {name: 'AudioVisual'},
                        component: AudioVisual,
                        children: [
                            {
                                path: '',
                                name: 'AudioVisualAdmin',
                                component: AudioVisualAdmin
                            },
                            {
                                path: 'modify/:id?',
                                name: 'AudiovisualModify',
                                component: AudioVisualModify,
                            }
                        ] 
                    },
                    {
                        path: '/audiovisual',
                        meta: {name: 'AudioVisual'},
                        name: 'AudioVisualControl',
                        component: AudioVisualAdmin,
                        children: [] 
                    },
                    {
                        path: '/social-networks-feed',
                        name: 'SocialNetworksFeed',
                        component: SocialNetworksFeed,
                        children: []
                    },
                    {
                        path: '/word-cloud-test',
                        name: 'WordCloudTest',
                        component: TestWordCloud,
                        children: []
                    },
                    {
                        path: '/social-networks-share',
                        name: 'SocialNetworksShare',
                        component: SocialNetworksShare,
                        children: []
                    },
                    {
                        path: '/test-report',
                        name: 'TestReport',
                        component: TestReport,
                        children: []
                    },
                    {
                        path: '/survey',
                        name: 'Survey',
                        meta: {name: 'Survey'},
                        component: Survey,
                        children: [
                            {
                                path: 'create/:code?',
                                name: 'SurveyAdminCreate',
                                component: SurveyAdminCreate
                            },
                            {
                                path: 'sections/:code',
                                name: 'SurveySectionAdmin',
                                component: SurveySectionAdmin  
                            },
                            {
                                path: 'questions/:section/related-survey/:code',
                                name: 'SurveyQuestionAdmin',
                                component: SurveyQuestionAdmin
                            }
                        ]
                    },
                    {
                        path: '/norm',
                        name: 'Norm',
                        meta: {name: 'Norm'},
                        component: Norm,
                        children: [
                            {
                                path: 'create/:id?',
                                name: 'NormCreate',
                                component: NormCreate,
                            },
                        ]
                    },
                    {
                        path: '/logout',
                        name: 'Logout',
                        component: Logout
                    }
                ]
            }
        ]
    },]
})

//Interceptor for count pages
router.beforeEach((to, from, next) => {
    //console.info("NAME ", to.name);

    if(to.name === 'Logout'){
        next(); 
    } else {
        var path =  to.path
        //Check page access permissions 
        if (localStorage.getItem('authenticated')) {
            if (requireProfile(path)) {
                toProfile(next);
                return
            }
        }
        let currentPermissions = store.getters.getCurrentPermissions;
        //console.info("currentPermissions ", currentPermissions);
        if (currentPermissions && currentPermissions[to.name] && 
            currentPermissions[to.name].length > 0) {
            toPath(next, path);
            return
        }
        toHome(next, path); 
    }
});

function requireProfile(path) {
    return store.getters.getCurrentUser && !path.includes(userProfile.path) && store.getters.getCurrentUser.status <= 1;
}

function toProfile(next) {
    registerRoute(userProfile.path);
    next(userProfile.path); 
}

function toHome(next, path) {
    registerRoute("/");
    if (path !== "/") {
        next("/");
    }
    next();
}

function toPath(next, path) {
    registerRoute(path);
    next(); 
}

function registerRoute(path) {
    if(path.slice(-1) === "/" && path.length !== 1){
        path = path.substring(0, path.length - 1);
    }
    VAPI.post(`${SERVICE_NAMES.PAGE}/visit`, {
        url: path
    })
}

export default router;

