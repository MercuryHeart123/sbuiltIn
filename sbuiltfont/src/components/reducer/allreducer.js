import { combineReducers } from "redux";
import Loginreducer from "./Loginreducer";

const Allreducer = combineReducers({
    username: Loginreducer,
});
export default Allreducer;
