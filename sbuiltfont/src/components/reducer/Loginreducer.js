const Loginreducer = (state = false, action) => {
    switch (action.type) {
        case 'login':
            state = action.data;
            return state;

        case 'logout':
            state = false;
            return state;
        default:
            return state;
    }

}

export default Loginreducer;