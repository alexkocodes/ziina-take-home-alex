# Ziina Take Home 
## How to run this app
1. cd into this folder
```
cd ziina-take-home
```
2. install all dependencies
```
npm install
```
3. run this app!
```
npm start
```

The app should pop up on your browser at this step. This React app allows users to drag the blue boxes on the left anywhere on the screen and on top of the red box. It displays the total visible area of the red box that is not covered by the blue boxes by subtracting the total blue area inside the red. 

A special consideration that I had was that the blue boxes can also overlap with each other inside the red box; in that case, the total visible area of the red box should be updated correctly by treating all overlapping blue boxes as one area. The user is also able to click the Toggle button on the top to turn the blue boxes into blue circles. :)
