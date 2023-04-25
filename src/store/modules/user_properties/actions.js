import VAPI from "../../../http_common";
import { SERVICE_NAMES, USER_DOMAINS, HTTP_STATUS } from '../../../sipsder_constants';

const stateToUrl = {
  "userType" : USER_DOMAINS.USER_TYPE,
  "userSex" : USER_DOMAINS.USER_SEX,
  "userEthnic" : USER_DOMAINS.USER_ETHNIC,
  "userPhoneType" : USER_DOMAINS.USER_TELEPHONE_TYPE,
  "academicLevel" : USER_DOMAINS.ACADEMIC_LEVEL,
  "userGender" : USER_DOMAINS.USER_GENDER,
  "userDisability" : USER_DOMAINS.DISABILITY,
  "userMoves" : USER_DOMAINS.MOVE,
}

export const actions = {
  //recibe el dominio que se desea consultar.
  async loadDomains({commit, dispatch}, payload) {
    if (!payload.domain || !(payload.domain in stateToUrl)) {
      return new Promise((resolve, reject) => {
        reject("unknown domain");
      });
    }

    let res = "OK";
    try {
      let path = `${SERVICE_NAMES.USER_DOMAINS}/${stateToUrl[payload.domain]}`
      let response = await VAPI.get(path);

      if (response && response.status === HTTP_STATUS.OK) {
        let arr = response.data.data;
        let dataSelectedFormat =  arr.map(domain => {
          return {text: domain.value, value: domain};
        });

        commit(`setDomain`, {domain: payload.domain, data: dataSelectedFormat});

      } else {
        commit(`setDomain`, {domain: payload.domain, data: []});

      }

    } catch (error) {
      console.error(error)
      res = error;
    }

    return new Promise((resolve, reject) => {
      if (res === "OK") {
        resolve(res);
      } else {
        reject(res);
      }
    });
  },
  
}