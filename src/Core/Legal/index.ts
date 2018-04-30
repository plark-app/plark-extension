import Axios, {AxiosPromise} from 'axios';

const Showdown = require("showdown");

const converter = new Showdown.Converter();


function extractLegal(path: string): Promise<string> {
    return Axios.get(path).then((response) => {
        return response.data as string;
    });
}

function extractHtmlLegal(path: string): Promise<string> {
    return extractLegal(path).then((content: string) => {
        return converter.makeHtml(content);
    });
}


export {
    extractLegal as extractLegal,
    extractHtmlLegal as extractHtmlLegal
};