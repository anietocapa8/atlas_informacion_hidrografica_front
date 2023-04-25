import VAPI from "../../../http_common";
import {SERVICE_NAMES} from "../../../sipsder_constants";

const getEmailDomain = (state, payload) => {
    state.EmailDomain = payload.data;
};

const getEmailDomainAll = (state, payload) => {
    state.EmailDomainAll = payload.data['data'];
};

const setEmailDomainTotalRegisters = (state, playload) => {
    state.EmailDomainTotalRegisters = playload;
}

const getEmailDomainPages = (state, payload) => {
    state.EmailDomainPages[payload.page] = payload['data'];
    // console.log("Pages " + payload['data']);
    state.EmailDomainPages = Object.assign({}, state.EmailDomainPages);
}

const resetEmailDomainPages = (state, payload) => {
    state.EmailDomainPages = {};
    state.EmailDomainPages = Object.assign({}, state.EmailDomainPages);
}

const getEmailDomainQuery = (state, payload) => {
    state.EmailDomainQuery = payload;
    state.EmailDomainQuery = Object.assign({}, state.EmailDomainQuery);
}

const getEmailDomainMeta = (state, payload) => {
    state.EmailDomainTotalRegisters = payload.data['meta']['totalElements'];
};

const setEmailDomain = (state, payload) => {
    // safe added to email domain added array
    safeInsertion(state.EmailDomainAdded, payload);
    // safe added data to emailDomain added
    if (state.EmailDomainAll === undefined) {
        state.EmailDomainAll = [];
    }
    for (let i = 0; i < state.EmailDomainAdded.length; i++) {
        safeInsertion(state.EmailDomainAll, state.EmailDomainAdded[i]);
    }
    // call to safe pagination
    safePagination(state, {data: state.EmailDomainAll, size: 5, currentPage: 0});
    // set values to show
    state.EmailDomain = state.EmailDomainPages[0];
};

const safePagination = (state, payload) => {
    // set Total registers
    state.EmailDomainTotalRegisters = payload.data.length;
    let totalPages = Math.ceil(state.EmailDomainTotalRegisters / payload.size);
    // console.log("Total pages safe pagination " + totalPages);
    // console.log("Current page " + payload.currentPage);
    for (let i = payload.currentPage; i < totalPages; i++) {
        let firstIndex = payload.size * i;
        let lastIndex = payload.size * i + payload.size;
        if (lastIndex > payload.data.length) {
            lastIndex = state.EmailDomainTotalRegisters;
        }
        state.EmailDomainPages[i] = payload.data.slice(firstIndex, lastIndex);
    }
};

const deleteEmailDomain = (state, payload) => {
    if (payload !== undefined && payload !== null) {
        // find in array
        if (state.EmailDomainAll !== undefined) {
            // find element to eliminate
            let index = state.EmailDomainAll.findIndex(x => x.domain.toUpperCase() === payload.domain.toUpperCase());
            if (index > -1) {
                state.EmailDomainAll.splice(index, 1);
            }
        }
        if (state.EmailDomainAdded.length > 0) {
            let index2 = state.EmailDomainAdded.findIndex(x => x.domain.toUpperCase() === payload.domain.toUpperCase());
            if (index2 > -1) {
                state.EmailDomainAdded.splice(index2, 1);
            }
        }
        if (payload.id !== -1) {
            // delete from back
            VAPI.delete('/' + SERVICE_NAMES.EMAIL_DOMAIN + '/' + payload.id).then(response => {
                if (response.status === 200) {
                    // console.log("elemento Borrado con éxito")
                }
            }).catch(error => {
                console.log("Delete error " + error)
            });
        }
        // update pagination
        safePagination(state, {data: state.EmailDomainAll, size: 5, currentPage: 0});
        state.EmailDomain = state.EmailDomainPages[0];
    }


};

const safeInsertion = (array, newEmailDomain) => {
    // console.log("safe checking " + newEmailDomain.domain);
    // check that value doesn't exist in the array and then insert
    let index = array.findIndex(x => x.domain.toUpperCase() === newEmailDomain.domain.toUpperCase());
    if (index === -1) {
        array.unshift(newEmailDomain);
    }
};

const clearEmailDomainAdded = (state, playload) => {
    state.EmailDomainAdded = [];
    state.EmailDomain = undefined;
};

export default {
    getEmailDomain,
    getEmailDomainPages,
    getEmailDomainQuery,
    resetEmailDomainPages,
    getEmailDomainMeta, setEmailDomain,
    deleteEmailDomain,
    clearEmailDomainAdded,
    setEmailDomainTotalRegisters,
    getEmailDomainAll,
    safePagination
}