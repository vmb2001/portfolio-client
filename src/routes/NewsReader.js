import { React, useEffect, useState } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import NewsCards from "../components/NewsCards";
import { Card, Col, Row, Container } from "react-bootstrap";
import "./NewsReader.css";
import wordsToNumbers from "words-to-numbers";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";

const NewsReader = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticles, setActiveArticles] = useState(-1);

  const cardBodyStyles = {
    backgroundColor: "#2a2a2a",
    padding: "3rem",
  };

  const cardTitleStyles = {
    marginBottom: "2rem",
  };

  const cardTextStyles = {
    marginTop: "9rem",
  };

  const properties = [
    {
      color: "#ff6a00",
      header: "SEARCH BY SOURCE",
      title: "SOURCES",
      subtitle: "ABC News, CNN News, BBC News, The Hindu..",
      text: "Try Saying: Give me the news from BBC News",
    },
    {
      color: " #ff8800",
      header: "SEARCH BY CATEGORY",
      title: "CATEGORIES",
      subtitle: "Sports, Health, General, Entertainment..",
      text: "Try Saying: Whats the latest news on Health",
    },
    {
      color: "#ffa600",
      header: "SEARCH BY TERM",
      title: "TERMS",
      subtitle: "Bitcoin, Technology, Science, Laptops..",
      text: "Try Saying: Whats new in science",
    },
  ];

  const alanKey =
    "4c77011f1f59a42214bf1f58239a36592e956eca572e1d8b807a3e2338fdd0dc/stage";

  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: (commandData) => {
        if (commandData.command === "newNews") {
          setNewsArticles(commandData.articles);
        } else if (commandData.command === "highlight") {
          setActiveArticles(commandData.i);
        } else if (commandData.command === "open") {
          let parseNum = commandData.num;
          if (isNaN(parseNum)) {
            parseNum = wordsToNumbers(commandData.num, { fuzzy: true });
          }
          const articleIndex = parseNum - 1;

          console.log(commandData.savedArticles[articleIndex].url, "_blank");
          const articleUrl = commandData.savedArticles[articleIndex].url;
          window.open(articleUrl, "_blank");
        }
      },
    });
  }, []);

  return (
    <div className="news-reader">
      {/* Deciding what cards to display */}
      {!newsArticles.length ? (
        //If no articles fetched yet, show home page cards
        <div>
          <h1 className="news-head">NEWS READER</h1>
          <Link to="/">
            <h1 className="home-link">Portfolio.</h1>
          </Link>
          <Container>
            <Row>
              {properties.map((variant, index) => (
                <Col key={index}>
                  <Card
                    bg="dark"
                    text="white"
                    style={{
                      width: "25rem",
                      backgroundColor: `${variant.color}`,
                      minHeight: "30rem",
                      fontSize: "1.3rem",
                    }}
                    className="mb-2"
                  >
                    <Card.Header
                      style={{
                        backgroundColor: `${variant.color}`,
                        padding: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <b>{variant.header}</b>
                    </Card.Header>
                    <Card.Body style={cardBodyStyles}>
                      <Card.Title style={cardTitleStyles}>
                        {variant.title}
                      </Card.Title>
                      <Card.Subtitle className="lead">
                        {variant.subtitle}{" "}
                      </Card.Subtitle>
                      <Card.Text style={cardTextStyles}>
                        <i>{variant.text}</i>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      ) : (
        // If articles fetched display them as cards
        <div>
          <h1 className="news-head result">NEWS READER</h1>
          <a className="go-back">
            <FaIcons.FaArrowCircleLeft onClick={() => setNewsArticles("")} />
          </a>
          <NewsCards articles={newsArticles} activeArticles={activeArticles} />
        </div>
      )}
    </div>
  );
};

export default NewsReader;
