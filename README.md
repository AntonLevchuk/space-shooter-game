# Space Shooter Game
A 2D space shooter game built with PixiJS, TypeScript, and Webpack. 
Battle through waves of enemies and a final boss in a fast-paced, arcade-style environment. 
Activate boosters, dodge enemy fire, and survive to complete the mission.

## Game Description
You control a spaceship and progress through three levels:

- **Level 1**: Destroy asteroids falling from the sky.
- **Level 2**: Fight off enemy ships that shoot or charge at you.
- **Level 3**: Defeat a powerful boss with multiple attack patterns.

Each level becomes progressively more difficult. 
After completing a level, your performance is rated with a 3-star system based on speed and survivability. 
A temporary booster grants extra armor to help you during tough situations.

## Game Configuration
- In the src/Configs folder, you can find the configuration files the game is based on. To change the difficulty of the levels or customize them further, take a look at GameCfg.json. There you can configure the enemies for each level, the level duration, even change the level order. Also you can change the sounds volume there.
- To change the control settings, check the HeroCfg.json file. There you'll find key bindings for controlling the player. You can also customize your hero's attributes there.

## Controls
| Key       | Action                                                        |
|-----------|---------------------------------------------------------------|
| `W`       | Move up                                                       |
| `A`       | Move left                                                     |
| `S`       | Move down                                                     |
| `D`       | Move right                                                    |
| `Space`   | Shoot                                                         |
| Mouse     | Click the booster button on the right side to activate shield |

## How to Run the Project Locally
Follow these steps to set up and run the game locally on your machine:

- ***Clone the repository***
- ***bash*** 
git clone https://github.com/AntonLevchuk/space-shooter-game.git
cd space-shooter-game
git checkout dev

- ***Install dependencies***
npm install

- ***If you run into dependency resolution issues, try:***
npm install --legacy-peer-deps

- ***Build the production version***
npx webpack --mode production
- The compiled files will be located in the dist/ directory
- To build the development version -> npx webpack --mode development

- ***Start the development server***
npx webpack serve

- ***Then open your browser and navigate to:***
http://localhost:3000
