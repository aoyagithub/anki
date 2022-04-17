<script>
import { Doughnut } from "vue-chartjs";

export default {
  props: ["data"],
  extends: Doughnut,
  data() {
    return {
      chartData: {
        labels: ["Correct", "Wrong"],
        datasets: [
          {
            borderWidth: 2,
            borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 100, 132, 1)"],
            backgroundColor: [
              "rgba(54, 162, 235, 0.8)",
              "rgba(255, 100, 132, 0.8)",
            ],
            data: this.data,
          },
        ],
      },
      options: {
        legend: {
          display: true,
          reverse: true,
          labels: {
            fontSize: 20,
            fontColor: "#fff",
            fontFamily: "'Avenir', 'Helvetica', 'Arial', sans-serif",
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Chart",
          fontSize: 28,
          fontColor: "#fff",
          fontFamily: "'Avenir', 'Helvetica', 'Arial', sans-serif",
        },
      },
    };
  },
  mounted() {
    if (this.$store.getters.desktop) {
      this.options.title.fontSize = 28;
      this.options.title.padding = 20;
      this.options.legend.labels.fontSize = 20;
    } else {
      this.options.title.fontSize = 20;
      this.options.legend.labels.fontSize = 16;
    }
    this.renderChart(this.chartData, this.options);
  },
};
</script>
<style>
.chart {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 10;
  border: 2px solid #fff;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.5);
}
.close {
  top: 24px;
  right: 20px;
}
</style>
