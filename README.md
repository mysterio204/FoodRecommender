# FoodRecommender

This is a project for the Class "Algorithmen für Mensch-Maschine-Interaktion" at University of Regensburg (WS 16/17)

## Installation

You must have [node.js] and its package manager (npm) installed. You can get them from http://nodejs.org/. 
Just clone the repository and navigate to the directory of the project with your command line.
To install the Ionic Framework including its dependecies, run:
```sh
npm install -g ionic
```

To run the application in your browser run:
```sh
ionic serve
```
This way you can test your application without installing it on any device. Using the „serve“ command, ionic will update the application running in your browser everytime you save any changes.

If you want to run the Application on a Device, you have to run: 
```sh
ionic run <platform>
```
where <platform> can be android, ios or windows.
(Note that running the app on an ios device requires a MacOS-Enviroment)

If you dont‘t have a device, you can use the emulator, and run the app via
```sh
ionic emulate android
```
or 
```sh
ionic emulate ios
```
The SDK and the emulator should be pre-installed.


For further explanation see http://ionicframework.com/docs/cli/
