import React from "react";
import { Container } from "react-bootstrap";
import ProfileInfo from "../components/ProfileInfo";
import LibraryList from "../components/LibraryList";
import { useLibrary } from "../js/useLibrary";
import "../css/account.css";

export default function Account() {
  const { library, removeGame } = useLibrary();

  return (
    <Container className="mt-5">
      <h2>Account Page</h2>
      <ProfileInfo />
      <LibraryList library={library} removeGame={removeGame} />
    </Container>
  );
}
