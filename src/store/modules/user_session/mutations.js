function hasPagePermission (pageName, currentPermissions) {
  if (currentPermissions) {
    return pageName in currentPermissions;
  }
  return false;
};

function checkPermission (link, currentPermissions, drop) {
  link.hasPermission = false;
  if (link.children && link.children.length !== 0) {
    for (var i = link.children.length - 1; i >= 0; i--) {
      if (checkPermission(link.children[i], currentPermissions, drop)) {
        link.hasPermission = true;  
      } else if (drop) {
        link.children.splice(i, 1);
      }
    }
  }
  else if (link.page) {
    link.hasPermission = hasPagePermission(link.page.alias, currentPermissions);
  }
  return link.hasPermission;
};

export const mutations = {
  setCurrentUser (state, payload) {
    state.currentUser = payload;
    if (payload) {
      localStorage.setItem('currentUser', JSON.stringify(payload));
    }
    else {
      localStorage.removeItem('currentUser');
    }
    
  },
  setCurrentRoles (state, payload) {
    state.currentRoles = payload;
    if (payload) {
      localStorage.setItem('currentRoles', JSON.stringify(payload));
    }
    else {
      localStorage.removeItem('currentRoles');
    }
  },
  setCurrentPermissions (state, payload) {
    state.currentPermissions = payload;
    if (payload) {
      localStorage.setItem('currentPermissions', JSON.stringify(payload));
    }
    else {
      localStorage.removeItem('currentPermissions');
    }
  },
  setAuthenticated (state, payload) {
    state.authenticated = payload;
    if (payload) {
      localStorage.setItem('authenticated', payload);
    } else {
      localStorage.removeItem('authenticated');
    }
  },
  setError (state, payload) {
    state.error = payload;
  },
  setErrorCode (state, payload) {
    state.errorCode = payload;
  },
  increaseLoading (state) {
    state.loading += 1;
  },
  decreaseLoading (state) {
    // funciona sin la condicion pero se deja en un posible caso de fallar
    if (state.loading <= 0) {
      state.loading = 0;
    } else {
      state.loading -= 1;
    }

    // state.loading -= 1
  },
  setNotificationEvent (state, payload) {
    state.notificationEvent = payload;
  },
  setIdle (state, payload) {
    state.idel = payload;
  },
  setMain (state, payload) {
    state.main = payload;
    checkPermission(state.main, state.currentPermissions, true)
    if (payload) {
      localStorage.setItem('main', JSON.stringify(payload));
    }
    else {
      localStorage.removeItem('main');
    }
  },
  setSidebar (state, payload) {
    state.sidebar = payload;
    checkPermission(state.sidebar, state.currentPermissions, true)
    if (payload) {
      localStorage.setItem('sidebar', JSON.stringify(payload));
    }
    else {
      localStorage.removeItem('sidebar');
    }
  },
  setLateral (state, payload) {
    state.lateral = payload;
    for (var i = state.lateral.length - 1; i >= 0; i--) {
      checkPermission(state.lateral[i].menu, state.currentPermissions, true)
      if (!state.lateral[i].menu.hasPermission) {
        state.lateral.splice(i, 1);
      }
    }
    if (payload) {
      localStorage.setItem('lateral', JSON.stringify(payload));
    }
    else {
      localStorage.removeItem('lateral');
    }
  },
  setUserTools (state, payload) {
    state.userTools = payload;
    if (payload) {
      localStorage.setItem('userTools', JSON.stringify(payload));
    }
    else {
      localStorage.removeItem('userTools');
    }
  },
  setAuthUser (state, payload) {
    state.authUser = payload;
    if (payload) {
      localStorage.setItem('authUser', JSON.stringify(payload));
    }
    else {
      localStorage.removeItem('authUser');
    }
  },
  setRouterMap (state, payload) {
    state.routerMap = payload;
    if (payload) {
      localStorage.setItem('routerMap', JSON.stringify(payload));
    }
    else {
      localStorage.removeItem('routerMap');
    }
  }
}
