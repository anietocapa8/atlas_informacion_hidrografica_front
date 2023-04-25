import { BACK_URI } from '../sipsder_constants'

export default {
   // Obtiene image de un recurso del back, la url es de la forma
   // sipsder/images/path/imagen/algo.png
  getImgURL: ( relImgPath ) => {
    //if (relImgPath && !/^blob/.test(relImgPath) && !/^http/.test(relImgPath)) {
    if (relImgPath && !/^([a-zA-Z]+:)/.test(relImgPath)) {
      relImgPath = relImgPath.replace(new RegExp("^[\\\\/]+"), "");
      return `${BACK_URI}images/${relImgPath}`;
    }
    return relImgPath;
  },
  getVideoURL: ( relVideoPath ) => {
    if (relVideoPath && (relVideoPath[0] == '/' || relVideoPath[0] == '\\')) {
        return `${BACK_URI}images${relVideoPath}`;
    }
    return relVideoPath;
  }
}