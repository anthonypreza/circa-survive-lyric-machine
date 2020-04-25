import React, { useState } from "react";
import { Col, Container, Jumbotron, Row, Spinner } from "reactstrap";
import Navbar from "./components/Navbar";
import MainForm from "./components/MainForm";
import "./App.css";

const axios = require("axios");

export default () => {
  const [loadingText, setLoadingText] = useState(false);
  const [text, setText] = useState(null);
  const [intervals, setIntervals] = useState([]);

  const pollForText = async (pollUid) => {
    console.log(`[INFO] Polling for text with UID ${pollUid}...`);
    let res = await axios.post("api/poll", {
      uid: pollUid,
    });
    return res;
  };

  const clearIntervals = () => {
    if (intervals) {
      console.log("[INFO] Clearing intervals...");
      console.log(intervals);
      intervals.forEach((id) => {
        clearInterval(id);
        console.log(`[INFO] Cleared interval ${id}`);
      });
      setIntervals([]);
    }
  };

  const generateText = async (numGenerate, startString, temperature) => {
    clearIntervals();
    setText(null);
    setLoadingText(true);
    await axios
      .post("api/generate_text", {
        numGenerate: numGenerate,
        startString: startString,
        temperature: temperature,
      })
      .then((res) => {
        let data = res.data;
        console.log(`[SUCCESS]: ${JSON.stringify(data)}`);
        let status = data["status"];
        let uid = data["uid"];
        if (status && uid) {
          let intervalId = setInterval(() => {
            pollForText(uid)
              .then((pollRes) => {
                let pollData = pollRes.data;
                console.log(`[SUCCESS]: ${JSON.stringify(pollData)}`);
                if (pollData["completed"] === true) {
                  let newText = pollData["text"];
                  console.log("[INFO] Received new text from API...");
                  clearIntervals();
                  setText(newText);
                  setLoadingText(false);
                }
                return null;
              })
              .catch((err) => {
                console.log(`[ERROR]: ${err}`);
                clearIntervals();
                setText("Error generating text.");
                setLoadingText(false);
                return null;
              });
          }, 5000);
          intervals.push(intervalId);
        }
      })
      .catch((err) => {
        console.log(`[ERROR]: ${err}`);
        clearIntervals();
        setText("Error generating text.");
        setLoadingText(false);
      });
  };

  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <Navbar />
      <Container
        style={{
          marginBottom: "30px",
        }}
      >
        <Jumbotron
          className="text-black"
          style={{ backgroundColor: "inherit", marginBottom: "0" }}
        >
          <h1 className="display-3">Circa Survive Lyric Generator</h1>
          <p className="lead">
            Generate lyrics using a deep learning model trained on the works of
            Circa Survive. Use the form below to set the number of characters to
            generate, seed the model with some starting text, and set the
            temperature.
          </p>
          <p>
            * All lyrics are owned by Circa Survive, I merely created the model
            :) Please consider supporting the band by following any of the links
            above. I will post a link to the full repository after working out
            some kinks!
          </p>
          <Row></Row>
          <img
            className="img-fluid"
            src={require("./assets/f2d2babc30c8f478d41476190867d9a7.700x300x1.jpg")}
            alt="Circa Survive"
            style={{ marginBottom: "30px" }}
          />
          <MainForm generateText={generateText} />
        </Jumbotron>
        <Row>
          {loadingText ? (
            <Col className="text-center font-weight-light">
              Generating text, this may take a couple of minutes...
              <br></br>
              <br></br>
              <Spinner type="grow" color="info" />
            </Col>
          ) : text ? (
            <Col className="text-center font-weight-light">
              {text.split("\n").map((item, i) => {
                return (
                  <span key={i}>
                    {item}
                    <br></br>
                  </span>
                );
              })}
            </Col>
          ) : null}
        </Row>
      </Container>
      <footer
        className="footer"
        style={{
          backgroundColor: "white",
          textAlign: "center",
          width: "100%",
          height: "30px",
        }}
      >
        <span className="text-muted">
          Made with{" "}
          <span role="img" aria-label="love">
            ❤️
          </span>{" "}
          in LA by{" "}
          <a href="https://github.com/anthonypreza" target="_other">
            ap.
          </a>
        </span>
      </footer>
    </div>
  );
};
