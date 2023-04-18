const setNotificationStates = (state, payload) => {
    state.NotificationStates = payload.data;
}

export default {
    setNotificationStates,
}