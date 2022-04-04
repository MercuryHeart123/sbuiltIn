import axios from "axios";

const callBase64 = async (path, model) => {
    const url = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;
    let apiPath = url + '/' + 'callbase64'
    const formData = {
        path,
    };
    if (model) {
        formData.model = true
    }

    let base64 = await axios.post(apiPath, formData)
    if (base64.status == 200) {
        return base64.data
    }
    return null
}
export default callBase64