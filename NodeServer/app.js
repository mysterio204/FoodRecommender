(function () {
    "use strict";
    /* eslint-env node */

    /* required node modules */
    var express = require("express");
    var path = require("path");
    var fs = require("fs");
    var cors = require("cors");
    var csvtojson = require("csvtojson");
    var mysql = require('mysql');


    /* http server */
    var server = express();

    /* mensa data */
    var data = {};

    /* configuration */
    var PORT = 3333;
    var WWW = path.join(__dirname, "./www/");
    var DATA = path.join(__dirname, "./data/");
    //var ZUTATEN = path.join(DATA, "zutaten.csv");


    var connection = null;

    /**
     * returns the meal served on a given day
     */
    function getMealForDay(day) {
        return data[day];
    }

    /**
     * loads the csv formatted mensa data (day,meal) and stores it in a lookup table
     */
    function initConnection() {

        connection = mysql.createConnection({
            host: "132.199.143.90",
            user: "rezepteapp",
            password: "r$z4ptE1?P",
            database: "rezepteapp"
        });


        connection.connect(function (err) {
            if (err) {
                throw err;
            }
        });

    }

    function query(queryString, callback) {
        connection.query(queryString, function (err, res, fields) {
            if (err) throw callback(err, null);

            var queryResult = [];

            for (var i in res) {
                var recipe = {
                    recipe_href: res[i].recipe_href,
                    title: res[i].title,
                    ratingsCount : res[i].Bewertungen,
                    rating : res[i].numstars,
                    ratingAvrg : res[i].average,
                    forPersons : res[i].furPersonen,
                    img : res[i].img_href,
                    ingredients : res[i].zutaten,
                    difficulty : res[i].Schwierigkeitsgrad,
                    time : res[i].Zubereitungszeit,
                    money : res[i].Preiskategorie,
                    kcal : res[i].kcal
                };

                queryResult.push(recipe);
            }
            callback(null, queryResult);
        });
        //connection.end();
    }


    function getFavoriteQuery(arr) {
        var query = "WHERE ";
        for (var i = 0; i < arr.length; i++) {
            if (i == arr.length - 1) {
                query += "recipe_href = '" + arr[i] + "'";
            } else {
                query += "recipe_href = '" + arr[i] + "'" + "OR ";
            }
        }
        return query;

    }





    /**
     * starts serving a static web site from ./www
     * starts routing api requests from /api/get/
     */
    function start() {
        var queryString = "";

        server.use(cors());
        server.get("/api/get/recommended", function (req, res) {
            var proile = req.params[0];
            queryString = "SELECT * FROM `kochbar_recipes` ORDER BY RAND() LIMIT 20";
            query(queryString, function (err, data) {
                res.send(data);
            });

        });

        server.get("/api/get/all", function (req, res) {
            var proile = req.params[0];
            queryString = "SELECT * FROM `kochbar_recipes` ORDER BY average DESC LIMIT 20";
            query(queryString, function (err, data) {
                res.send(data);
            });

        });
        server.get("/api/get/zutaten", function (req, res) {
            var proile = req.params[0];
            res.send(ZUTATEN);

        });
        server.get("/api/get/single/*", function (req, res) {
            var id = req.params[0];
            var proile = req.params[0];
            queryString = "SELECT * FROM `kochbar_recipes` WHERE recipe_href = '" + id + "'";
            console.log(queryString);
            query(queryString, function (err, data) {
                res.send(data);
            });

        });


        server.get("/api/get/favorites/*", function (req, res) {
            var idArray = JSON.parse(req.params[0]);
            console.log(idArray);
            var favoriteQuery = getFavoriteQuery(idArray);
            queryString = "SELECT * FROM `kochbar_recipes` " + favoriteQuery;
            console.log(queryString);
            query(queryString, function (err, data) {
                res.send(data);
            });
        });


        server.use(express.static(WWW));
        server.listen(PORT);
    }

    initConnection();
    start();
}());
