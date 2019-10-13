# MQTT Broker with ionic 4 and angular 8 frameworks

## Related links

1.[Eclipse Paho - MQTT and MQTT-SN software](https://www.eclipse.org/paho/clients/js/)

2.[paho.mqtt.javascript/paho-mqtt.js at master · eclipse/paho.mqtt.javascript](https://github.com/eclipse/paho.mqtt.javascript/blob/master/src/paho-mqtt.js)

3.[HIVEMQ broker](http://www.hivemq.com/demos/websocket-client/)

## Angular8 service

```
As long as the service is not created again, all the components can share the same service and its data.
```

1.[RxMarbles: Interactive diagrams of Rx Observables](https://rxmarbles.com/)

## Ionic4 tutorial

1.[Ionic Tabs](https://www.youtube.com/watch?v=_BnCRIZ1nDk)

2.[Adding Responsive Charts & Graphs to Ionic Applications | joshmorony - Learn Ionic & Build Mobile Apps with Web Tech](https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/)

3.[Push - Ionic Documentation](https://ionicframework.com/docs/native/push)

4.[Chart.js · Chart.js documentation](https://www.chartjs.org/docs/latest/)

5.[Ionicons](https://ionicframework.com/docs/v3/ionicons/)

6.[Theming in IONIC v4.x - Narendra Singh Rathore - Medium](https://medium.com/@nsrathore/theming-in-ionic-v4-x-603693693b91)

## Angular8 tutorial

1.[Rxjs subject](https://blog.angulartraining.com/rxjs-subjects-a-tutorial-4dcce0e9637f) 2.[Angular - ViewChild](https://angular.io/api/core/ViewChild)

## Git

[Cache git password with timeout](https://help.github.com/en/articles/caching-your-github-password-in-git)

## Typescript

1.[Map - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

2.[TypeScript - Strings - Tutorialspoint](https://www.tutorialspoint.com/typescript/typescript_strings.htm)

3.[TypeScript - String split() - Tutorialspoint](https://www.tutorialspoint.com/typescript/typescript_string_split.htm)

4.[javascript - Copy array items into another array - Stack Overflow](https://stackoverflow.com/questions/4156101/copy-array-items-into-another-array)

## Use the host set up in uni through ssh connection

```
1.Run the command in terminal
    ssh -L 8883:localhost:8883 username@barretts.ecs.vuw.ac.nz

2.Then open http://www.hivemq.com/demos/websocket-client/ in the browser, set host to localhost.

3.Connect to host, subscribe to swen325/a3 topic to get messages
```

## Parse Date in typescript

[Date.parse() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)

```
const time = "2019-10-13 18:00:10";
const time2 = "2019-10-13 18:10:10";
const parseTime = Date.parse(time);
const date = new Date(parseTime);
const date2 = new Date(Date.parse(time2));
console.log(date);
console.log(date2);
console.log(date2-date);

result:
> Sun Oct 13 2019 18:00:10 GMT+1300 (New Zealand Daylight Time)
> Sun Oct 13 2019 18:10:10 GMT+1300 (New Zealand Daylight Time)
> 600000

600000 in milliseconds
```
