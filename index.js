
/**
 * @author SteiNNx
 * @version 0.0.1-Beta 
 * @description WebScrapping Sample Random
 */
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs');

const PORT = 8080;
const app = express();
const URL = 'https://production-na01-cencosud.demandware.net/s/Paris/jugueteria/api+cat+dodo+funko+kd/?start=0&sz=40';

/**
 * 
 * @param {string} url url del sitio de prod de paris xddd
 * @param {string} pathNameFile ruta destino json con datos
 */
const getDataToJsonFromUrl = (url, pathNameFile) => {
    axios(url)
        .then((result) => {
            const html = result.data;
            const $ = cheerio.load(html);
            const list_funkopop = [];

            $('.js-product-position', html).each(function (i) {
                let title = $(this).find('.ellipsis_text:first').text();
                let image_url = $(this).find('img:nth-child(2)').attr('data-src');

                console.log(image_url);
                list_funkopop[i] = {
                    title,
                    image_url,
                };
            });

            fs.writeFileSync(pathNameFile, JSON.stringify(list_funkopop, null, 4));

        }).catch((err) => {
            console.log(err);
        });
}

/**
 * Ejecucion Codigo
 */
getDataToJsonFromUrl(URL, "./result.json");

/**
 * Listener Server
 */
app.listen(PORT, () => console.log(`Server running in port ${PORT}`));


