import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { MatDialog } from '@angular/material/dialog';

import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { HttpService } from 'src/app/services/http.service';
import { UpdateMemberComponent } from 'src/app/dialog/update-member/update-member.component';
import { DeleteMemberComponent } from 'src/app/dialog/delete-member/delete-member.component';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  gridColumns: Array<any> = [];

  teamMembers: Array<any> = [];

  sortDir = -1;
  isSelected: boolean = false;
  constructor(private httpService: HttpService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getTeamMembers();
  }

  ngAfterViewInit() {
    this.createChartColumn();
    this.createChartGauge();
  }

  createChartColumn() {
    let data: Array<any> = [];

    data = [
      {
        name: 'Ratings',
        data: [10, 20, 15, 20, 10, 20, 15, 10, 10, 25, 20, 20],
        color: '#EEEEEE',
      },
      {
        name: 'Ratings',
        data: [20, 30, 15, 20, 10, 30, 20, 20, 20, 25, 25, 20],
        color: '#b366ff',
      },
      {
        name: 'Ratings',
        data: [30, 35, 15, 30, 10, 40, 30, 30, 30, 35, 35, 20],
        color: '#8a00e6',
      },
    ];

    const chart = Highcharts.chart(
      'chart-column' as any,
      {
        chart: {
          type: 'column',
        },
        credits: false,
        title: null,
        legend: {
          enabled: false,
        },
        xAxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          title: {
            text: 'Month',
            margin: 20,
          },
        },

        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'Security rating',
            margin: 20,
          },
        },

        tooltip: {
          format:
            '<b>{key}</b><br/>{series.name}: {y}<br/>' +
            'Total: {point.stackTotal}',
        },

        plotOptions: {
          column: {
            stacking: 'normal',
          },
          crisp: true,
        },

        series: data,
      } as any
    );
  }

  createChartGauge() {
    const chart = Highcharts.chart('chart-gauge', {
      chart: {
        type: 'solidgauge',
      },
      title: null,
      credits: {
        enabled: false,
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        center: ['20%', '85%'],
        size: '120%',
        background: {
          borderWidth: 0,
          backgroundColor: '#EEE',
          innerRadius: '100%',
          outerRadius: '85%',
          shape: 'arc',
        },
      },
      yAxis: {
        min: 0,
        max: 300,
        lineWidth: 0,
        tickWidth: 0,
        stops: [
          [0.1, '#a31aff'], // green
          [0.5, '#a31aff'], // yellow
          [0.9, '#a31aff'], // red
        ],
        minorTickInterval: null,
        tickAmount: 0,
        labels: {
          enabled: false,
        },
      },
      plotOptions: {
        solidgauge: {
          innerRadius: '85%',
          dataLabels: {
            y: -25,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },
      plotBands: [
        {
          from: 0,
          to: 100,
          color: '#e7f2f8',
          innerRadius: '105%',
          outerRadius: '110%',
        },
      ],
      tooltip: {
        enabled: false,
      },
      series: [
        {
          name: null,
          data: [240],
          dataLabels: {
            format:
              '<div style="text-align: center"><span style="font-size: 1.25rem">{y}</span></div>',
          },
        },
      ],
    } as any);
  }

  getTeamMembers() {
    this.httpService.getTeamMembers().subscribe((res: any) => {
      console.log(res);

      this.gridColumns = res.grid_columns;
      this.teamMembers = res.grid_data;
    });
  }

  onSortClick(event: any) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-arrow-up')) {
      classList.remove('fa-arrow-up');
      classList.add('fa-arrow-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-arrow-up');
      classList.remove('fa-arrow-down');
      this.sortDir = 1;
    }
    this.sortArr();
  }

  sortArr() {
    this.teamMembers.sort((a, b) => {
      a = a.status.toLowerCase();
      b = b.status.toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }

  updateMember(member: any) {
    this.dialog.open(UpdateMemberComponent, {
      data: member,
    });
  }

  deleteMember(member: any) {
    this.dialog
      .open(DeleteMemberComponent)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const index = this.teamMembers.findIndex((ele) => {
            return ele.id === member.id;
          });

          this.teamMembers.splice(index, 1);
        }
      });
  }
}
