const getTimeLine = (state) => {
  return state.timeLine;
}

const getTimeLinePages = (state) => {
  return state.timeLine;
}
 
const getTimeLineQuery = (state) => {
  return state.timeLineQuery;
}

const getTimeLineMeta = (state) => {
  return  state.timeLineTotalRegisters;
}
  
export default {
  getTimeLine,
  getTimeLinePages,
  getTimeLineQuery,
  getTimeLineMeta
}