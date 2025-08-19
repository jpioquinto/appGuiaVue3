<script lang="ts">
import { reactive } from 'vue'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
//const props = defineProps(['series', 'anio']);

export default {
  props: ['series', 'anio'],
  setup(props) {
    const datos = reactive(props.series || [])
    return {
      datos: datos,
      anio: props.anio,
    }
  },
  mounted() {
    const root = am5.Root.new(this.$refs.chartdiv)

    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        layout: root.verticalLayout,
      }),
    )

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      }),
    )

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: am5xy.AxisRendererX.new(root, {
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      }),
    )

    xAxis.data.setAll(this.datos || [])

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      }),
    )

    function makeSeries(name, fieldName, datos, fill) {
      const configSeries = {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        /*fill: am5.color(0x095256),
                    stroke: am5.color(0x095256),*/
        valueYField: fieldName,
        categoryXField: 'category',
      }
      if (fill) {
        configSeries['fill'] = am5.color(fill)
      }
      const series = chart.series.push(am5xy.ColumnSeries.new(root, configSeries))

      series.columns.template.setAll({
        tooltipText: '{name}, {categoryX}:{valueY}',
        width: am5.percent(90),
        tooltipY: 0,
      })

      series.data.setAll(datos || [])

      series.appear()

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: '{valueY}',
            fill: root.interfaceColors.get('alternativeText'),
            centerY: 0,
            centerX: am5.p50,
            populateText: true,
          }),
        })
      })

      legend.data.push(series)
    }

    makeSeries(`SIGIRC ${this.anio}`, 'puntaje', this.datos, '#3273dc')
    makeSeries(`Estimación ${this.anio}`, 'estimacion', this.datos, '#cc0f35')
    makeSeries('Modelo Óptimo', 'modelo', this.datos, '#23d160')

    chart.appear(1000, 100)
  },
}
</script>

<template>
  <div class="contenedor-grafica" ref="chartdiv"></div>
</template>
