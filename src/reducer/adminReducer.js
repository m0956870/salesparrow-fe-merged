export const initialState = null;

export const reducer = (state, action) => {
    if (action.type = "ADMIN"){
        return action.payload;
    }
    return state;
}