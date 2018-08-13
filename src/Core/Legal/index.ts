import Axios from 'axios';

const Showdown = require('showdown');

const converter = new Showdown.Converter();

export async function extractLegal(path: string): Promise<string> {
    const { data } = await Axios.get(path);

    return data as string;
}

export async function extractHtmlLegal(path: string): Promise<string> {
    const content = await extractLegal(path);

    return converter.makeHtml(content);
}
