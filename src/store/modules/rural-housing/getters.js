const getTimeLines = (state) => {
    return state.timeLines;
  }
  
  const getTimeLinesPages = (state) => {
    return state.timeLines;
  }
   
  const getTimeLinesQuery = (state) => {
    return state.timeLinesQuery;
  }
  
  const getTimeLinesMeta = (state) => {
    return  state.timeLinesTotalRegisters;
  }
  
  const getContestId = (state) => {
    return  state.contestId;
  }
    
  export default {
    getTimeLines,
    getTimeLinesPages,
    getTimeLinesQuery,
    getTimeLinesMeta,
    getContestId,
  }