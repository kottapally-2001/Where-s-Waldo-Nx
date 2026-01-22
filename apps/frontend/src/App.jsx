import React, { useEffect } from "react";
import initGame from "./game";

export default function App() {
  useEffect(() => initGame(), []);

  return (
    <main className="app">
      <header className="topbar">
        <h1>Find Waldo</h1>
        <div className="scoreboard">
          <div id="timer">00:00</div>
          <button id="startBtn" className="btn small">Start</button>
          <button id="resetBtn" className="btn small">Reset</button>
        </div>
      </header>

      <section className="game-area">
        <div className="image-wrap">
          <img id="scene" src="/images/Waldo.jpg" alt="waldo"/>
          <div id="markers" className="markers"></div>
        </div>
      </section>

      <footer className="footer">
        Built By Sai Charan Kottapally — Find Waldo Game
      </footer>
    </main>
  );
}
