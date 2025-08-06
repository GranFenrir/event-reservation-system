import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ReportingService } from './reporting.service';

@Controller('reports')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get()
  findAll(@Query('type') type?: string) {
    return this.reportingService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportingService.findOne(id);
  }

  @Post('generate')
  generate(@Body() generateReportDto: any) {
    return this.reportingService.generateReport(generateReportDto);
  }

  @Get('analytics/dashboard')
  getDashboardData() {
    return this.reportingService.getDashboardData();
  }

  @Get('analytics/sales')
  getSalesReport(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.reportingService.getSalesReport(startDate, endDate);
  }

  @Get('analytics/events')
  getEventsReport() {
    return this.reportingService.getEventsReport();
  }
}
