
import axios from 'axios';
export default function ApiCall (url){

    return axios.get(url)
        .then(function (response) {
            return (response);
        })
        .catch(function (error) {
            console.log(error);
        });
}