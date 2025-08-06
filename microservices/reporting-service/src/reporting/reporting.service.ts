import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async findAll(type?: string): Promise<Report[]> {
    const query = this.reportRepository.createQueryBuilder('report');
    
    if (type) {
      query.where('report.type = :type', { type });
    }
    
    return query.orderBy('report.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Report> {
    return this.reportRepository.findOne({ where: { id } });
  }

  async generateReport(generateReportDto: any): Promise<Report> {
    const report = this.reportRepository.create({
      name: generateReportDto.name,
      type: generateReportDto.type,
      description: generateReportDto.description,
      parameters: generateReportDto.parameters,
      status: 'PENDING',
    });

    const savedReport = await this.reportRepository.save(report);
    
    // Process the report asynchronously
    this.processReport(savedReport.id);
    
    return savedReport;
  }

  async getDashboardData() {
    // Mock dashboard data - in real implementation, this would query actual data
    return {
      totalEvents: 25,
      totalReservations: 150,
      totalRevenue: 45000,
      totalUsers: 320,
      recentReports: await this.reportRepository.find({
        take: 5,
        order: { createdAt: 'DESC' },
      }),
    };
  }

  async getSalesReport(startDate?: string, endDate?: string) {
    // Mock sales data - in real implementation, this would query payment service
    return {
      period: {
        startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: endDate || new Date().toISOString(),
      },
      totalSales: 45000,
      transactionCount: 150,
      averageTransaction: 300,
      salesByDay: [
        { date: '2025-06-25', amount: 2500, transactions: 8 },
        { date: '2025-06-26', amount: 3200, transactions: 12 },
        { date: '2025-06-27', amount: 1800, transactions: 6 },
        { date: '2025-06-28', amount: 4100, transactions: 15 },
        { date: '2025-06-29', amount: 2900, transactions: 10 },
      ],
    };
  }

  async getEventsReport() {
    // Mock events data - in real implementation, this would query event service
    return {
      totalEvents: 25,
      activeEvents: 8,
      completedEvents: 15,
      cancelledEvents: 2,
      eventsByCategory: [
        { category: 'Concert', count: 10 },
        { category: 'Sports', count: 7 },
        { category: 'Theater', count: 5 },
        { category: 'Conference', count: 3 },
      ],
      popularEvents: [
        { name: 'Summer Music Festival', reservations: 45 },
        { name: 'Tech Conference 2025', reservations: 38 },
        { name: 'Basketball Championship', reservations: 32 },
      ],
    };
  }

  private async processReport(reportId: string) {
    try {
      const report = await this.findOne(reportId);
      if (!report) return;

      // Update status to processing
      await this.reportRepository.update(reportId, { status: 'PROCESSING' });

      // Simulate report processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock report data based on type
      let reportData = {};
      switch (report.type) {
        case 'sales':
          reportData = await this.getSalesReport();
          break;
        case 'events':
          reportData = await this.getEventsReport();
          break;
        default:
          reportData = { message: 'Report generated successfully' };
      }

      // Update report with data
      await this.reportRepository.update(reportId, {
        status: 'COMPLETED',
        data: reportData,
      });

      this.logger.log(`Report ${reportId} processed successfully`);
    } catch (error) {
      this.logger.error(`Failed to process report ${reportId}:`, error);
      await this.reportRepository.update(reportId, {
        status: 'FAILED',
        error_message: error.message,
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyReports() {
    this.logger.log('Generating daily reports...');
    
    // Generate daily sales report
    await this.generateReport({
      name: `Daily Sales Report - ${new Date().toISOString().split('T')[0]}`,
      type: 'sales',
      description: 'Automated daily sales report',
      parameters: {
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
      },
    });
  }
}
