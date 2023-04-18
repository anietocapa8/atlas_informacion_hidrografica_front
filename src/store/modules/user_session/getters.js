import Router from "../../../router/router.js";

export const getters = {
  appTitle (state) {
    return state.appTitle;
  },
  isNotificationEvent (state) {
    return state.notificationEvent;
  },
  isAuthenticated (state) {
    state.authenticated = localStorage.getItem('authenticated') ? true : false;
    return state.authenticated;
  },
  isAuthenticated (state) {
    state.authenticated = localStorage.getItem('authenticated') ? true : false;
    return state.authenticated;
  },
  getCurrentUser (state) {
    if (!state.currentUser) {
      state.currentUser = 
        localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')): null;
    }
    return state.currentUser;
  },
  getCurrentRoles (state) {
    if (!state.currentRoles) {
      state.currentRoles =
        localStorage.getItem('currentRoles') ? JSON.parse(localStorage.getItem('currentRoles')): null;
    }
    return state.currentRoles;
  },
  getCurrentPermissions (state) {
    if (!state.currentPermissions) {
      state.currentPermissions =
        localStorage.getItem('currentPermissions') ? JSON.parse(localStorage.getItem('currentPermissions')): null;
    }
    return state.currentPermissions;
  },
  getError (state) {
    return state.error;
  },
  getErrorCode (state) {
    return state.errorCode;
  },
  isLoading (state) {
    return state.loading;
  },
  hasPermission(state) {
    return (permission) => {
      if (state.currentPermissions && state.currentPermissions[Router.currentRoute.name]) {
        return _.includes(state.currentPermissions[Router.currentRoute.name], permission);
      }
      return false;
    } 
  },
  hasPagePermission(state) {
    return (pageName) => {
      if (state.currentPermissions) {
        return  pageName in state.currentPermissions;
      }
      return false;
    }
  },  
  isIdle (state) {
    return state.idle;
  },
  getMain (state) {
    if (!state.main) {
      state.main =
        localStorage.getItem('main') ? JSON.parse(localStorage.getItem('main')): null;
    }
    return state.main;
  },
  getSidebar (state) {
    if (!state.sidebar) {
      state.sidebar =
        localStorage.getItem('sidebar') ? JSON.parse(localStorage.getItem('sidebar')): null;
    }
    return state.sidebar;
  },
  getLateral (state) {
    if (!state.lateral) {
      state.lateral =
        localStorage.getItem('lateral') ? JSON.parse(localStorage.getItem('lateral')): null;
    }
    return state.lateral;
  },
  getUserTools (state) {
    if (!state.userTools) {
      state.userTools =
        localStorage.getItem('userTools') ? JSON.parse(localStorage.getItem('userTools')): null;
    }
    return state.userTools;
  },
  getAuthUser (state) {
    if (!state.authUser) {
    state.authUser =
      localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')): null;
    }
    return state.authUser;
  },
  getRouterMap (state) {
    if (!state.routerMap) {
      state.routerMap =
        localStorage.getItem('routerMap') ? JSON.parse(localStorage.getItem('routerMap')): null;
    }
    return state.routerMap;
  },
}
