// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { toInteger } from "lodash";

/* eslint-disable */
const { info } = require("firebase-functions/lib/logger");
/* eslint-disable */
const fetch = require("node-fetch");
/* eslint-disable */
const cors = require("cors")({ origin: true });

admin.initializeApp();

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.saveScore = functions.https.onRequest(
  (request: functions.https.Request, response: functions.Response) => {
    cors(request, response, async () => {
      // Grab the text parameter.
      const name = request.query.name;
      const score = request.query.score;
      const difficulty = request.query.difficulty;

      // Push the new message into Firestore using the Firebase Admin SDK.
      const writeResult = await firestore.collection("leaderboard").add({
        score: toInteger(score),
        name,
        difficulty: toInteger(difficulty),
      });

      // Send back a message that we've successfully written the message
      response.json({ result: `Record with ID: ${writeResult.id} added.` });
    });
  }
);

interface Record {
  name: string;
  score: number;
  difficulty: string;
}

const auth = async () => {
  var raw = `grant_type=client_credentials&client_id=${
    functions.config().tcgplayer.public_key
  }&client_secret=${functions.config().tcgplayer.private_key}`;

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: raw,
    redirect: "follow" as RequestRedirect,
  };

  try {
    let res = await fetch("https://api.tcgplayer.com/token", requestOptions);

    const authData = await res.json();
    return authData;
  } catch (e) {
    info(e);
    throw e;
  }
};

exports.auth = functions.https.onRequest(
  (request: functions.https.Request, response: functions.Response) => {
    cors(request, response, async () => {
      try {
        let authData = await auth();
        response.json(authData);
      } catch (e) {
        response.status(500).send();
      }
    });
  }
);

exports.getProduct = functions.https.onRequest(
  (request: functions.https.Request, response: functions.Response) => {
    cors(request, response, async () => {
      // response.set("Access-Control-Allow-Credentials", "true");
      // response.set("Cache-Control", "no-cache");
      // response.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,HEAD");
      // response.set(
      //   "Access-Control-Allow-Headers",
      //   "Content-Type,Authorization"
      // );

      // Grab the text parameter.
      // const fabDbIdentifier = request.query.identifier;
      let tcgPlayerToken = request.headers["x-authorization"];
      info(
        "tcgplayer token",
        tcgPlayerToken,
        request.headers,
        request.rawHeaders
      );
      if (!tcgPlayerToken) {
        // tcgPlayerToken = await auth();
        info("fetched", tcgPlayerToken);
      }
      // TODO: Get tcgplayer id from fabdb identifier fabDbIdentifier
      // fabDbIdentifier

      const productId = 1027;

      var requestOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: tcgPlayerToken,
          "Content-Type": "application/json",
        },
        redirect: "follow" as RequestRedirect,
      };

      try {
        let res = await fetch(
          `https://api.tcgplayer.com/v1.37.0/pricing/product/${productId}`,
          requestOptions
        );

        let productData = await res.json();
        console.log("productData", productData);
        if (productData.success) {
          response.json(productData);
        } else {
          response.status(401).send();
        }
      } catch (e) {
        info("error", e);
        response.status(500).send();
      }
      response.status(200).send();
    });
  }
);

exports.getLeaderboard = functions.https.onRequest(
  (request: functions.https.Request, response: functions.Response) => {
    cors(request, response, async () => {
      // Default to easy
      let difficulty = toInteger(request.query.difficulty) || 0;

      // What is the minimum score to return?
      const minScore = difficulty === 0 ? 1200 : 1600;
      const numLeaderboardRecords = 20;

      var leaderboardRef = firestore.collection("leaderboard");

      console.log("getting leaderboard", difficulty, minScore);
      try {
        let results = await leaderboardRef
          .where("score", ">=", minScore)
          .where("difficulty", "==", difficulty)
          .orderBy("score", "desc")
          .limit(numLeaderboardRecords)
          .get();

        let leaderboard: Record[] = [];
        results.forEach((doc) => {
          leaderboard.push(doc.data() as Record);
        });
        response.json(leaderboard);
      } catch (e) {
        console.log("failed getting leaderboard", e);
        response.status(500).send();
      }
    });
  }
);
