// IMPORTANT!! function App() si class App2 sunt ECHIVALENTE (fac exact acelasi lucru, diferenta e cea dintre componenta functie si componenta clasa, adica doar de tipul componentei, adica user-ul in browser nu ar marca nicio diferenta)


import React, { useState, useEffect, useRef, useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import p5 from 'p5';

import { HashRouter, Switch, Route, Link } from 'react-router-dom';


function Login(props) {
  return (
    <>
      OK THIS IS THE LOGIN PAGE
      <br/>
      <Link to='/'>BACK (1)</Link>
      <br/>
      <Link to='/register'>GO REGISTER FIRST</Link>
    </>
  );
}

function Register(props) {
  return (
    <>
      OK THIS IS THE REGISTER PAGE
      <br/>
      <Link to='/'>BACK TO root</Link>
    </>
  );
}

function OnlyDisplayingLength(props) {
  return (
    <>
      only length is {props.length}
    </>
  );
}
//


function Desenu(props) {
  const myref = useRef(null);
  const [myP5, setMyP5] = useState(null);
  const [firstSession, setFirstSession] = useState(true);

  const initialTraj = {playerTrajectory: []};

  const reducer = (state, action) => {
    return {
      playerTrajectory: action.playerTrajectory, 
      enemyTrajectory: action.enemyTrajectory, 
      pointsNumber: action.pointsNumber, 
      gameStats: action.gameStats, 
      timelapse: action.timelapse
    };
  }

  const [state, dispatch] = useReducer(reducer, initialTraj);

  const rawTrajectory = []; // player's trajectory
  var timelapse = 0;
  var pointsNumber = 0; // doar pentru player, pt ca enemy va avea mereu lungimea sarpelui 100

  const enemyTrajectory = [];
  var enemyPosition;

  var win;
  var loss;

  var gameStats = {
    score: 100,
    win: true,
    loss: false
  };

  const inRange = (posA, posB, t) => {
    const distance = Math.sqrt(Math.pow(posB.y - posA.y, 2), Math.pow(posB.x - posA.x, 2));
    //if (t % 10 === 0) console.log('distance ' + distance);
    return distance < 1;
  }

  const Sketch = (p) => {  // aici se fac doar WRITES la state

    p.setup = () => {   // se apeleaza DOAR LA INCEPUT (la frame-ul ZERO)
      p.createCanvas(700, 700);
      p.background(51); 
      timelapse = 0;
      pointsNumber = 100;

      enemyPosition = {x : 0, y : 100};

      win = false;
      loss = false;
    }

    p.mouseDragged = () => {  // se apeleaza in fiecare frame in care am CLICK-UL APASAT
      rawTrajectory.push({ x : p.mouseX, y : p.mouseY });
      if (rawTrajectory.length > pointsNumber) {
        var mostBehindPoint = rawTrajectory[0];
        p.noStroke();
        p.fill(51);
        p.ellipse(mostBehindPoint.x, mostBehindPoint.y, 21, 21);
        rawTrajectory.shift();

        const lastPlayerPosition = rawTrajectory[rawTrajectory.length - 1];
        enemyTrajectory.forEach(enemyPoint => {
          if (!loss && !win && inRange(lastPlayerPosition, enemyPoint, timelapse)) {
            console.log('GAME WON!!!!');
            win = true;
          }
        });
      }

      timelapse++;
      if (timelapse % 200 === 0)
        pointsNumber++;

      p.noStroke();
      p.fill(210, 155, 155);
      p.ellipse(p.mouseX, p.mouseY, 20, 20);
    }

    p.draw = () => {  // SE APELEAZA INTOTDEAUNA (LA FIECARE, FIECARE FRAME)
      if (rawTrajectory.length > 0) {
        const lastPlayerPosition = rawTrajectory[rawTrajectory.length - 1];
        const distanceInBetween = Math.sqrt(Math.pow(lastPlayerPosition.x - enemyPosition.x, 2) + Math.pow(lastPlayerPosition.y - enemyPosition.y, 2));
        const direction = {   // directia NORMALIZATA
          x: (lastPlayerPosition.x - enemyPosition.x) / distanceInBetween, 
          y: (lastPlayerPosition.y - enemyPosition.y) / distanceInBetween
        };
        p.noStroke();
        p.fill(100, 100, 100);
        p.ellipse(enemyPosition.x, enemyPosition.y, 15, 15);

        enemyTrajectory.push(enemyPosition);
        if (enemyTrajectory.length > 100) {
          var mostBehindPoint = enemyTrajectory[0];
          p.noStroke();
          p.fill(51);
          p.ellipse(mostBehindPoint.x, mostBehindPoint.y, 16, 16);
          enemyTrajectory.shift();

          rawTrajectory.forEach(playerPoint => {
            if (!loss && !win && inRange(enemyPosition, playerPoint, timelapse)) {
              console.log('GAME LOST!!!!');
              loss = true;
            }
          });
        }
        // update la enemy position, adica next move:
        enemyPosition = {
          x: enemyPosition.x + direction.x, 
          y: enemyPosition.y + direction.y
        };
      }

      gameStats = {           // CU ASTA RAMANE PLAYERUL LA FINAL! CASTIG/LOSS (+ DACA CASTIGA => PRIMESTE SCORE-UL score)
        score: state.pointsNumber,
        win: win,
        loss: loss
      }

      dispatch({playerTrajectory: rawTrajectory, enemyTrajectory: enemyTrajectory, pointsNumber: pointsNumber, gameStats: gameStats, timelapse: timelapse});
    }
  }

  useEffect(() => {
    if (firstSession) {
      setMyP5(new p5(Sketch, myref.current));
      setFirstSession(false);
    }
  });

  /*if (gameStats.win)
    return (
      <>
        GAME FUCKING WON!
      </>
    );

  if (gameStats.loss)
    return (
      <>
        GAME FUCKING LOST!
      </>
    );*/

  return (  // aici se face doar READS la state
    <>
      Deseneaza aici:
      <div ref={myref}>
      </div>
      <h1>You have {state.playerTrajectory.length} points!!</h1>
      <h1>You have {state.timelapse} timelapse!!</h1>
      <h1>You really have {state.pointsNumber} points!!</h1>
    </>
  );

}
//


function App() {
  return (
    <>
      <HashRouter baseName='/'>
        <Switch>

          <Route exact path={'/'}>
            Alege-ti ruta la care vrei sa navighezi:
            <br/>
            <Link to='/login'>Login here</Link>
            <br/>
            <Link to='/register'>Register here</Link>
            <br/>
            <Link to='/desenu'>Jocul</Link>
            Gata, astea sunt toate! Alege una!
          </Route>

          <Route path='/login'>
            <Login />
            <br/>
            <Link to='/'>BACK(2)</Link>
          </Route>

          <Route path='/register'>
            <Register />
          </Route>

          <Route path='/desenu'>
            <Desenu />
          </Route>

        </Switch>
      </HashRouter>
    </>
  );
}



class App2 extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }

  Sketch = (p) => {

    p.setup = () => {
      p.createCanvas(200, 200);
      p.background(51);
    }

    p.mouseDragged = () => {
      console.log('Sending: ' + p.mouseX + ',' + p.mouseY);

      p.noStroke();
      p.fill(255);
      p.ellipse(p.mouseX, p.mouseY, 60, 60);
    }
  }

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current)
  }

  render() {
    return (
      <div ref={this.myRef}>

      </div>
    )
  }
}
//

export default App;




