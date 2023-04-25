import { SURVEY_STATUS } from '../../domain_constants'

export default {
  getSurveyStatus: ( surveyObject ) => {
    let today = new Date( );
    let startDate = new Date( surveyObject.startDate );
    let endDate = new Date( surveyObject.endDate );
    if( today < startDate ) {
      if( !surveyObject.published )
        return SURVEY_STATUS.EDITING; //Editing
      else
        return SURVEY_STATUS.PUBLISHING_PROCESS; //Publishing process
    }
    else if( today >= startDate && today < endDate ) {
      if( surveyObject.published )
        return SURVEY_STATUS.PUBLISHED; //Published
      else
        return SURVEY_STATUS.EDITING; //Editing
    }
    else if( today >= endDate ) {
      if( surveyObject.published )
        return SURVEY_STATUS.CLOSED; //Closed
      else 
        return SURVEY_STATUS.EDITING; //Editing
    }
  }
}