import Axios, {AxiosPromise} from 'axios';

const Showdown = require("showdown");

const converter = new Showdown.Converter();


function extractLegal(path: string): AxiosPromise {
    return Axios.get(path).then((response) => {
        return response.data
    });
}

function extractHtmlLegal(path: string): AxiosPromise {
    return extractLegal(path).then((content) => {
        return converter.makeHtml(content);
    });
}


export {
    extractLegal as extractLegal,
    extractHtmlLegal as extractHtmlLegal
};