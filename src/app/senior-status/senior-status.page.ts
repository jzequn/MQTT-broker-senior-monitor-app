import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Subscription } from "rxjs";
import MqqtConnectionService from "../mqqt-connection.service";
import { Chart } from "chart.js";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
@Component({
  selector: "app-senior-status",
  templateUrl: "./senior-status.page.html",
  styleUrls: ["./senior-status.page.scss"]
})
export class SeniorStatusPage implements OnInit, OnDestroy {
  @ViewChild("barCanvas", { static: true }) barCanvas: ElementRef;
  @ViewChild("doughnutCanvas", { static: true }) doughnutCanvas: ElementRef;
  @ViewChild("lineCanvas", { static: true }) lineCanvas: ElementRef;

  private barChart: Chart;
  private doughnutChart: Chart;
  private lineChart: Chart;
  constructor(
    private mqtt: MqqtConnectionService,
    private localNotifications: LocalNotifications
  ) {}

  private messageList: any[] = [];
  private messageListSubscription: Subscription;

  private lastDetectMotion = new Map();
  private lastDetectMotionSubscription: Subscription;
  private initiatedDate = new Date();
  private timeDifference = new Date();
  private timeDifferenceSubscription: Subscription;

  fetchTimeDifference() {
    const initialTime = +this.initiatedDate - +this.timeDifference;
    if (initialTime !== 0) {
      if (this.timeDifference.getMinutes >= 5) {
        this.localNotifications.schedule({
          id: 1,
          text: "No motion detected for 5 mins",
          sound: null,
          data: { secret: "key_data" }
        });
      }
    }
    return initialTime === 0 ? "no motion" : this.timeDifference.getMinutes();
  }

  fetchImage() {
    let place = "";
    if (this.lastDetectMotion.size !== 0) {
      if (this.lastDetectMotion.has("0")) {
        return `../../assets/img/house.jfif`;
      } else {
        place = this.lastDetectMotion.get("place");
        if (place === undefined) {
          place = "house";
        }
        return `../../assets/img/${place}.jfif`;
      }
    } else {
      return `../../assets/img/house.jfif`;
    }
  }

  // update the place string and charts
  fetchPlace() {
    const livingData = this.fetchData("living");
    const kitchenData = this.fetchData("kitchen");
    const diningData = this.fetchData("dining");
    const toiletData = this.fetchData("toilet");
    const bedroomData = this.fetchData("bedroom");
    const dataset = [
      livingData,
      kitchenData,
      diningData,
      toiletData,
      bedroomData
    ];
    this.updateChart(this.barChart, dataset);
    this.updateChart(this.doughnutChart, dataset);
    this.updateChart(this.lineChart, dataset);
    return "In the lovely " + this.lastDetectMotion.get("place");
  }

  lastMotion() {
    if (this.lastDetectMotion.size !== 0) {
      return this.lastDetectMotion.has("0")
        ? "Em, there is no motion detected yet"
        : // : this.lastDetectMotion.get("1");
          this.fetchTimeDifference();
    } else {
      return "Wait ..., the app need some data from sensor, this could take some time.";
    }
  }

  lastPlace() {
    if (this.lastDetectMotion.size !== 0) {
      return this.lastDetectMotion.has("0")
        ? "Em, there is no motion detected yet"
        : this.fetchPlace();
    } else {
      return "Wait ..., the app need some data from sensor, this could take some time.";
    }
  }

  fetchData(place: string) {
    if (this.lastDetectMotion.has(place)) {
      return this.lastDetectMotion.get(place);
    } else {
      return 0;
    }
  }

  updateChart(chart: Chart, dataset: any[]) {
    chart.data.datasets[0].data.forEach((element, index) => {
      chart.data.datasets[0].data[index] = dataset[index];
    });
    chart.update();
  }

  ngOnInit() {
    this.mqtt.connect();
    this.messageListSubscription = this.mqtt
      .getMessageList()
      .subscribe(list => {
        if (list != null) {
          this.messageList = list;
        }
        this.barChart.update();
      });
    this.lastDetectMotionSubscription = this.mqtt
      .getLastDetectedMotion()
      .subscribe(m => {
        this.lastDetectMotion = m;
      });

    this.timeDifferenceSubscription = this.mqtt
      .getTimeDifference()
      .subscribe(t => {
        this.timeDifference = t;
      });

    // charts
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Living", "Kitchen", "Dining", "Toilet", "Bedroom"],
        datasets: [
          {
            label: "Frequency of occurence",
            data: [0, 0, 0, 0, 0],
            // data: [65, 59, 81, 56, 55],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: ["Living", "Kitchen", "Dining", "Toilet", "Bedroom"],
        datasets: [
          {
            label: "Frequency of occurence",
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF6384",
              "#36A2EB"
            ]
          }
        ]
      }
    });

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      data: {
        labels: ["Living", "Kitchen", "Dining", "Toilet", "Bedroom"],
        datasets: [
          {
            label: "Frequency of occurence",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0, 0, 0, 0, 0],
            spanGaps: false
          }
        ]
      }
    });
  }

  ngOnDestroy() {
    this.messageListSubscription.unsubscribe();
    this.lastDetectMotionSubscription.unsubscribe();
  }
}
