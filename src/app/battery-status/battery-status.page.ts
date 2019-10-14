import { Subscription } from "rxjs";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { Chart } from "chart.js";
import MQTTService from "../mqqt-connection.service";
@Component({
  selector: "app-battery-status",
  templateUrl: "./battery-status.page.html",
  styleUrls: ["./battery-status.page.scss"]
})
export class BatteryStatusPage implements OnInit, OnDestroy {
  @ViewChild("barCanvas", { static: true }) barCanvas: ElementRef;
  @ViewChild("doughnutCanvas", { static: true }) doughnutCanvas: ElementRef;
  @ViewChild("lineCanvas", { static: true }) lineCanvas: ElementRef;
  constructor(private mqtt: MQTTService) {}

  private barChart: Chart;
  private doughnutChart: Chart;
  private lineChart: Chart;

  private batteriesSubscription: Subscription;
  private batteries = new Map();
  private dataset = [0, 0, 0, 0, 0];

  updateChart(chart: Chart, dataset: any[]) {
    chart.data.datasets[0].data.forEach((element, index) => {
      chart.data.datasets[0].data[index] = dataset[index];
    });
    chart.update();
  }

  ngOnDestroy() {
    this.batteriesSubscription.unsubscribe();
  }

  ngOnInit() {
    this.batteriesSubscription = this.mqtt.getBatteries().subscribe(b => {
      console.log("subscribe to batteries");
      if (b.size !== 0) {
        this.dataset[0] = b.get("living");
        this.dataset[1] = b.get("kitchen");
        this.dataset[2] = b.get("dining");
        this.dataset[3] = b.get("toilet");
        this.dataset[4] = b.get("bedroom");
        console.log(this.dataset);
        this.updateChart(this.barChart, this.dataset);
        this.updateChart(this.doughnutChart, this.dataset);
        this.updateChart(this.lineChart, this.dataset);
      } else {
        console.log("b.size", b.size);
      }
    });

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Living", "Kitchen", "Dining", "Toilet", "Bedroom"],
        datasets: [
          {
            label: "Battery levels",
            data: [0, 0, 0, 0, 0],
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
            label: "Battery levels",
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
            label: "Battery levels",
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
}
