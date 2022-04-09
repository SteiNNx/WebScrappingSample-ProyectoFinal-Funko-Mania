
/**
 * @author SteiNNx
 * @version 0.0.2-Beta 
 * @description WebScrapping Sample Random
 */
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs');

const PORT = 8080;
const app = express();
const URL_1 = 'https://production-na01-cencosud.demandware.net/s/Paris/jugueteria/api+cat+dodo+funko+kd/?start=0&sz=40';
const URL_2 = 'https://production-na01-cencosud.demandware.net/s/Paris/jugueteria/api+cat+dodo+funko+kd/?start=40&sz=40';


/**
 * 
 * @param {string} stringPrice 
 * @returns {string}
 */
const cleanPrice = stringPrice => {
    return stringPrice
        .replace(".", "")
        .replace("$", "");
}

/**
 * 
 * @param {string} url url del sitio de prod de paris xddd
 * @param {string} pathNameFile ruta destino json con datos
 */
const getDataToJsonFromUrl = async (url, pathNameFile) => {
    await axios(url)
        .then((result) => {
            const html = result.data;
            const $ = cheerio.load(html);
            const list_funkopop = [];

            console.log("|-----------------------------------|");
            console.log("|------------ Iniciado -------------|");
            console.log("|-----------------------------------|");

            $('.js-product-position', html).each(function (i) {
                let title = $(this)
                    .find('.ellipsis_text:first')
                    .text();

                let image_url = $(this)
                    .find('img:nth-child(2)')
                    .attr('data-src');

                let price = $(this)
                    .find('.price__text:first')
                    .text()
                    .trim();

                price = cleanPrice(price);

                list_funkopop[i] = {
                    title,
                    image_url,
                    price,
                };
                console.log(`Migrated: ${i} ${title}`)
            });

            fs.writeFileSync(pathNameFile, JSON.stringify(list_funkopop, null, 4));
            console.log("|-----------------------------------|");
            console.log("|-------- Proceso Terminado --------|");
            console.log("|-----------------------------------|");
        }).catch((err) => {
            console.log(err);
        });
}

/**
 * Ejecucion Codigo
 */
const startMigrate = async () => {
    await getDataToJsonFromUrl(URL_1, "./api/result.json");
    await getDataToJsonFromUrl(URL_2, "./api/result2.json");
    process.exit(1)
}

startMigrate();

/**
 * Listener Server
 */
app.listen(PORT, () => console.log(`Server running in port ${PORT}`));


