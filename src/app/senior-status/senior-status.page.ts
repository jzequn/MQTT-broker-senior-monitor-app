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
  constructor(private mqtt: MqqtConnectionService) {}

  private messageList: any[] = [];
  private messageListSubscription: Subscription;

  private lastDetectMotion: any;
  private lastDetectMotionSubscription: Subscription;
  private timeDifference: Date;
  private timeDifferenceSubscription: Subscription;
  ngOnInit() {
    this.messageListSubscription = this.mqtt
      .getMessageList()
      .subscribe(list => {
        if (list != null) {
          this.messageList = list;
        }
      });

    this.lastDetectMotionSubscription = this.mqtt
      .getLastDetectedMotion()
      .subscribe(m => {
        console.log("subscribe to last detected motion");
        console.log("last detected motion", m);
        this.lastDetectMotion = m;
      });

    this.timeDifferenceSubscription = this.mqtt
      .getTimeDifference()
      .subscribe(t => {
        console.log("subscribe to timedifferece");
        console.log("time Differece", t);
        this.timeDifference = t;
      });

    // charts
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Living", "Kitchen", "Dining", "Toilet", "Bedroom"],
        // , "Orange"
        datasets: [
          {
            label: "Frequency of occurence",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
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
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
            ]
          }
        ]
      }
    });

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July"
        ],
        datasets: [
          {
            label: "My First dataset",
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
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false
          }
        ]
      }
    });
  }
  ngOnDestroy() {
    this.messageListSubscription.unsubscribe();
  }
}
