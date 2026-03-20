import axios from "axios";
import cheerio from "cheerio";

export const extractContent = async (url) => {

    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const content = $("article").text();

    return content;

}